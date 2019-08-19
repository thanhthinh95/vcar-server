var objSchame = new mongoose.Schema({
    name : {type : String, required: true},
    numberSeat : {type : Number, required: true}, //So luong ghe
    seatDiaGram : {type : mongoose.Schema.Types.Mixed, required: true}, //So do cho ngoi
    createBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    created : {type : Date, default: Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    updated : {type : Date, default: null},
    status : {type : Number, required: true}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _car_type.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    return await _car_type.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _car_type.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _car_type.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _car_type.paginate(dataMatch, options)
}



objSchame.statics._delete = async function (_ids) {
    return await _car_type.deleteMany({_id : {$in : _ids}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('car_type', objSchame)