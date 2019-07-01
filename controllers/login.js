//login
exports.create = async function (req, res) {
    if(isAccount(req.body)){
        let user = await _user._login(req.body.email, req.body.password);
        if(!user) res.send(_output(502, "Email hoặc mật khẩu bạn nhập không đúng"));
        else { //login thanh cong
            req.session.user = user;
            res.send(_output(200, null, user));  
        }
    } else {
        res.send(_output(501));        
    }
}


//password_recovery
exports.update = async function (req, res) {
    if(_.has(req.body, 'email')){
        let newPass = randomPass(8);
        let hashPass = await bcrypt.hash(newPass, config.bcrypt.salt);

        if(!await _user._updatePassword(req.body.email, hashPass)){//Email khong ton tai trong he thong. Update that bai
            res.send(_output(502, 'Email không tồn tại trong hệ thống'));
            return;
        }

        let mailOptions = {
            from: config.mail.user,
            to: req.body.email,
            subject: 'P-Car | KHÔI PHỤC MẬT KHẨU',
            text: 'Xin chào quý khách. Bạn vừa yêu cầu khôi phục mật khẩu. Mật khẩu mới của bạn là [' + newPass + ']. Hãy dùng mật khẩu này để đăng nhập hệ thống'
        };

        transporterEmail.sendMail(mailOptions, function(error, result) {
            res.send(_output(error ? 500 : 200));  
        });
    }else {
        res.send(_output(501));
    }
}

function isAccount(account) {
    return _.has(account, 'email') && 
        _.has(account, 'password')
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