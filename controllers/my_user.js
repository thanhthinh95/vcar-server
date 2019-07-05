

exports.getId = async function (req, res) {
    if(!_.has(req.params, '_id' || !mongoose.Types.ObjectId.isValid(req.params._id))){
        _render(req, res, 'my_user', 'Thông tin người dùng', null, null)
    }else{
        var user = await _user._getId(req.params._id);
        _render(req, res, 'my_user', 'Thông tin người dùng', {user : user}, null)
    }
}





exports.update = function (req, res) {
    res.send('dang thuc hien sua', req.body)
}

