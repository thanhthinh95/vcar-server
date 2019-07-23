//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, 0, false, true),
        _objField('name', null, -1, true, true),
        _objField('type', null, 1, true, true, [{_id: 0, name : 'Điểm dừng trong bến'},{_id : 1, name : "Điểm dừng ngoài bến"}]),
        _objField('createBy', null, 0, false, true, await _user._getAll()),
        _objField('created', null, 1, true, true),
        _objField('updateBy', null, 0, false, true, await _user._getAll()),
        _objField('updated', null, 1, true, true),
        _objField('status', null, 1, true, true, [{_id: 0, name : 'Chưa kích hoạt'},{_id : 1, name : "Kích hoạt"}]),

    ];
    
    _render(req, res, 'point', 'Quản lý điểm dừng', {
        menu : await _menu._getMenuAndActivities('point', req.session.roleIndex._id),
        points : await _point._getAll(), 
        sumRow : config.table.sumRow,
        fields : _getFields(_point, fieldShows)
    })
}

exports.getId = async function (req, res) {
    if(!_.has(req.params, '_id' || !mongoose.Types.ObjectId.isValid(req.params._id))){
        _render(req, res, 'user_info', 'Thông tin người dùng', null, null)
    }else{
        var user = await _user._getId(req.params._id);
        _render(req, res, 'user_info', 'Thông tin người dùng', {user : user}, null)
    }
}

exports.search = async function (req, res) {
    if(_.has(req.query, 'dataMatch')){
        if(_.has(req.query.dataMatch, '_id') && mongoose.Types.ObjectId.isValid(req.query.dataMatch._id)) req.query.dataMatch._id = new mongoose.Types.ObjectId(req.query.dataMatch._id)
        else delete req.query.dataMatch._id; 
        if(_.has(req.query.dataMatch, 'name')) req.query.dataMatch.name = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.name), 'i')}
    }

    if(!_.has(req.query, 'dataSort')){
        req.query.dataSort = {}
    }
    
    let data = await _point._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.create = async function (req, res) {
    let obj = req.body;
    obj.type = Number(obj.type);
    obj.status = Number(obj.status);
    obj.createBy = req.session.user._id;
    var data = await _point._create(obj);
    res.send(_output(data ? 200 : 500, null, data));  
}

exports.update = async function (req, res) {
    var dataUpdate = req.body;

    if(_.has(dataUpdate, 'type')){ 
        if(!_.isArray(dataUpdate.type)){//Neu type chi co 1 phan tu thi bien doi no thanh mang
            dataUpdate.type = [dataUpdate.type];
        }
        dataUpdate.type = _.map(dataUpdate.type, function (item) {
            return parseInt(item, 10);
        });
    }else {
        dataUpdate.type = [];
    }
    
    let data = await _point._update(dataUpdate._id, dataUpdate);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _point._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));  
}