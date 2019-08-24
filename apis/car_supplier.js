module.exports.getAPI = async function(req, res) {
    var data = await _car_supplier._getAll();
    res.send(_output(data ? 200 : 500, null, data));
}

module.exports.postAPI = async function (req, res) {
    console.log('data', req.body);
    if(!_.has(req.body, 'action')){
        res.send(_output(501));
    }else {
        let action = req.body.action;
        delete req.body.action;
        switch (action) {
            case 'searchCarSupplier'://Thuc hien tim kiem nha xe tren giao dien trang chu
                await searchCarSupplier(req, res);
                break;     
            default:
                break;
        }
    }
}


async function searchCarSupplier(req, res) {
    console.log("xin chao", req.body);
    let aggs = [
    
        {$lookup:{
           from: 'points',
           localField: 'startPoint',
           foreignField: '_id',
           as: 'startPoint'
        }},
        {$unwind: {path: '$startPoint', preserveNullAndEmptyArrays: true}},
        
        {$lookup:{
           from: 'points',
           localField: 'endPoint',
           foreignField: '_id',
           as: 'endPoint'
        }},
        {$unwind: {path: '$endPoint', preserveNullAndEmptyArrays: true}},
        
        {$lookup:{
           from: 'cars',
           localField: '_id',
           foreignField: 'carSupplierId',
           as: 'cars'
        }},
        {$unwind: {path: '$cars', preserveNullAndEmptyArrays: true}},
        
        {$lookup:{
           from: 'trips',
           localField: 'cars._id',
           foreignField: 'carId',
           as: 'cars.trips'
        }},
        
        {$match : {status : 1, 'cars.status' : 1}},
        
        {$group: {
            _id: '$_id',
            name : {$first: '$name'},
            numberPhone : {$first: '$numberPhone'},
            startPoint : {$first: '$startPoint.name'},
            endPoint : {$first: '$endPoint.name'},
            cars : {$push : '$cars'},
        }}
    ];

    var dataMatch = [];
    if(_.has(req.body, 'startPoint')){
        dataMatch.push({$or : [
            {startPoint : {'$regex' : new RegExp(_stringRegex(req.body.startPoint), 'i')}},
            {endPoint : {'$regex' : new RegExp(_stringRegex(req.body.startPoint), 'i')}},
        ]})
        
    }


    if(_.has(req.body, 'endPoint')){
        dataMatch.push({$or : [
            {endPoint : {'$regex' : new RegExp(_stringRegex(req.body.startPoint), 'i')}},
            {startPoint : {'$regex' : new RegExp(_stringRegex(req.body.startPoint), 'i')}},
        ]})
    }
    

    aggs.push({$match : {$and : dataMatch} });
    let data = await _car_supplier._searchCarSupplierAPI(aggs);


    if(data){//Tinh gia ve re nhat va dat nhat cho tung xe
        _.each(data, function (itemCarSupplier) {
            let cheapFare = 0;
            let expensive = 0
            if(itemCarSupplier.cars.length > 0) {
                cheapFare = itemCarSupplier.cars[0].fare;
                expensive = itemCarSupplier.cars[0].fare;
            }
            _.each(itemCarSupplier.cars, function (itemCar) {
                if(itemCar.fare < cheapFare) cheapFare = itemCar.fare;
                if(itemCar.fare > expensive) expensive = itemCar.fare;
            })

            itemCarSupplier.fare = cheapFare + " - " + expensive;
        })
    }
    
    res.send(_output(data ? 200 : 500, null, data));
}