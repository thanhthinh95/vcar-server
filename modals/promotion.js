var objSchame = new mongoose.Schema({
    carSupplierId : {type : mongoose.Schema.Types.ObjectId, ref: 'car_supplier', required: true},
    name : {type : String, required: true},
    code : {type : String, required: true, unique : true},
    dateStart : {type : Date, required: true},
    dateEnd : {type : Date, required: true},
    amount : {type : Number, default: null},
    budget : {type : Number, default: null},
    discount : {type : Number, default: null},
    maxDiscount : {type : Number, default: null},
    createBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    created : {type : Date, default: Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    updated : {type : Date, default: null},
    status : {type : Number, required: true}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _promotion.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    try {
        return await _promotion.create(obj)
    } catch (error) {
        return null;
    }
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _promotion.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _promotion.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _promotion.paginate(dataMatch, options)
}



objSchame.statics._delete = async function (_ids) {
    return await _promotion.deleteMany({_id : {$in : _ids}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('promotion', objSchame)