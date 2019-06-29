var express = require('express');
var bodyParser = require('body-parser');

global.fsx = require('fs-extra');
global.config = fsx.readJsonSync('./config/config.json');
global.app = express();
global.mongoose = require('mongoose');
global._ = require('lodash');
global.bcrypt = require('bcrypt');



global.transporterEmail =  require("nodemailer").createTransport({
    service: config.mail.service,
    auth: {
      user: config.mail.user,
      pass: config.mail.pass
    }
});

let _stringConnect = 'mongodb://' 
    + config.database.username + ':' 
    + config.database.password + '@' 
    + config.database.ip + ':' 
    + config.database.port + '/' 
    + config.database.name;



mongoose.connect(_stringConnect, {useNewUrlParser : true, connectTimeoutMS : 3000}, function (error) {
    if(error){
        console.log('connect database fail: ' + _stringConnect);
        return;
    } 

    console.log('connected: ' + _stringConnect);
    buildApp();
});



function buildApp() {
    app.set('views', './views');
    app.set('view engine', 'ejs');
    app.set('view cache', false);

    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));

    app.use('/js', express.static('public/js'));
    app.use('/img', express.static('public/img'));
    app.use('/css', express.static('public/css'));
    app.use('/pages', express.static('public/pages'));
    app.use('/fonts', express.static('public/fonts'));

    app.use(require('./library/auth.js'));
    require('./library/setup.js');

    app.use(function (req, res, next) {
        res.render('404', {});
    })

    app.listen(config.app.port);
    console.log('app runing on port: ' + config.app.port);
}


