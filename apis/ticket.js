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
            case 'getMany'://Thuc hien lay chi tiêt nhieu ticket cho payment
                await getMany(req, res);
                break;     
            case 'getManyForCusomer'://Thuc hien lay chi tiêt nhieu ticket cho khach hang
                await getManyForCusomer(req, res);
                break;               
            case 'deleteMany'://Thuc hien xoa nhieu ticket, khi bam nut tro ve, chua thanh toan thanh cong
                await deleteMany(req, res);
                break;           
            case 'getPositionSelected'://Thuc lay ra cac ghe da dat truoc do
                await getPositionSelected(req, res);
                break;    
            case 'useTicket':    
                await useTicket(req, res);
                break;        
            case 'cancelTicket':    
                await cancelTicket(req, res);
                break;      
                
            case 'voteTicket':    
                await voteTicket(req, res);
                break;                
            default:
                break;
        }
    }
}

async function voteTicket(req, res) {    
    var data = await _ticket._update(new mongoose.Types.ObjectId(req.body._id), {vote : req.body.vote});
    if(data && req.body.complain.length > 0){
        let obj = {
            ticketId : data._id,
            customerId : data.customerId,
            content : req.body.complain,
        }
        var a = await _complain._create(obj);
        console.log(a);
        

    }
    
    
    res.send(_output(data ? 200 : 500, null, data));
}

async function cancelTicket(req, res) {    
    var data = await _ticket._delete([new mongoose.Types.ObjectId(req.body._id)]);
    res.send(_output(data ? 200 : 500, null, data));
}

async function useTicket(req, res) {    
    var data = await _ticket._update(new mongoose.Types.ObjectId(req.body._id), {updated :Date.now(), status : 2});
    res.send(_output(data ? 200 : 500, null, data));
}

async function getPositionSelected(req, res) {    
    var query = {}
    query.tripId = new mongoose.Types.ObjectId(req.body.tripId);
    query.dateStart = moment(req.body.dateStart, 'DD/MM/YYYY')._d;
    var data = await _ticket._getPositionSelectedAPI(query);
    res.send(_output(data ? 200 : 500, null, data));
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

async function getManyForCusomer(req, res) {    
    let aggs = [
        {$match : {customerId : new mongoose.Types.ObjectId(req.body.customerId)}},
        {$sort : {status : 1}},
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
    res.send(_output(data ? 200 : 500, null, data));
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