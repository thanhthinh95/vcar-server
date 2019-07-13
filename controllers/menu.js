exports.getAll = async function(req, res) {
    var data = await _menu._getAll();
    _render(req, res, 'menu', 'Quản lý menu', {
        menus : data,
        fontawesomes : _fontawesomes,
    }, ['nestable'])
}