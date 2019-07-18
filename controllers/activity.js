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
        console.log(user);
        
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

    var data = await _activity.find(req.query.dataMatch)

    console.log(data);
    
    res.send(_output(data ? 200 : 500, null, data));
}


exports.new = function (req, res) {
    res.send('dang tao moi')
}

exports.edit = function (req, res) {
    res.send('dang thuc hien sua')
}

//Khi user thuc hien chon quyen truy cap du an
exports.create = async function (req, res) {

    if(!_.has(req.body, '_id') || !mongoose.Types.ObjectId.isValid(req.body._id)){
        return res.send(_output(501));
    }else{
        var role = await _role._getId(req.body);
        req.session.roleIndex = role;
        res.send(_output(role ? 200 : 500, null, role));
    }
}

exports.update = function (req, res) {
    res.send('dang thuc hien sua', req.body)
}

exports.delete = function (req, res) {
    res.send('dang thuc hien xoa')
}