exports.getAll = async function(req, res) {
    _render(req, res, 'menu', 'Quản lý menu', {
        menus : await _menu._getAll(),
        roles : await _role._getAll(),
        fontawesomes : _fontawesomes,
    }, ['nestable'])
}

exports.create = async function (req, res) {
    let rolesId = req.body.roles;
    let menu = _deleteFields(req.body, ['roles']);
    var data = await _menu._create(menu, rolesId);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.update = async function (req, res) {
    console.log(req.body);


    _.forEach(req.body.dataUpdate, async function (item, index) {//menu level 1
        await _menu._updateMany({_id : item.id}, {parentId : null, priority : (index + 1)});
        if(_.has(item, 'children')){
            await updateChildren(item.id, item.children);
        }
        
    })
    
    res.send(_output(200));
    
}

async function updateChildren(parentId, childrens) {
    _.forEach(childrens, async function(item, index) {
        await _menu._updateMany({_id : item.id}, {parentId: parentId, priority : (index + 1)});
        if(_.has(item, 'children')){
            await updateChildren(item.id, item.children);
        }
    });
}

exports.delete = async function(req, res) {
    var data = await _menu._delete(req.params._id);
    res.send(_output(data ? 200 : 500, null, data));    
}