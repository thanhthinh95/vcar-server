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

global._output = function(code, data, message) {
    return {
        code : code, 
        message : message ? message : setValueOutput(code), 
        data : data ? data : null};    
}


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


function setValueOutput(code) {
    switch (code) {
        case 200:
            return 'Thành công';
        case 201:
            return 'Tạo mới thành công';
        case 202:
            return 'Cập nhật thành công';
        case 203:
            return 'Xóa bỏ thành công';     
        case 204:
            return 'Tải file thành công';


                
            
            
        case 500:
            return 'Có lỗi xảy ra';   
        case 501:
            return 'Tạo mới thất bại. Thử lại sau';
        case 502:
            return 'Cập nhật thất bại. Thử lại sau';
        case 503:
            return 'Xóa bỏ thất bại. Thử lại sau';     
        case 504:
            return 'Tải file thất bại. Thử lại sau';      
            
            
        default:
            return '';
    }
}