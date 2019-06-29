exports.getAll = function (req, res) {
    // _user.find({}, function (error, result) {
    //     console.log(error);
    //     console.log(result);
        
        
        
    // })


    res.send('day la html')
}

exports.getId = function (req, res) {
    res.send('dang thuc hien get theo id');
    console.log(req.query);
    console.log(req.params);
}

exports.new = function (req, res) {
    res.send('dang tao moi')
}

exports.edit = function (req, res) {
    console.log('thuc hien khoi phuc mat khau');


    
    res.send('dang thuc hien sua')
}

exports.create = async function (req, res) {
    if(isAccount(req.body)){
        var account = await _user._login(req.body);
        console.log(account);
        
        res.send(account);
    } else {
        res.send(null);
    }
}

exports.update = async function (req, res) {
    if(_.has(req.body, 'email')){
        var newPass = randomPass(8);
        console.log(newPass);
        var hashPass = await bcrypt.hash(newPass, config.bcrypt.salt);
        console.log(hashPass);
        

        var mailOptions = {
            from: config.mail.user,
            to: req.body.email,
            subject: 'P-Car | KHÔI PHỤC MẬT KHẨU',
            text: 'Xin chào quý khách. Bạn vừa yêu cầu khôi phục mật khẩu. Mật khẩu mới của bạn là [' + newPass + ']. Hãy dùng mật khẩu này để đăng nhập hệ thống'
        };

        transporterEmail.sendMail(mailOptions);

        var a = await _user._password_recorery(req.body, hashPass);
        console.log(a);
        
        
    }
        


        
    
      
 


    
    res.send(req.body)
}

exports.delete = function (req, res) {
    res.send('dang thuc hien xoa')
}


function isAccount(account) {
    return _.has(account, 'email') && 
        _.has(account, 'password')
}

function randomPass(length) {
    var result           = '';
    var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for ( var i = 0; i < length; i++ ) {
       result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
 }