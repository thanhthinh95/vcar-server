var activitySchame = new mongoose.Schema({
    menuId : {type : mongoose.Schema.Types.ObjectId, ref: 'menu', required: true},
    roleId : {type : mongoose.Schema.Types.ObjectId, ref: 'role', required: true},
    type : [{type : Number, default : []}], //1 : Them moi, 2: Cap nhat, 3 : Xoa bo, 4 : tai file
},{id: false, versionKey: 'v'});

activitySchame.statics._create = async function(activity) {
    return await _activity.create(activity);
}

activitySchame.statics._getId = async function(_id) {
    return await _activity.findById(_id);
}

activitySchame.statics._getAll = async function() {
    // var aggs = [
    //     {$match : {parentId : null}},
    //     {$sort : {priority : 1}},
    //     {$lookup : {
    //         from : 'activitys',
    //         localField : '_id',
    //         foreignField : 'parentId',
    //         as : 'childs'
    //     }}
    
    // ];

    // return await _activity.aggregate(aggs); 
}

activitySchame.statics._create = async function (activity) {
    return await _activity.create(activity);
}

activitySchame.statics._createManyForMenu = async function (menuId, roleIds) {//for update menu
    console.log(menuId);
    console.log(roleIds);
    
    //Khi cap nhat roleIds cua menu. thuc hien xoa het activity theo menuId va tao lai
    let data = await _activity.deleteMany({menuId :  menuId});
    if(roleIds && data){//Thuc hien tao moi activitys theo tung roleId  cho menu
        var arrayActivity = [];
        _.forEach(roleIds, function(roleId) {
            arrayActivity.push({
                menuId : menuId,
                roleId : roleId,
            })
        })

        console.log(arrayActivity);
        
        data = await _activity._create(arrayActivity);
    }
    return data;
}


activitySchame.statics._delete = async function (activityId) {
    //xoa bo tat ca activity va con cua activity
    return await _activity.deleteMany({$or :  [{parentId : activityId}, {_id : activityId}]});
}

activitySchame.statics._deleteManyForMenuId = async function(menuId) {
    return await _activity.deleteMany({menuId :  menuId});
}

activitySchame.set('toJSON', {getters: true});
activitySchame.set('toObject', {getters: true});


module.exports = mongoose.model('activity', activitySchame)