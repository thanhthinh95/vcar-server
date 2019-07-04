
module.exports = function auth(req, res, next) {
    console.log('dang check auth', req.method, req.path, req.xhr);

    if(skipPage(req.path) ||
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

function checkLogin(req) {
    return req.session.user;
}