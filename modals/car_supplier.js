var objSchame = new mongoose.Schema({
    name : {type : String, required: true},
    numberPhone : {type : String, required: true},
    startPoint : {type : mongoose.Schema.Types.ObjectId, ref: 'point', required: true},
    endPoint : {type : mongoose.Schema.Types.ObjectId, ref: 'point', required: true},
    createBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    created : {type : Date, default: Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    updated : {type : Date, default: null},
    status : {type : Number, required: true}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _car_supplier.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    return await _car_supplier.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _car_supplier.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _car_supplier.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _car_supplier.paginate(dataMatch, options)
}

objSchame.statics._delete = async function (_ids) {
    return await _car_supplier.deleteMany({_id : {$in : _ids}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('car_supplier', objSchame)