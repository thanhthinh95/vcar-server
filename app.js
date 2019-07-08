var express = require('express');
var bodyParser = require('body-parser');

global.fsx = require('fs-extra');
global.config = fsx.readJsonSync('./config/config.json');
global.app = express();
global.server = require('http').createServer(app);
global.io = require('socket.io')(server);
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



mongoose.connect(_stringConnect, {useCreateIndex : true, useNewUrlParser : true, connectTimeoutMS : 3000}, function (error) {
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
    app.use(require('express-session')({
        secret: 'pcar_secret',
        resave: false,
        saveUninitialized: true,
    }))

    
    app.use('/js', express.static('public/js'));
    app.use('/img', express.static('public/img'));
    app.use('/css', express.static('public/css'));
    app.use('/pages', express.static('public/pages'));
    app.use('/fonts', express.static('public/fonts'));
    app.use('/plugins', express.static('public/plugins'));
    app.use('/views', express.static('views'));

    app.use(require('./library/auth-access.js'));
    require('./library/setup.js');


    app.use(function (req, res, next) {
        res.render('404', {});
    })

    server.listen(config.app.port);

    io.on('connection',  require('./library/io.js'));

    // _role._create({name : 'Kỹ thuật hệ thống', description : 'Nhân viên kỹ thuật hệ thống'});
    // _role._create({name : 'Nhân viên hệ thống', description : 'Nhân viên hệ thống'});
    // _role._create({name : 'Nhà xe', description : 'Kỹ thuật viên của nhà xe'});
    // _role._create({name : 'Nhân viên', description : 'Nhân viên của nhà xe'});

    // _menu._create({name : 'Quản lý', priority : 1});
    // _menu._create({name : 'Công việc', priority : 2});
    // _menu._create({name : 'Báo cáo', priority : 3});


    _menu._create({name : 'Quản lý 01', priority : 1, parent : '5d231d952b31b13560a2e56d'});
    _menu._create({name : 'Quản lý 02', priority : 2, parent : '5d231d952b31b13560a2e56d'});
    _menu._create({name : 'Quản lý 03', priority : 3, parent : '5d231d952b31b13560a2e56d'});
    
}


