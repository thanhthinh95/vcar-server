module.exports.getAPI = function(req, res) {
    res.send('dang thuc hien dang nhap');
}

module.exports.postAPI = async function (req, res) {
    console.log('data', req.body);
    if(!_.has(req.body, 'action')){
        res.send(_output(501));
    }else {
        let action = req.body.action;
        delete req.body.action;
        switch (action) {
            case 'verifyAccount':
                await verifyAccount(req, res);
                break;
            case 'registration'://Thuc hien dang ky tai khoan moi
                await registration(req, res);
                break;
            default:
                break;
        }
    }
}


async function registration(req, res) {    
    let obj = req.body;
    obj.password = await bcrypt.hash(req.body.password, config.bcrypt.salt);
    var data = await _customer._create(obj);
    if(data == -1) res.send(_output(500, "Số điện thoại hoặc thư điện tử đã tồn tại, Kiểm tra lại!", null));
    else res.send(_output(data ? 200 : 500, null, data)); 
}

async function verifyAccount(req, res) {
    if(_.has(req.body, 'email')){
        if(await _customer._checkExistence(req.body) > 0){
            res.send(_output(500, "Số điện thoại hoặc thư điện tử đã tồn tại, Kiểm tra lại!", null));
        }else{
            let newCode = randomCode(6);
            let mailOptions = {
                from: config.mail.user,
                to: req.body.email,
                subject: 'V-Car | XÁC THỰC TÀI KHOẢN',
                text: 'Xin chào quý khách. Mã xác thực của bạn là [' + newCode + ']. Dùng mã xác thực này để xác thực tài khoản'
            };
    
            transporterEmail.sendMail(mailOptions, function(error, result) {
                res.send(_output(error ? 500 : 200, null, newCode));  
            });
        }
    }else {
        res.send(_output(501));
    }   
}

function randomCode(length) {
    var result = '';
    var characters = '0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }
