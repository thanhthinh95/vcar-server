
module.exports = function auth(req, res, next) {
    console.log('url: ', req.method, req.path);

    if(skipPage(req.path) ||
        skipAPI(req.path) ||
        checkLogin(req)){
        next();
    }else{
        res.redirect('/');
    }
}

function skipPage(path) {
    let pages = ['/', '/login', '/password-recovery'];
    return _.indexOf(pages, path) == -1 ? false : true    
}

function skipAPI(path) {
    if(_.isEqual(path, '/api')) return true;
    let array = path.split('/');
    if(array.length >=3 && _.isEqual(array[1], 'api') && array[2].length != 0) return true;
    return false;
}

function checkLogin(req) {
    return req.session.user;
}