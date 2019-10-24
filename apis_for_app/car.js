module.exports.getAPI = async function(req, res) {
    var data = await _car._getAll();
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
            case 'getId'://Thuc hien lay thong tin xe tu info_home
                await getId(req, res);
                break; 
            default:
                break;
        }
    }
}

async function getId(req, res) {    
    let aggs = [
        {$match : {_id : new mongoose.Types.ObjectId(req.body._id), status : 1}},
        {$lookup:{
            from: 'car_suppliers',
            localField: 'carSupplierId',
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

        {$lookup:{
           from: 'points',
           localField: 'pointStop',
           foreignField: '_id',
           as: 'pointStop'
        }},
        {$unwind: {path: '$pointStop', preserveNullAndEmptyArrays: true}},
        

        {$lookup:{
           from: 'car_types',
           localField: 'typeId',
           foreignField: '_id',
           as: 'typeId'
        }},
        {$unwind: {path: '$typeId', preserveNullAndEmptyArrays: true}},

        
        {$group: {
            _id: '$_id',
            nameSupplier : {$first: '$carSupplierId.name'},
            controlSea : {$first: '$controlSea'},
            imageUrl : {$first: '$imageUrl'},
            fare : {$first: '$fare'},
            type : {$first: '$typeId.name'},
            seatDiagram : {$first: '$typeId.seatDiaGram'},
            numberSeat : {$first: '$typeId.numberSeat'},
            startPoint : {$first : '$startPoint.name'},
            pointStop : {$push: '$pointStop.name'},
            endPoint : {$first : '$endPoint.name'},
        }}
    ];


    var data = await _car._getIdAPI(aggs);
    res.send(_output(data[0] ? 200 : 500, null, data[0]));
}