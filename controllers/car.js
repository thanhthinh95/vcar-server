//get all role user
exports.getAll = async function (req, res) {
    // _objField(field, textShow, statusShow, statusSort, statusSearch, valueSelect)
    var fieldShows = [
        _objField('carSupplierId', null, -1, true, true, await _car_supplier._getAll()),
        _objField('controlSea', null, 1, true, true),
        _objField('typeId', null, 1, true, true, await _car_type._getAll()),
        _objField('fare', null, 1, true, true),
        _objField('pointStop', null, 0, true, true, await _point._getAll()),
        _objField('createBy', null, 0, false, true, await _user._getAll()),
        _objField('created', null, 0, true, true),
        _objField('updateBy', null, 0, false, true, await _user._getAll()),
        _objField('updated', null, 0, true, true),
        _objField('status', null, 1, true, true, [{
            _id: 0,
            name: 'Tạm dừng hoạt động'
        }, {
            _id: 1,
            name: "Đang hoạt động"
        }]),
    ];

    _render(req, res, 'car', 'Quản lý xe', {
        menu: await _menu._getMenuAndActivities('car', req.session.roleIndex._id),
        sumRow: config.table.sumRow,
        fields: _getFields(_car, fieldShows)
    })
}



exports.getId = async function (req, res) {
    console.log(req.params._id);
}

exports.search = async function (req, res) {
    if (_.has(req.query, 'dataMatch')) {
        if (_.has(req.query.dataMatch, '_id') && mongoose.Types.ObjectId.isValid(req.query.dataMatch._id)) req.query.dataMatch._id = new mongoose.Types.ObjectId(req.query.dataMatch._id)
        else delete req.query.dataMatch._id;
        if (_.has(req.query.dataMatch, 'controlSeat')) req.query.dataMatch.controlSeat = {
            '$regex': new RegExp(_stringRegex(req.query.dataMatch.controlSeat), 'i')
        }
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
    }

    if (!_.has(req.query, 'dataSort')) {
        req.query.dataSort = {}
    }


    let data = await _car._search(req.query.dataMatch, req.query.dataSort, req.query.page, req.query.sumRow)
    res.send(_output(data ? 200 : 500, null, data));
}

exports.new = async function (req, res) {
    _render(req, res, 'car_new', 'Tạo mới thông tin xe', {
        carSupplier: await _car_supplier._getAll(),
        typeId: await _car_type._getAll(),
        status: [{
            _id: 0,
            name: 'Tạm dừng hoạt động'
        }, {
            _id: 1,
            name: "Đang hoạt động"
        }],
        pointStop: await _point._getAll(),
    })
}

exports.edit = async function (req, res) {
    _render(req, res, 'car_edit', 'Cập nhật thông tin xe', {
        car: await _car._getId(req.query._id),
        carSupplier: await _car_supplier._getAll(),
        typeId: await _car_type._getAll(),
        status: [{
            _id: 0,
            name: 'Tạm dừng hoạt động'
        }, {
            _id: 1,
            name: "Đang hoạt động"
        }],
        pointStop: await _point._getAll(),
    })
}

exports.create = async function (req, res) {
    let obj = req.body;
    if (_.has(obj, 'imageUrl') && !_.isArray(obj.imageUrl))
        obj.imageUrl = [obj.image_files];
    if (_.has(obj, 'pointStop') && !_.isArray(obj.pointStop))
        obj.pointStop = [obj.pointStop];

    obj.status = Number(obj.status);
    obj.createBy = req.session.user._id;
    obj.created = Date.now();
    console.log(obj);
    var data = await _car._create(obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.update = async function (req, res) {
    let obj = req.body;
    if (_.has(obj, 'imageUrl') && !_.isArray(obj.imageUrl))
        obj.imageUrl = [obj.image_files];
    if (_.has(obj, 'pointStop') && !_.isArray(obj.pointStop))
        obj.pointStop = [obj.pointStop];
    
    obj.status = Number(obj.status);
    obj.updateBy = req.session.user._id;
    obj.updated = Date.now();
    let data = await _car._update(obj._id, obj);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.delete = async function (req, res) {
    var data = await _car._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.action = async function (req, res) {
    switch (req.params._typeAction) {
        case 'upload_image':
            await uploadImage(req, res);
            break;
        case 'delete_image':
            await deleteImage(req, res);
            break;
        default:
            break;
    }
}

async function uploadImage(req, res) {
    let listUrl = [];
    let index = 0;
    if (!_.isArray(req.files.image_files)) req.files.image_files = [req.files.image_files];
    async.forEach(req.files.image_files, function (file, next) {
        fsx.mkdirp('/public/image-car', function (err) {
            index++;
            let arr = file.name.split('.');
            let url = 'image-car/' + new Date().getTime() + '_' + index + '.' + arr[arr.length - 1];

            file.mv('public/' + url, function (error) {
                listUrl.push(url);
                next();
            })
        })
    }, function (error) {
        res.send(_output(error ? 500 : 200, null, {
            urls: listUrl
        }));
    })
}

async function deleteImage(req, res) {
    if (!_.has(req.body, 'url')) {
        res.send(_output(500));
    } else {
        var url = require('url').parse(req.body.url);
        console.log(url.pathname);
        fsx.remove('public' + url.pathname, function (error) {
            res.send(_output(error ? 500 : 200));
        })

    }
}