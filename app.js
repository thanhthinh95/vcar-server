global.app = require('express')();
global.fsx = require('fs-extra');
global.mongoose = require('mongoose');


global.config = fsx.readJsonSync('./config/config.json');
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


    app.use(require('./library/auth.js'));



    require('./library/setup.js');



    



    app.use(function (req, res, next) {
        res.render('404', {});
    })

    app.listen(config.app.port);
    console.log('app runing on port: ' + config.app.port);
}


