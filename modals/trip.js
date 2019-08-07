var objSchame = new mongoose.Schema({
    carId : {type : mongoose.Schema.Types.ObjectId, ref: 'car', required: true},
    timeStart : {type : Date, required: true},
    type : {type : Number, required: true}, //0: Chieu Nguoc; 1: Chieu Xuoi
    createBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    created : {type : Date, default: Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    updated : {type : Date, default: null},
    status : {type : Number, required: true}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _trip.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    return await _trip.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _trip.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _trip.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _trip.paginate(dataMatch, options)
}



objSchame.statics._delete = async function (_ids) {
    return await _trip.deleteMany({_id : {$in : _ids}});
}

objSchame.statics._deleteManyForCar = async function(carIds) {
    return await _trip.deleteMany({carId : {$in : carIds}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('trip', objSchame)