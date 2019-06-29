exports.getAll = function (req, res) {
    // _user.find({}, function (error, result) {
    //     console.log(error);
    //     console.log(result);
        
        
        
    // })
    _user._new()
    
    
    res.send('day la html')
    _.render(req, res, {});
    
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