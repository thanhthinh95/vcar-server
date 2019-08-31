var objSchame = new mongoose.Schema({
    promotionId : {type : mongoose.Schema.Types.ObjectId, ref: 'promotion', default: null},
    customerId : {type : mongoose.Schema.Types.ObjectId, ref: 'customer', required: true},
    ticketId : [{type : mongoose.Schema.Types.ObjectId, ref: 'ticket', required: true}],
    type : {type : Number, require : true},//1 Tien mat, 0: ATM
    money : {type : Number, require : true},
    discount : {type : Number, require : true},
    totalPayment : {type : Number, require : true},
    created : {type : Date, default: Date.now},
    status : {type : Number, required: true}, //0: Chua thanh toan, 1: Da thanh toan thanh cong
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _payment.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    return await _payment.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _payment.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _payment.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _payment.paginate(dataMatch, options)
}



objSchame.statics._delete = async function (_ids) {
    return await _payment.deleteMany({_id : {$in : _ids}});
}


objSchame.statics._deleteManyForCar = async function(carIds) {
    return await _payment.deleteMany({carId : {$in : carIds}});
}


objSchame.statics._createManyAPI = async function(objs) {
    return await _payment.insertMany(objs);
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('payment', objSchame)