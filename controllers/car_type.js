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
    
    _render(req, res, 'car_type', 'Quản lý loại xe', {
        menu : await _menu._getMenuAndActivities('car_type', req.session.roleIndex._id),
        sumRow : config.table.sumRow,
        fields : _getFields(_car_type, fieldShows)
    })
}

exports.getId = async function (req, res) {
    console.log(req.params._id);
}



exports.search = async function (req, res) {
    if(_.has(req.query, 'dataMatch')){
        if(_.has(req.query.dataMatch, '_id') && mongoose.Types.ObjectId.isValid(req.query.dataMatch._id)) req.query.dataMatch._id = new mongoose.Types.ObjectId(req.query.dataMatch._id)
        else delete req.query.dataMatch._id; 
        if(_.has(req.query.dataMatch, 'name')) req.query.dataMatch.name = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.name), 'i')}
        if(_.has(req.query.dataMatch, 'created')){
            req.query.dataMatch.created = {
                '$gte' : moment(req.query.dataMatch.created, 'DD/MM/YYYY').startOf('day')._d,
                '$lte' : moment(req.query.dataMatch.created, 'DD/MM/YYYY').endOf('day')._d
            };
        }

        if(_.has(req.query.dataMatch, 'updated')){
            req.query.dataMatch.updated = {
                '$gte' : moment(req.query.dataMatch.updated, 'DD/MM/YYYY').startOf('day')._d,
                '$lte' : moment(req.query.dataMatch.updated, 'DD/MM/YYYY').endOf('day')._d
            };
        }
    }

    if(!_.has(req.query, 'dataSort')){
        req.query.dataSort = {}
    }

    
    let data = await _car_type._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.new = async function (req, res) {
    _render(req, res, 'car_type_new', 'Tạo mới loại xe', {
        status: [{
            _id: 0,
            name: 'Chưa kích hoạt'
        }, {
            _id: 1,
            name: "Kích hoạt"
        }],
    })
}

exports.create = async function (req, res) {
    let obj = req.body;
    obj.type = Number(obj.type);
    obj.status = Number(obj.status);
    obj.createBy = req.session.user._id;
    obj.created = Date.now();
    var data = await _car_type._create(obj);
    res.send(_output(data ? 200 : 500, null, data));  
}

exports.update = async function (req, res) {
    let obj = req.body;
    obj.type = Number(obj.type);
    obj.status = Number(obj.status);
    obj.updateBy = req.session.user._id;
    obj.updated = Date.now();
    let data = await _car_type._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _car_type._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));  
}