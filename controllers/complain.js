//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, 0, false, true),
        _objField('customerId', "Khách hàng", 1, false, true, await _customer._getAll()),
        _objField('content', "Nội dung khiếu nại", 1, false, true),
        _objField('handling', "Nội dung trả lời", 1, false, true),
        _objField('created', null, 1, true, true),
        _objField('updateBy', "Người trả lời", 0, false, true, await _user._getAll()),
        _objField('updated', null, 1, true, true),
        _objField('status', null, 1, true, true, [{_id: 0, name : 'Chưa xử lý'},{_id : 1, name : "Đã xử lý"}]),
    ];
    
    _render(req, res, 'complain', 'Quản lý khiếu nại', {
        menu : await _menu._getMenuAndActivities('complain', req.session.roleIndex._id),
        sumRow : config.table.sumRow,
        fields : _getFields(_complain, fieldShows)
    })
}

exports.getId = async function (req, res) {
    console.log(req.params._id);
}

exports.search = async function (req, res) {
    if(_.has(req.query, 'dataMatch')){
        if(_.has(req.query.dataMatch, '_id') && mongoose.Types.ObjectId.isValid(req.query.dataMatch._id)) req.query.dataMatch._id = new mongoose.Types.ObjectId(req.query.dataMatch._id)
        else delete req.query.dataMatch._id; 
        if(_.has(req.query.dataMatch, 'content')) req.query.dataMatch.content = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.content), 'i')}
        if(_.has(req.query.dataMatch, 'handling')) req.query.dataMatch.handling = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.handling), 'i')}
        if(_.has(req.query.dataMatch, 'created')){
            req.query.dataMatch.created = {
                '$gte' : moment(req.query.dataMatch.created, 'DD/MM/YYYY').startOf('day')._d,
                '$lte' : moment(req.query.dataMatch.created, 'DD/MM/YYYY').endOf('day')._d
            };
        }

        if(_.has(req.query.dataMatch, 'updated')){
            req.query.dataMatch.updated = {
                '$gte' : moment(req.query.dataMatch.updated, 'DD/MM/YYYY').startOf('day')._d,
                '$lte' : moment(req.query.dataMatch.updated, 'DD/MM/YYYY').endOf('day')._d
            };
        }
    }

    if(!_.has(req.query, 'dataSort')){
        req.query.dataSort = {}
    }

    let data = await _complain._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.update = async function (req, res) {
    let obj = req.body;
    obj.status = Number(obj.status);
    obj.updateBy = req.session.user._id;
    obj.updated = Date.now();
    let data = await _complain._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));
}