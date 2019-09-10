//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect, formatDate)

    let tripData = [];
    _.each(await _trip._getAll(), function(trip) {
        tripData.push({
            _id : trip._id,
            name : moment(trip.timeStart).format("HH:mm"),
        });
    })

    var fieldShows = [
        _objField('_id', null, 0, false, true),
        _objField('customerId', "Khách Hàng", -1, false, true, await _customer._getAll()),
        _objField('dateStart', "Ngày khởi hành", 1, true, true, null, 'DD/MM/YYYY'),
        _objField('tripId', "Giờ khởi hành", 1, true, true, tripData),
        _objField('fare', "Giá vé", 1, true, true),
        _objField('vote', "Đánh giá", 0, true, true),
        _objField('created', null, 0, true, true),
        _objField('updateBy', null, 0, false, true, await _user._getAll()),
        _objField('updated', null, 0, true, true),
        _objField('status', null, 1, true, true, [{_id: 0, name : 'Chưa thanh toán'},{_id : 1, name : "Đã thanh toán"},{_id : 2, name : "Đã sử dụng"}, {_id : 3, name : "Đã bị hủy"}]),
    ];
    
    _render(req, res, 'ticket', 'Quản lý vé xe', {
        menu : await _menu._getMenuAndActivities('ticket', req.session.roleIndex._id),
        sumRow : config.table.sumRow,
        fields : _getFields(_ticket, fieldShows)
    })
}

exports.getId = async function (req, res) {
    console.log(req.params._id);
}

exports.search = async function (req, res) {
    if(_.has(req.query, 'dataMatch')){
        if(_.has(req.query.dataMatch, '_id') && mongoose.Types.ObjectId.isValid(req.query.dataMatch._id)) req.query.dataMatch._id = new mongoose.Types.ObjectId(req.query.dataMatch._id)
        else delete req.query.dataMatch._id; 


        if(_.has(req.query.dataMatch, 'tripId') && mongoose.Types.ObjectId.isValid(req.query.dataMatch.tripId)) req.query.dataMatch.tripId = new mongoose.Types.ObjectId(req.query.dataMatch.tripId)
        else delete req.query.dataMatch.tripId; 

        if(_.has(req.query.dataMatch, 'customerId') && mongoose.Types.ObjectId.isValid(req.query.dataMatch.customerId)) req.query.dataMatch.customerId = new mongoose.Types.ObjectId(req.query.dataMatch.customerId)
        else delete req.query.dataMatch.customerId; 


        if(_.has(req.query.dataMatch, 'dateStart')){
            req.query.dataMatch.dateStart = {
                '$gte' : moment(req.query.dataMatch.dateStart, 'DD/MM/YYYY').startOf('day')._d,
                '$lte' : moment(req.query.dataMatch.dateStart, 'DD/MM/YYYY').endOf('day')._d
            };
        }

        
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

    
    let data = await _ticket._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.create = async function (req, res) {
    let obj = req.body;
    obj.type = Number(obj.type);
    obj.status = Number(obj.status);
    obj.createBy = req.session.user._id;
    obj.created = Date.now();
    var data = await _ticket._create(obj);
    res.send(_output(data ? 200 : 500, null, data));  
}

exports.update = async function (req, res) {
    let obj = req.body;
    obj.type = Number(obj.type);
    obj.status = Number(obj.status);
    obj.updateBy = req.session.user._id;
    obj.updated = Date.now();
    let data = await _ticket._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _ticket._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));  
}