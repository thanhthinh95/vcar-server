module.exports.getAPI = async function(req, res) {
    var data = await _car._getAll();
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
            case 'login'://Thuc hien dang ky tai khoan moi
                await login(req, res);
                break; 
            case 'verifyAccount':
                await verifyAccount(req, res);
                break;
            case 'registration'://Thuc hien dang ky tai khoan moi
                await registration(req, res);
                break;
            case 'forgotPassword'://Thuc hien lay lai mat khau
                await forgotPassword(req, res);
                break;
                           
            default:
                break;
        }
    }
}

async function login(req, res) {    
    let data = await _customer._login(req.body.userName, req.body.password);
    if(!data) res.send(_output(500, "Tên đăng nhập hoặc mật khẩu bạn nhập không đúng"));
    else {
        res.send(_output(200, null, data));  
    }
}


async function registration(req, res) {    
    let obj = req.body;
    obj.password = await bcrypt.hash(req.body.password, config.bcrypt.salt);
    var data = await _customer._create(obj);
    if(data == -1) res.send(_output(500, "Số điện thoại hoặc thư điện tử đã tồn tại, Kiểm tra lại!", null));
    else res.send(_output(data ? 200 : 500, null, data)); 
}

async function forgotPassword(req, res) {    
    let newPass = randomPass(8);
    let hashPass = await bcrypt.hash(newPass, config.bcrypt.salt);
    let customer = await _customer._getUserName(req.body.userName);
    
    if(!customer || !await _customer._updatePassword(req.body.userName, hashPass)){//Ten Dang Nhap khong ton tai trong he thong. Update that bai
        res.send(_output(500, 'Tên đăng nhập không tồn tại trong hệ thống'));
        return;
    }else{
        let mailOptions = {
            from: config.mail.user,
            to: customer.email,
            subject: 'V-Car | KHÔI PHỤC MẬT KHẨU',
            text: 'Xin chào quý khách. Bạn vừa yêu cầu khôi phục mật khẩu. Mật khẩu mới của bạn là [' + newPass + ']. Hãy dùng mật khẩu này để đăng nhập hệ thống'
        };

        transporterEmail.sendMail(mailOptions, function(error, result) {
            res.send(_output(error ? 500 : 200));  
        });
    }
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

function randomPass(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}