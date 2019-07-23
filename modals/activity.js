var activitySchame = new mongoose.Schema({
    menuId : {type : mongoose.Schema.Types.ObjectId, ref: 'menu', required: true},
    roleId : {type : mongoose.Schema.Types.ObjectId, ref: 'role', required: true},
    type : [{type : Number, default : []}], //1 : Them moi, 2: Cap nhat, 3 : Xoa bo, 4 : tai file
},{id: false, versionKey: 'v'});

activitySchame.statics._create = async function(activity) {
    return await _activity.create(activity);
}

activitySchame.statics._update = async function(_id, dataUpdate) {
    return await _activity.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

activitySchame.statics._getId = async function(_id) {
    return await _activity.findById(_id);
}
activitySchame.statics._search = async function (dataMatch, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow)
    }

    return await _activity.paginate(dataMatch, options)
}

activitySchame.statics._getAll = async function() {
    return await _activity.find({});
}

activitySchame.statics._createManyForMenu = async function (menuId, roleIds) {//for update menu  
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
        data = await _activity._create(arrayActivity);
    }
    return data;
}


activitySchame.statics._delete = async function (_ids) {
    //xoa bo tat ca activity va con cua activity
    return await _activity.deleteMany({_id : {$in : _ids}});
}

activitySchame.statics._deleteManyForMenuId = async function(menuIds) {
    return await _activity.deleteMany({menuId : {$in : menuIds}});
}

activitySchame.set('toJSON', {getters: true});
activitySchame.set('toObject', {getters: true});
activitySchame.plugin(require('mongoose-aggregate-paginate'));
activitySchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('activity', activitySchame)