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
            case 'search'://Thuc hien tim kiem nha xe tren giao dien trang chu
                await search(req, res);
                break;     
            default:
                break;
        }
    }
}


async function search(req, res) {
    
}