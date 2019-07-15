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