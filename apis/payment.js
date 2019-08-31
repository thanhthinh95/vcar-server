module.exports.getAPI = async function(req, res) {
    var data = await _payment._getAll();
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
            case 'createNew'://Thuc hien tao moi payment
                await createNew(req, res);
                break;        
            default:
                break;
        }
    }
}



async function createNew(req, res) {    
    var ticketIds = JSON.parse(req.body.ticketIds);
    var obj = {};
    obj.ticketId = [];
    _.each(ticketIds, function (id) {
        obj.ticketId.push(new mongoose.Types.ObjectId(id));
    })

    if(_.has(req.body, 'promotionId')){
        obj.promotionId = new mongoose.Types.ObjectId(req.body.promotionId);
    }

    obj.customerId = new mongoose.Types.ObjectId(req.body.customerId);
    obj.type = req.body.type;
    obj.money = req.body.money;
    obj.discount = req.body.discount;
    obj.totalPayment = req.body.totalPayment;
    obj.status = 1;
    
    var data = await _payment._create(obj);
    if(data){//update ticket 
        await _ticket._updateManyAPI({_id : {$in : obj.ticketId}}, {status : 1});
    }

    var customer = await _customer._getId(obj.customerId);
    
    if(customer.email){
        console.log(customer.email);
        let content = 'Xin chào quý khách. \n' 
        content += 'Bạn vừa thanh toán thành công hóa đơn ' + data._id + '\n';
        content += '   - Số lượng vé: ' + data.ticketId.length + " \n";
        content += '   - Giá trị hóa đơn: ' + data.money + " VNĐ \n";
        content += '   - Giảm giá: ' + data.discount + " VNĐ \n";
        content += '   - Thành tiền: ' + data.totalPayment + " VNĐ \n";
        content += 'Chi tiết về vé xe xe tại app V-Car. Chúc bạn thượng lộ bình an!';

        let mailOptions = {
            from: config.mail.user,
            to: customer.email,
            subject: 'V-Car | Thanh toán thành công',
            text: content
        };

        transporterEmail.sendMail(mailOptions, function(error, result) {
            console.log(error, result);
            
        });
        
    }

    res.send(_output(data ? 200 : 500, null, data));
}