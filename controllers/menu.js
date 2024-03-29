exports.getAll = async function(req, res) {
    _render(req, res, 'menu', 'Quản lý menu', {
        menu : await _menu._getMenuAndActivities('menu', req.session.roleIndex._id),
        menus : await _menu._getAll(),
        roles : await _role._getAll(),
        fontawesomes : _fontawesomes,
    }, ['nestable'])
}

exports.create = async function (req, res) {
    let rolesIds = req.body.roles;

    if(rolesIds && !_.isArray(rolesIds)){ //Neu rolesIds chi co 1 phan tu thi bien doi no thanh mang
        rolesIds = [rolesIds];
    }

    let menu = _deleteFields(req.body, ['roles']);
    var data = await _menu._create(menu, rolesIds);
    res.send(_output(data ? 200 : 500, null, data));
}

exports.update = async function (req, res) {
    if(_.has(req.body, 'dataUpdate')){//Dang thuc hien cap nhat vi tri menu
        _.forEach(req.body.dataUpdate, async function (item, index) {//menu level 1
            await _menu._updateMany({_id : item.id}, {parentId : null, priority : (index + 1)});
            if(_.has(item, 'children')){
                await updateChildren(item.id, item.children);
            }
            
        })
        res.send(_output(200));
    }else{//Dang thuc hien cap nhat 1 menu
        //Thuc hien cap nhat thong tin menu
        let data = await _menu._updateOne({_id : req.body._id},{
            name : req.body.name ? req.body.name : 'Không xác định',
            link : req.body.link ? req.body.link  : null,
            icon : req.body.icon ? req.body.icon : null,
        });

        let rolesIds = req.body.roleIds;
        if(rolesIds && !_.isArray(rolesIds)){ //Neu rolesIds chi co 1 phan tu thi bien doi no thanh mang
            rolesIds = [rolesIds];
        }
        
        data = await _activity._createManyForMenu(req.body._id, rolesIds)
        res.send(_output(200));
    }
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
    var data = await _menu._delete(req.body.ids);
    res.send(_output(data ? 200 : 500, null, data));    
}

exports.search = async function (req, res) {
    switch(req.query.type){
        case '1':
            await loadMenusForRole(req.query.data.roleId, res);
            break;
        case '2':

        default:
            break;
    }
}

async function loadMenusForRole(roleId, res) {
    if(!roleId) return res.send(_output(500));

    var menus = await _menu._getAll();
    _.forEach(menus, function (menu) {
        _.remove(menu.childs, function (child) {
            if(!_.has(child, '_id') ||
                !_.find(child.activities, {roleId : mongoose.Types.ObjectId(roleId)})) 
                    return child;
        })
    })
    
    res.send(_output(menus ? 200 : 500, null, menus));    
}
