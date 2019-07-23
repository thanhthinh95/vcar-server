var objSchame = new mongoose.Schema({
    name : {type : String, required: true},
    type : {type : Number, default : 0}, //0: Diem dung trong ben, 1: Diem dung ngoai ben
    createBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', required: true},
    created : {type : Date, default: Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    updated : {type : Date, default: null},
    status : {type : Number, default : 0}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

objSchame.statics._create = async function(obj) {
    return await _point.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _point.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _point.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _point.paginate(dataMatch, options)
}

objSchame.statics._getAll = async function() {
    return await _point.find({});
}


objSchame.statics._delete = async function (_ids) {
    return await _activity.deleteMany({_id : {$in : _ids}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('point', objSchame)