module.exports.getAPI = function(req, res) {
    res.send('dang thuc hien dang nhap');
}

module.exports.postAPI = function (req, res) {
    console.log('data', req.body);
    
    res.send('dang thuc hien tao moi tai khoan');
}
