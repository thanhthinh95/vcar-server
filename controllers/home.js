//get all role user
exports.getAll = async function(req, res) {
    _render(req, res, 'home', 'Trang Chủ', {
        roleIndex : req.session.roleIndex, 
        user : req.session.user}, 
    null);
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