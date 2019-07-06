fsx.readdirSync('./modals').forEach(filename => {
    let _arrayFileName = _.split(filename, '.');
    if (_arrayFileName[1] == 'js') {
        global['_' + _arrayFileName[0]] = require('../modals/' + _arrayFileName[0]);
    }
});

fsx.readdirSync('./controllers').forEach(filename => {
    let _arrayFileName = _.split(filename, '.');
    if (_arrayFileName[1] == 'js') {
        let _arrayFunction = require('../controllers/' + _arrayFileName[0]);
        _.forIn(_arrayFunction, function (fn, key) {
            setRouter(_arrayFileName[0], key, fn);
        })
    }
});


global._render = function (req, res, page, title, data, plugins) {
    if (req.xhr) {// co request tu phia browser gui len =>> nguoi dung thuc hien click de yeu cau thong tin
        console.log('one');

        res.render('layout/' + page, {
            title: title ? title : 'V-Car',
            page: page ? page : null,
            data: data ? data : null,
            plugins: plugins ? plugins : null
        })
    } else {// khong co request tu phia browser gui len ==>> nguoi dung thuc hien enter link de yeu cau thong tin
        console.log('two');

        res.render('home', {
            title: title ? title : 'V-Car',
            page: page ? page : null,
            data: data ? data : null,
            plugins: plugins ? plugins : null
        })
    }

}

global._output = function (code, message, data) {
    return {
        code: code,
        message: message ? message : setValueOutput(code),
        data: data ? data : null
    };
}


app.get('/', function (req, res, next) {
    if (req.session.user) {
        _render(req, res, 'home', 'Trang Chủ', {
            roleIndex: req.session.roleIndex,
            user: req.session.user
        }, ['jquery-ui', 'bootstrap-select', 'tempusdominus-bootstrap']);
    } else {
        res.render('login', {
            title: 'Đăng nhập',
            page: 'login'
        });
    }
})

app.get('/logout', function (req, res, next) {
    req.session.destroy();

    res.render('login', {
        title: 'Đăng nhập',
        page: 'login'
    });
})


app.get('/password-recovery', function (req, res, next) {
    req.session.user = null;
    res.render('password-recovery', {
        title: 'Khôi phục mật khẩu',
        page: 'password-recovery'
    });
})


global._getFields = function (schema, fieldShows) {
    var fields = [];
    _.forEach(fieldShows, function (item) {
        if (_.has(schema.schema.paths, item.field)) {
            var field = schema.schema.paths[item.field];
            if(_.has(item, 'textShow') && item.textShow){
                field.textShow = item.textShow;
            }else {
                field.textShow = setValueField(field.path);
            }

            field.statusShow = item.statusShow;
            field.statusSort = item.statusSort;
            field.statusSearch = item.statusSearch;
            field.valueSelect = item.valueSelect;

            if(item.valueSelect){
                field.instance = 'Select';
            }

            fields.push(field);
        }
    })

    return fields;
}


//field - Ten Field trong DB
//textShow - Ten Hien thi giao dien
//statusShow - Trang Thai hien thi : -1 - bat buoc | 1 - hien thi | 0 - khong hien thi
//statusSort - Trang Thai sap xep : true - cho phep sap xep | false - khong sap xep
//statusSearch - Trang Thai tim kiem : true - cho phep tim kiem | false - khong cho tim kiem
//valueSelect - Gia tri trong selectpicker : [] or null
global._objField = function(field, textShow, statusShow, statusSort, statusSearch, valueSelect) {
    return {
        field : field, 
        textShow : textShow, 
        statusShow : statusShow,
        statusSort : statusSort ? statusSort : false,
        statusSearch : statusSearch ? statusSearch : false,
        valueSelect : valueSelect ? valueSelect : null,
    }
}


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
            url = '/' + namefile + '/id/:_id';
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

    if (method && url) {
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

function setValueField(nameField) {
    switch (nameField) {
        case '_id':
            return 'Mã';        
        case 'name':
            return 'Tên';
        case 'email':
            return 'Thư điện tử';
        case 'numberPhone':
            return 'Số điện thoại';
        case 'password':
            return 'Mật khẩu';
        case 'brithDay':
            return 'Ngày sinh';
        case 'gender':
            return 'Giới tính';
        case 'roles':
            return 'Quyền truy cập';
        case 'created':
            return 'Ngày tạo';
        case 'createBy':
            return 'Người tạo';
        case 'updated':
            return 'Ngày sửa';
        case 'updateBy':
            return 'Người sửa';
        case 'status':
            return 'Trạng thái';
        default:
            return '';
    }
}