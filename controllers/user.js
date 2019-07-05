//get all role user
exports.getAll = async function(req, res) {
    var fieldShows = [
        _objField('_id'),
        _objField('name', 'Tên đầy đủ'),
        _objField('_id'),
        _objField('_id'),
        _objField('_id'),
        _objField('_id'),
        _objField('_id'),
        _objField('_id'),
        {field : '_id', statusShow : null},
        {field : 'name', statusShow : true, textShow : 'Tên đầy đủ', sort : true},
        {field : 'email', statusShow : true, sort : true},
        {field : 'gender', statusShow : true, sort : true},
        {field : 'roles', statusShow : true},
        {field : 'created', statusShow : true, sort : true},
        {field : 'createBy', statusShow : true,},
        {field : 'updated', statusShow : true, sort : true},
        {field : 'updateBy', statusShow : true,},
        {field : 'status', statusShow : true},
    ];
    
    _render(req, res, 'user', 'Quản lý người dùng', {
        users : await _user._getAll(), 
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