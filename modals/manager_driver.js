var objSchame = new mongoose.Schema({
    userId : {type : mongoose.Schema.Types.ObjectId, ref: 'user', require: true},
    carSupplierId : {type : mongoose.Schema.Types.ObjectId, ref: 'car_supplier', require: true},
    createBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    created : {type : Date, default: Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    updated : {type : Date, default: null},
    status : {type : Number, required: true}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

async function checkExistence(obj){
    return await _manager_driver.countDocuments({userId : obj.userId});
}

objSchame.statics._create = async function(obj) {
    if(await checkExistence(obj) > 0) return null;//Kiem tra su ton tai cua nhan vien trong nha xe
    await _user._addRole(obj.userId, config.roleId.NhaXe);//Them role nha xe cho user
    return await _manager_driver.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    let obj = await _manager_driver._getId(_id);
    if(!_.isEqual(obj.userId.toString(), dataUpdate.userId)){
        if(await checkExistence(dataUpdate) > 0) return null;//Kiem tra su ton tai cua nhan vien trong nha xe
    }
    return await _manager_driver.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _manager_driver.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _manager_driver.paginate(dataMatch, options)
}

objSchame.statics._getAll = async function() {
    return await _manager_driver.find({});
}


objSchame.statics._delete = async function (_ids) {
    let data = await _manager_driver.find({_id : {$in : _ids}}, {userId : 1});//Tim tat ca ManagerDriver theo ID
    let userIds = [];
    _.forEach(data, async function(item) {
        userIds.push(item.userId);//Thu duoc mang userId can loai bo quyen nha xe
    })
    
    await _user._removeRole(userIds, config.roleId.NhaXe);
    return await _manager_driver.deleteMany({_id : {$in : _ids}});
}

objSchame.statics._deleteManyForCarSupplier = async function (carSupplierIds) {
    let ids = await _manager_driver.distinct('_id', {carSupplierId : {$in : carSupplierIds}});
    return await _manager_driver._delete(ids);
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('manager_driver', objSchame)