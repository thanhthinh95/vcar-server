//get all role user
exports.getAll = async function(req, res) {
    console.log('dang thuc hien get role cua user');
    var roles = await _user._getRoles(req.session.user._id);

    res.render('home', {
        title : 'Trang Chủ',
        page : 'home',
        roles : roles,
        roleIndex : null, //req.session.roleIndex ? req.session.roleIndex : null,
        user : req.session.user,
    });
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

exports.create = function (req, res) {
    res.send('dang thuc hien sua', req.body)
}

exports.update = function (req, res) {
    res.send('dang thuc hien sua', req.body)
}

exports.delete = function (req, res) {
    res.send('dang thuc hien xoa')
}