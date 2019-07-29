//get all role user
exports.getAll = async function(req, res) {
    var roles = await _user._getRoles(req.session.user._id);
    _render(req, res, 'auth', 'Chọn quyền truy cập hệ thống', {roles : roles}, null)
}

exports.getId = function (req, res) {
    res.send('dang thuc hien get theo id');
    console.log(req.query);
    console.log(req.params);
}

exports.new = function (req, res) {
    res.send('dang tao moi')
}

exports.edit = function (req, res) {
    res.send('dang thuc hien sua')
}

//Khi user thuc hien chon quyen truy cap du an
exports.action = async function (req, res) {
    switch (req.params._typeAction) {
        case 'selectRole':
            await selectRole(req, res);
            break;
        default:
            break;
    }  
}

exports.update = function (req, res) {
    res.send('dang thuc hien sua', req.body)
}

exports.delete = function (req, res) {
    res.send('dang thuc hien xoa')
}

async function selectRole(req, res) {
    if(!_.has(req.body, '_id') || !mongoose.Types.ObjectId.isValid(req.body._id)){
        return res.send(_output(501));
    }else{
        var role = await _role._getId(req.body);
        req.session.roleIndex = role;
        res.send(_output(role ? 200 : 500, null, role));
    }
}