//get all role user
exports.getAll = async function(req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('_id', null, 0, false, true),
        _objField('code', null, -1, true, true),
        _objField('carSupplierId', false, 1, false, true, await _car_supplier._getAll()),
        _objField('name', null, 1, true, true),
        _objField('dateStart', null, 1, true, true),
        _objField('dateEnd', null, 1, true, true),
        _objField('amount', null, 0, true, true),
        _objField('budget', null, 1, true, true),
        _objField('discount', null, 1, true, true),
        _objField('maxDiscount', null, 0, true, true),
        
        _objField('createBy', null, 0, false, true, await _user._getAll()),
        _objField('created', null, 1, true, true),
        _objField('updateBy', null, 0, false, true, await _user._getAll()),
        _objField('updated', null, 1, true, true),
        _objField('status', null, 0, true, true, [{_id: 0, name : 'Chưa kích hoạt'},{_id : 1, name : "Kích hoạt"}]),
    ];
    
    _render(req, res, 'promotion', 'Quản lý chương trình khuyến mại', {
        menu : await _menu._getMenuAndActivities('promotion', req.session.roleIndex._id),
        sumRow : config.table.sumRow,
        fields : _getFields(_promotion, fieldShows)
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
        if(_.has(req.query.dataMatch, 'code')) req.query.dataMatch.code = {'$regex' : new RegExp(_stringRegex(req.query.dataMatch.code), 'i')}

        if(_.has(req.query.dataMatch, 'dateStart')){
            req.query.dataMatch.dateStart = {
                '$gte' : moment(req.query.dataMatch.dateStart, 'DD/MM/YYYY').startOf('day')._d,
                '$lte' : moment(req.query.dataMatch.dateStart, 'DD/MM/YYYY').endOf('day')._d
            };
        }

        if(_.has(req.query.dataMatch, 'dateEnd')){
            req.query.dataMatch.dateEnd = {
                '$gte' : moment(req.query.dataMatch.dateEnd, 'DD/MM/YYYY').startOf('day')._d,
                '$lte' : moment(req.query.dataMatch.dateEnd, 'DD/MM/YYYY').endOf('day')._d
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

    
    let data = await _promotion._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}


exports.create = async function (req, res) {
    let obj = req.body;
    if(_.has(obj, 'dateStart')){
        obj.dateStart = moment(obj.dateStart, 'DD/MM/YYYY HH:mm')._d;
    }

    if(_.has(obj, 'dateEnd')){
        obj.dateEnd = moment(obj.dateEnd, 'DD/MM/YYYY HH:mm')._d;
    }
    obj.status = Number(obj.status);
    obj.createBy = req.session.user._id;
    obj.created = Date.now();
    var data = await _promotion._create(obj);
    res.send(_output(data ? 200 : 500, data ? null : "Mã khuyến mại đã tồn tại, thử lại!", data));  
}

exports.update = async function (req, res) {
    let obj = req.body;
    obj.status = Number(obj.status);
    obj.updateBy = req.session.user._id;
    obj.updated = Date.now();

    if(_.has(obj, 'dateStart')){
        obj.dateStart = moment(obj.dateStart, 'DD/MM/YYYY HH:mm')._d;
    }

    if(_.has(obj, 'dateEnd')){
        obj.dateEnd = moment(obj.dateEnd, 'DD/MM/YYYY HH:mm')._d;
    }

    if(_.has(obj, 'amount')){
        obj.amount = Number(obj.amount);
    }else{
        obj.amount = null;
    }

    if(_.has(obj, 'budget')){
        obj.budget = Number(obj.budget);
    }else{
        obj.budget = null;
    }

    if(_.has(obj, 'discount')){
        obj.discount = Number(obj.discount);
    }else{
        obj.discount = null;
    }

    if(_.has(obj, 'maxDiscount')){
        obj.maxDiscount = Number(obj.maxDiscount);
    }else{
        obj.maxDiscount = null;
    }

    let data = await _promotion._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _promotion._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));  
}