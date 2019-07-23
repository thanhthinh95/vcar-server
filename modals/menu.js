var menuSchame = new mongoose.Schema({
    name : {type : String, required: true},
    parentId : {type : mongoose.Schema.Types.ObjectId, ref: 'menu', default : null},
    priority : {type : Number, default : 0},
    link : {type: String, default: null},
    icon : {type : String, default : null},
},{id: false, versionKey: 'v'});

menuSchame.statics._create = async function(menu, roleIds) {
    let data = await _menu.create(menu);
    if(roleIds && data){//Thuc hien tao moi activitys theo tung roleId  cho menu
        var arrayActivity = [];
        _.forEach(roleIds, function(roleId) {
            arrayActivity.push({
                menuId : data._id,
                roleId : roleId,
            })
        })
        data = await _activity._create(arrayActivity);
    }
    return data;
}

menuSchame.statics._getId = async function(_id) {
    return await _menu.findById(_id);
}

menuSchame.statics._getMenuAndActivities = async function(link, roleId) {
    var aggs = [
        {$match : {link : link}},
        {$lookup : {
            from : 'activities',
            localField : '_id',
            foreignField : 'menuId',
            as : 'activities'
        }},
        {$unwind: {path : '$activities', preserveNullAndEmptyArrays : true }},
        {$match : {'activities.roleId' : mongoose.Types.ObjectId(roleId)}},
    ];
    
    let menus = await _menu.aggregate(aggs); 
    if(menus && menus.length > 0) return menus[0];
    return null;
}

menuSchame.statics._getAll = async function() {
    var aggs = [
        {$match : {parentId : null}},
        {$lookup : {
            from : 'menus',
            localField : '_id',
            foreignField : 'parentId',
            as : 'childs'
        }},
        {$unwind: {path : '$childs', preserveNullAndEmptyArrays : true }},
        {$sort : {'childs.priority' : 1}},
        {$lookup : {
            from : 'activities',
            localField : '_id',
            foreignField : 'menuId',
            as : 'activities'
        }},
        {$lookup : {
            from : 'activities',
            localField : 'childs._id',
            foreignField : 'menuId',
            as : 'childs.activities'
        }},
        {$group : {
            _id : '$_id',
            name : {$last : '$name'},
            parentId : {$last : '$parentId'},
            priority : {$last : '$priority'},
            icon : {$last : '$icon'},
            link : {$last : '$link'},
            activities : {$last : '$activities'},
            childs : {$push : '$childs'},
        }},
        {$sort : {priority : 1}},
    ];

    return await _menu.aggregate(aggs); 
}

menuSchame.statics._updateMany = async function(query, dataUpdate) {
    return await _menu.updateMany(query, dataUpdate);
}

menuSchame.statics._updateOne = async function(query, dataUpdate) {
    return await _menu.updateOne(query, dataUpdate);
}

menuSchame.statics._delete = async function (ids) {
    //xoa bo tat ca menu va con cua menu
    await _menu.deleteMany({$or :  [{parentId : {$in : ids}}, {_id : {$in : ids}}]});
    return await _activity._deleteManyForMenuId(ids);
}

menuSchame.set('toJSON', {getters: true});
menuSchame.set('toObject', {getters: true});
menuSchame.plugin(require('mongoose-aggregate-paginate'));


module.exports = mongoose.model('menu', menuSchame)