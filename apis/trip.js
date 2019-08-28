module.exports.getAPI = async function(req, res) {
    var data = await _trip._getAll();
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
            case 'getCarId'://Thuc hien lay thong chuyen di tin cua xe
                await getCarId(req, res);
                break; 
            default:
                break;
        }
    }
}

async function getCarId(req, res) {    
    if(_.has(req.body, 'carId')){
        var data = await _trip._getCarIdAPI(req.body.carId);
        res.send(_output(data ? 200 : 500, null, data));
    }else{
        res.send(_output(500));
    }
}