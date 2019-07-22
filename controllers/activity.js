//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, -1, false, true),
        _objField('menuId', 'Menu', 1, false, true, await _menu.find({})),
        _objField('roleId', 'Quyền Truy Cập', 1, false, true, await _role._getAll()),
        _objField('type', 'Vai Trò', 1, false, true, [{_id: 1, name : 'Thêm Mới'},{_id : 2, name : "Cập Nhật"}, {_id : 3, name : "Xóa Bỏ"}]),

    ];
    
    _render(req, res, 'activity', 'Quản lý vai trò', {
        menu : await _menu._getMenuAndActivities('activity', req.session.roleIndex._id),
        activities : await _activity._getAll(), 
        sumRow : config.table.sumRow,
        fields : _getFields(_activity, fieldShows)
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
        if(_.has(req.query.dataMatch, 'email')) req.query.dataMatch.email = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.email), 'i')}

    }

    console.log(req.query);
    
    
    let data = await _activity._search(req.query.dataMatch, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.create = async function (req, res) {

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
    
    let data = await _activity._update(dataUpdate._id, dataUpdate);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _activity._delete(req.params._id);
    res.send(_output(data ? 200 : 500, null, data));  
}