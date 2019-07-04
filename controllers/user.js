//get all role user
exports.getAll = async function(req, res) {
    var users = await _user._getAll();
    _render(req, res, 'user', 'Quản lý người dùng', {users : users}, null)
}

exports.getId = async function (req, res) {
    console.log(req.params);
    console.log(req.query);
    
    // if(!_.has(req.body, '_id' || !mongoose.Types.ObjectId.isValid(req.body._id))){
    //     _render(req, res, 'user', 'Thông tin người dùng', null, null)
    // }else{
    //     var users = await _user._getId(req.body._id);
    //     _render(req, res, 'user', 'Thông tin người dùng', {users : users}, null)
    // }
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