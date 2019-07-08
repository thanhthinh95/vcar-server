exports.getAll = async function(req, res) {
    var data = await _menu._getAll();


    console.log(data);
    
    _render(req, res, 'user', 'Quản lý menu', {
        menus : data
    })
}