module.exports.getAPI = function(req, res) {
    res.send('dang thuc hien dang nhap');
}

module.exports.postAPI = async function (req, res) {
    console.log('API', req.body);
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
            case 'getInfo':
                await getInfo(req, res);
                break;
            case 'updateInfo':
                await updateInfo(req, res);
                break;   
            case 'updatePass':
                await updatePass(req, res);
                break;                 
            default:
                break;
        }
    }
}


async function updatePass(req, res) { ;
    let resultCheckPass = await _customer._checkPass(new mongoose.Types.ObjectId(req.body._id), req.body.oldPass);
    if(!resultCheckPass) res.send(_output(500, "Mật khẩu cũ không đúng, kiểm tra lại"));
    else {
        var obj = {
            password : await bcrypt.hash(req.body.newPass, config.bcrypt.salt)
        }
        let resultUpdatePass = await _customer._update(new mongoose.Types.ObjectId(req.body._id), obj);
        res.send(_output(resultUpdatePass ? 200 : 500, null, null));
    }
}

async function updateInfo(req, res) {    
    let obj = {
        name : req.body.name,
        numberPhone : req.body.numberPhone,
        email : req.body.email,
        gender : Number(req.body.gender)
    }
    
    let data = await _customer._update(new mongoose.Types.ObjectId(req.body._id), obj);
    res.send(_output(data ? 200 : 500, null, data));
}


async function getInfo(req, res) {    
    let data = await _customer._getId(new mongoose.Types.ObjectId(req.body._id));
    res.send(_output(data ? 200 : 500, null, data));
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
        let content = 'Xin chào, Bạn vừa yêu cầu khôi phục mật khẩu. \n';
        content += 'Mật khẩu mới của bạn là: [' + newPass + '] \n';
        content += 'Hãy sử dụng mật khẩu mới để đăng nhập hệ thống';

        let mailOptions = {
            from: config.mail.user,
            to: customer.email,
            subject: 'V-Car | KHÔI PHỤC MẬT KHẨU',
            text: content
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
            let content = 'Xin chào, mã xác thực của bạn là [' + newCode + '] \n';
            content += 'Dùng mã xác thực này để xác thực tài khoản';
            let mailOptions = {
                from: config.mail.user,
                to: req.body.email,
                subject: 'V-Car | XÁC THỰC TÀI KHOẢN',
                text: content
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