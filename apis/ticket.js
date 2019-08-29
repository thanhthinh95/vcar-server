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
            default:
                break;
        }
    }
}


async function getMany(req, res) {    
    let inputIds = JSON.parse(req.body.ids);
    var ids = [];

    _.each(inputIds, function(id) {
        inputIds.push(new mongoose.Types.ObjectId(id));
    })
    
    let aggs = [
        {$match : {_id : {$in : inputIds}}},
        // {$lookup:{
        //     from: 'car_suppliers',
        //     localField: 'carSupplierId',
        //     foreignField: '_id',
        //     as: 'carSupplierId'
        // }},
        // {$unwind: {path: '$carSupplierId', preserveNullAndEmptyArrays: true}},

        // {$lookup:{
        //     from: 'points',
        //     localField: 'carSupplierId.startPoint',
        //     foreignField: '_id',
        //     as: 'startPoint'
        //  }},
        //  {$unwind: {path: '$startPoint', preserveNullAndEmptyArrays: true}},

        //  {$lookup:{
        //     from: 'points',
        //     localField: 'carSupplierId.endPoint',
        //     foreignField: '_id',
        //     as: 'endPoint'
        //  }},
        //  {$unwind: {path: '$endPoint', preserveNullAndEmptyArrays: true}},

        // {$lookup:{
        //    from: 'points',
        //    localField: 'pointStop',
        //    foreignField: '_id',
        //    as: 'pointStop'
        // }},
        // {$unwind: {path: '$pointStop', preserveNullAndEmptyArrays: true}},
        

        // {$lookup:{
        //    from: 'car_types',
        //    localField: 'typeId',
        //    foreignField: '_id',
        //    as: 'typeId'
        // }},
        // {$unwind: {path: '$typeId', preserveNullAndEmptyArrays: true}},

        
        // {$group: {
        //     _id: '$_id',
        //     nameSupplier : {$first: '$carSupplierId.name'},
        //     controlSea : {$first: '$controlSea'},
        //     imageUrl : {$first: '$imageUrl'},
        //     fare : {$first: '$fare'},
        //     type : {$first: '$typeId.name'},
        //     seatDiagram : {$first: '$typeId.seatDiaGram'},
        //     numberSeat : {$first: '$typeId.numberSeat'},
        //     startPoint : {$first : '$startPoint.name'},
        //     pointStop : {$push: '$pointStop.name'},
        //     endPoint : {$first : '$endPoint.name'},
        // }}
    ];


    var data = await _ticket._getManyAPI(aggs);
    console.log(data);
    res.send(_output(data[0] ? 200 : 500, null, data[0]));
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