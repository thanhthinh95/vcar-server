module.exports.getAPI = async function(req, res) {
    let aggs = [
        { $match: { status: 1 } },
        {
            $lookup: {
                from: 'car_suppliers',
                localField: 'carSupplierId',
                foreignField: '_id',
                as: 'carSupplierId'
            }
        },
        { $unwind: { path: '$carSupplierId', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'points',
                localField: 'carSupplierId.startPoint',
                foreignField: '_id',
                as: 'startPoint'
            }
        },
        { $unwind: { path: '$startPoint', preserveNullAndEmptyArrays: true } },

        {
            $lookup: {
                from: 'points',
                localField: 'carSupplierId.endPoint',
                foreignField: '_id',
                as: 'endPoint'
            }
        },
        { $unwind: { path: '$endPoint', preserveNullAndEmptyArrays: true } },

        {$group: {
            _id: '$_id',
            carSupplierId : {$first: '$carSupplierId._id'},
            carSupplierName : {$first: '$carSupplierId.name'},
            name : {$first: '$name'},
            code : {$first: '$code'},
            discount : {$first: '$discount'},
            budget : {$first: '$budget'},
            dateStart : {$first: '$dateStart'},
            dateEnd : {$first: '$dateEnd'},
            startPoint : {$first : '$startPoint.name'},
            endPoint : {$first: '$endPoint.name'},
            status : {$first: '$status'},
        }}
    ]

    var data = await _promotion._getAllAPI(aggs);
    res.send(_output(data ? 200 : 500, null, data));
}


module.exports.postAPI = async function (req, res) {
    console.log('API', req.body);
    if(!_.has(req.body, 'action')){
        res.send(_output(501));
    }else {
        let action = req.body.action;
        delete req.body.action;
        switch (action) {
            case 'getForCode'://Thuc hien tao moi ticket
                await getForCode(req, res);
                break; 
        }
    }
}

async function getForCode(req, res) {
    console.log("xin chao", req.body);
    
    let aggs = [
        {$match : {code : req.body.code, status : 1}}
    ]
    
    var data = await _promotion._getForCodeAPI(aggs);
    res.send(_output(data[0] ? 200 : 500, null, data[0]));
}