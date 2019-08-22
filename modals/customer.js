var objSchame = new mongoose.Schema({
    name : {type : String, default : null},
    password : {type : String, required: true},
    numberPhone : {type : String, required: true},
    email : {type : String, required: true},
    gender : {type : Number, default: null},
    macAddress : {type : String, required: true},
    created : {type : Date, default: Date.now},
    updated : {type : Date, default: null},
    status : {type : Number, default: 1}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

async function checkExistence(obj){
    return await _customer.countDocuments({$or : [{email : obj.email}, {numberPhone : obj.numberPhone}]});
}

objSchame.statics._checkExistence = async function(obj) {
    return await checkExistence(obj)
}

objSchame.statics._getAll = async function() {
    return await _customer.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    if(await checkExistence(obj) > 0) return -1;//SDT hoac Email da ton tai
    return await _customer.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _customer.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _customer.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }
    return await _customer.paginate(dataMatch, options)
}



objSchame.statics._delete = async function (_ids) {
    return await _customer.deleteMany({_id : {$in : _ids}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('customer', objSchame)