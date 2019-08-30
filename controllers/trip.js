//get all role user
exports.getAll = async function (req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, 0, false, true),
        _objField('carId', null, -1, true, true, await _car._getAllForTrip()),
        _objField('type', null, 1, true, true, [{ _id: 0, name: 'Chiều ngược' }, { _id: 1, name: "Chiều xuôi" }]),
        _objField('timeStart', null, 1, true, true),
        _objField('createBy', null, 0, false, true, await _user._getAll()),
        _objField('created', null, 1, true, true),
        _objField('updateBy', null, 0, false, true, await _user._getAll()),
        _objField('updated', null, 1, true, true),
        _objField('status', null, 1, true, true, [{ _id: 0, name: 'Chưa kích hoạt' }, { _id: 1, name: "Kích hoạt" }]),
    ];

    _render(req, res, 'trip', 'Quản lý chuyến đi', {
        menu: await _menu._getMenuAndActivities('trip', req.session.roleIndex._id),
        sumRow: config.table.sumRow,
        fields: _getFields(_trip, fieldShows)
    })
}

exports.getId = async function (req, res) {
    console.log(req.params._id);
}

exports.search = async function (req, res) {
    if (_.has(req.query, 'dataMatch')) {
        if (_.has(req.query.dataMatch, '_id') && mongoose.Types.ObjectId.isValid(req.query.dataMatch._id)) req.query.dataMatch._id = new mongoose.Types.ObjectId(req.query.dataMatch._id)
        else delete req.query.dataMatch._id;
        // if(_.has(req.query.dataMatch, 'name')) req.query.dataMatch.name = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.name), 'i')}
        if (_.has(req.query.dataMatch, 'created')) {
            req.query.dataMatch.created = {
                '$gte': moment(req.query.dataMatch.created, 'DD/MM/YYYY').startOf('day')._d,
                '$lte': moment(req.query.dataMatch.created, 'DD/MM/YYYY').endOf('day')._d
            };
        }

        if (_.has(req.query.dataMatch, 'updated')) {
            req.query.dataMatch.updated = {
                '$gte': moment(req.query.dataMatch.updated, 'DD/MM/YYYY').startOf('day')._d,
                '$lte': moment(req.query.dataMatch.updated, 'DD/MM/YYYY').endOf('day')._d
            };
        }

        if (_.has(req.query.dataMatch, 'timeStart')) {
            req.query.dataMatch.timeStart =  moment('01/01/1970 ' + req.query.dataMatch.timeStart, 'DD/MM/YYYY HH:mm')._d;
        }
    }

    if (!_.has(req.query, 'dataSort')) {
        req.query.dataSort = {}
    }


    let data = await _trip._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.create = async function (req, res) {
    let obj = req.body;
    obj.type = Number(obj.type);
    obj.status = Number(obj.status);
    obj.createBy = req.session.user._id;
    obj.created = Date.now();
    let time = '01/01/1970 ' + obj.timeStart;
    console.log(time);
    
    obj.timeStart = moment(time, 'DD/MM/YYYY HH:mm')._d;
    console.log(obj.timeStart);
    
    
    var data = await _trip._create(obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.update = async function (req, res) {
    let obj = req.body;
    obj.type = Number(obj.type);
    obj.status = Number(obj.status);
    obj.updateBy = req.session.user._id;
    obj.updated = Date.now();
    obj.timeStart = moment('01/01/1970 ' + obj.timeStart, 'DD/MM/YYYY HH:mm')._d;

    let data = await _trip._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _trip._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));
}