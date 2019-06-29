fsx.readdirSync('./modals').forEach(filename => {
    let _arrayFileName = _.split(filename, '.');
    if(_arrayFileName[1] == 'js'){
        global['_' + _arrayFileName[0]] = require('../modals/' + _arrayFileName[0]);
    }
});

fsx.readdirSync('./controllers').forEach(filename => {
    let _arrayFileName = _.split(filename, '.');
    if(_arrayFileName[1] == 'js'){
        let _arrayFunction = require('../controllers/' + _arrayFileName[0]);
        _.forIn(_arrayFunction, function(fn, key) {
            setRouter(_arrayFileName[0], key, fn);
        })
    }
});


app.get('/', function (req, res, next) {
    res.render('login', {
        title : 'Đăng nhập',
        page : 'login'
    });
})


app.get('/password-recovery', function (req, res, next) {
    res.render('password-recovery', {
        title : 'Khôi phục mật khẩu',
        page : 'password-recovery'
    });
})


function setRouter(namefile, key, fn) {
    let method = null,
        url = null;
    switch (key) {
        case 'getAll':
            method = 'get';
            url = '/' + namefile;
            break;
        case 'getId':
            method = 'get';
            url = '/' + namefile + '/id';
            break; 
        case 'new':
            method = 'get';
            url = '/' + namefile + '/new';
            break;       
        case 'edit':
            method = 'get';
            url = '/' + namefile + '/edit';
            break;   
        case 'create':
            method = 'post';
            url = '/' + namefile;
            break; 
        case 'update':
            method = 'put';
            url = '/' + namefile;
            break;   
        case 'delete':
            method = 'delete';
            url = '/' + namefile;
            break;                       
        default:
            break;
    }

    if(method && url){
        app[method](url, fn);
    }
}

