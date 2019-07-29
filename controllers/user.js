//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, 0, false, true),
        _objField('name', 'Tên đầy đủ', -1, true, true),
        _objField('email', null, 1, true, true),
        _objField('numberPhone', null, 1, true, true),
        _objField('gender', null, 1, false, true, [{_id: 0, name : 'Nữ'},{_id : 1, name : "Nam"}]),
        _objField('birthDay', null, 0, true, true),
        _objField('created', null, 0, true, true),
        _objField('createBy', null, 0, false, false),
        _objField('updated', null, 1, true, true),
        _objField('updateBy', null, 0, true, false),
        _objField('roles', null, 1, false, true,  await _role._getAll()),
        _objField('status', null, 1, false, true, [{_id: 0, name : 'Chưa kích hoạt'},{_id : 1, name : "Kích hoạt"}]),
    ];
    
    _render(req, res, 'user', 'Quản lý người dùng', {
        menu : await _menu._getMenuAndActivities('user', req.session.roleIndex._id),        
        sumRow : config.table.sumRow,
        fields : _getFields(_user, fieldShows)
    })
}

exports.getId = async function (req, res) {
    if(!_.has(req.params, '_id' || !mongoose.Types.ObjectId.isValid(req.params._id))){
        _render(req, res, 'user_info', 'Thông tin người dùng', null, null)
    }else{
        var user = await _user._getId(req.params._id);
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

    if(!_.has(req.query, 'dataSort')){
        req.query.dataSort = {}
    }

    let data = await _user._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}





exports.create = async function (req, res) {
    let obj = req.body;
    obj.status = Number(obj.status);
    obj.gender = Number(obj.gender);
    obj.password = await bcrypt.hash(req.body.birthDay, config.bcrypt.salt);
    obj.birthDay = moment(req.body.birthDay, 'DD/MM/YYYY')._d;
    obj.createBy = req.session.user._id;
    obj.created = new Date();
    var data = await _user._create(obj);
    res.send(_output(data ? 200 : 500, null, data));  
}

exports.update = async function (req, res) {
    let obj = req.body;
    obj.status = Number(obj.status);
    obj.gender = Number(obj.gender);
    obj.password = await bcrypt.hash(req.body.birthDay, config.bcrypt.salt);
    obj.birthDay = moment(req.body.birthDay, 'DD/MM/YYYY')._d;
    obj.updateBy = req.session.user._id;
    obj.updated = new Date();

    console.log(obj);
    var data = await _user._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));  
}

exports.delete = async function (req, res) {
    var data = await _user._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));  
}