//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, -1, false, true),
        _objField('name', 'Tên đầy đủ', 1, true, true),
        _objField('email', null, 1, true, true),
        _objField('gender', null, 1, false, true, [{_id: 0, name : 'Nữ'},{_id : 1, name : "Nam"}]),
        _objField('roles', null, 1, false, true,  await _role._getAll()),
        _objField('created', null, 1, true, true),
        _objField('createBy', null, 1, false, false),
        _objField('updated', null, 1, false, true),
        _objField('updateBy', null, 1, true, false),
        _objField('status', null, 1, false, true, [{_id: 0, name : 'Chưa kích hoạt'},{_id : 1, name : "Kích hoạt"}]),
    ];
    
    _render(req, res, 'user', 'Quản lý người dùng', {
        users : await _user._getAll(), 
        sumRow : config.table.sumRow,
        fields : _getFields(_user, fieldShows)
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