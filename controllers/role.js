//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, -1, true, true),
        _objField('name', 'Quyền truy cập', 1, true, true),
        _objField('urlDefault', 'Đường dẫn mặc định', 1, true, true),
        _objField('description', null, 1, true, true)
    ];
    
    _render(req, res, 'role', 'Quản lý Quyền Truy Cập', {
        menu : await _menu._getMenuAndActivities('role', req.session.roleIndex._id),
        sumRow : config.table.sumRow,
        fields : _getFields(_role, fieldShows)
    })
}

exports.getId = async function (req, res) {
    console.log(req.params._id);
}

exports.search = async function (req, res) {
    if(_.has(req.query, 'dataMatch')){
        if(_.has(req.query.dataMatch, '_id') && mongoose.Types.ObjectId.isValid(req.query.dataMatch._id)) req.query.dataMatch._id = new mongoose.Types.ObjectId(req.query.dataMatch._id)
        else delete req.query.dataMatch._id; 
        if(_.has(req.query.dataMatch, 'name')) req.query.dataMatch.name = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.name), 'i')}
        if(_.has(req.query.dataMatch, 'urlDefault')) req.query.dataMatch.urlDefault = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.urlDefault), 'i')}
        if(_.has(req.query.dataMatch, 'description')) req.query.dataMatch.description = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.description), 'i')}
      
    }

    if(!_.has(req.query, 'dataSort')){
        req.query.dataSort = {}
    }

    
    let data = await _role._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.create = async function (req, res) {
    let obj = req.body;
    var data = await _role._create(obj);
    res.send(_output(data ? 200 : 500, null, data));  
}

exports.update = async function (req, res) {
    let obj = req.body;
    let data = await _role._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _role._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));  
}