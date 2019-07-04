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


global._render = function(req, res, page, title, data, plugins) {
    if(req.xhr){// co request tu phia browser gui len =>> nguoi dung thuc hien click de yeu cau thong tin
        console.log('one');
        
        res.render(page, {
            title : title ? title : 'V-Car',
            page : page ? page : null,
            data : data ? data : null,
            plugins : plugins ? plugins : null
        })
    }else{// khong co request tu phia browser gui len ==>> nguoi dung thuc hien enter link de yeu cau thong tin
        console.log('two');

        res.render('home', {
            title : title ? title : 'V-Car',
            page : page ? page : null,
            data : data ? data : null,
            plugins : plugins ? plugins : null
        })
    }
    
}

global._output = function(code, message, data) {
    return {
        code : code, 
        message : message ? message : setValueOutput(code), 
        data : data ? data : null};    
}

app.get('/', function (req, res, next) {
    if(req.session.user){
        _render(req, res, 'home', 'Trang Chủ', {
            roleIndex : req.session.roleIndex, 
            user : req.session.user}, 
        null);
    }else{
        res.render('login', {
            title : 'Đăng nhập',
            page : 'login'
        });
    }
})

app.get('/logout', function (req, res, next) {
    req.session.user = null;
    req.session.roleIndex = null;

    res.render('login', {
        title : 'Đăng nhập',
        page : 'login'
    });
})


app.get('/password-recovery', function (req, res, next) {
    req.session.user = null;


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
            url = '/' + namefile + '/id:id';
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
        case 300:
            return 'Kết nối socket thành công';
        case 301:
            return 'Đã ngắt kết nối socket';             
        case 302:
            return 'Bạn đã bị chiếm quyền đăng nhập bởi một người khác.';            
        case 500:
            return 'Có lỗi xảy ra. Thử lại sau';   
        case 501:
            return 'Dữ liệu đầu vào không hợp lệ';
        case 502:
            return 'Kết quả trả về không xác định'; //Truy van DB bi null
        default:
            return '';
    }
}