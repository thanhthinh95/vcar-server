module.exports.getAPI = async function(req, res) {
    var data = await _ticket._getAll();
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
            case 'createNew'://Thuc hien tao moi ticket
                await createNew(req, res);
                break; 
            case 'getMany'://Thuc hien lay chi tiét nhieu ticket
                await getMany(req, res);
                break;                 
            case 'deleteMany'://Thuc hien xoa nhieu ticket, khi bam nut tro ve, chua thanh toan thanh cong
                await deleteMany(req, res);
                break;                     
            default:
                break;
        }
    }
}

async function deleteMany(req, res) {
    let inputIds = JSON.parse(req.body.ids);
    var ids = [];
    _.each(inputIds, function(id) {
        ids.push(new mongoose.Types.ObjectId(id));
    })

    var data = await _ticket._delete(ids);
    res.send(_output(data ? 200 : 500, null));
}

async function getMany(req, res) {    
    let inputIds = JSON.parse(req.body.ids);
    var ids = [];

    _.each(inputIds, function(id) {
        ids.push(new mongoose.Types.ObjectId(id));
    })
    
    let aggs = [
        {$match : {_id : {$in : ids}}},
        {$lookup:{
            from: 'trips',
            localField: 'tripId',
            foreignField: '_id',
            as: 'tripId'
        }},
        {$unwind: {path: '$tripId', preserveNullAndEmptyArrays: true}},
        
        {$lookup:{
                from: 'cars',
                localField: 'tripId.carId',
                foreignField: '_id',
                as: 'carId'
            }},
        {$unwind: {path: '$carId', preserveNullAndEmptyArrays: true}},
        

        {$lookup:{
                from: 'car_suppliers',
                localField: 'carId.carSupplierId',
                foreignField: '_id',
                as: 'carSupplierId'
            }},
        {$unwind: {path: '$carSupplierId', preserveNullAndEmptyArrays: true}},
        
        {$lookup:{
                from: 'points',
                localField: 'carSupplierId.startPoint',
                foreignField: '_id',
                as: 'startPoint'
            }},
        {$unwind: {path: '$startPoint', preserveNullAndEmptyArrays: true}},
        
        
        {$lookup:{
                from: 'points',
                localField: 'carSupplierId.endPoint',
                foreignField: '_id',
                as: 'endPoint'
            }},
        {$unwind: {path: '$endPoint', preserveNullAndEmptyArrays: true}},   
    
    
        {$project: {
            carSupplierId : "$carSupplierId._id",
            carSupplierName : "$carSupplierId.name",
            carSupplierPhone : "$carSupplierId.numberPhone",
            carId : "$carId._id",
            controlSea : "$carId.controlSea",
            startPoint : "$startPoint.name",
            endPoint : "$endPoint.name",
            timeTrip : "$tripId.timeStart",
            typeTrip : "$tripId.type",
            dateTrip : "$dateStart",
            position : 1,
            fare : 1,
            vote : 1,
            status : 1,
        }}
    ];


    var data = await _ticket._getManyAPI(aggs);
    console.log(data);
    res.send(_output(data ? 200 : 500, null, data));
}

async function createNew(req, res) {    
    var positions = JSON.parse(req.body.positions);
    var tickets = [];

    for (const key in positions) {
        tickets.push({
            tripId : new mongoose.Types.ObjectId(req.body.tripId),
            customerId : new mongoose.Types.ObjectId(req.body.customerId),
            dateStart :  moment(req.body.dateStart, 'DD/MM/YYYY')._d,
            position : key,
            fare : Number(req.body.fare),
            status : 0, //Chua thanh toan
        })
    }
    
    var data = await _ticket._createManyAPI(tickets);
    res.send(_output(data ? 200 : 500, null, data));
}