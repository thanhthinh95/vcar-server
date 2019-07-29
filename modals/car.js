var objSchame = new mongoose.Schema({
    carSupplierId : {type : mongoose.Schema.Types.ObjectId, ref: 'car_supplier', require: null},
    controlSea : {type : String, required: true},//Bien kiem soat
    imageUrl : [{type : String, required: true}],//Hinh anh
    type : {type : Number, required: true}, //0: Xe Limousine | 1: Xe Ngồi | 2: Xe guong nam
    numberSeat : {type : Number, required: true}, //So luong ghe ngoi
    color : {type : String, required: true},//Mau sac
    fare : {type : Number, required: true}, //Gia 
    pointStop : [{type : mongoose.Schema.Types.ObjectId, ref: 'point', require: null}],//Danh sach cac diem dung

    createBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    created : {type : Date, default: Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    updated : {type : Date, default: null},
    status : {type : Number, required: true}, //0: Khong kich hoat, 1: Kich hoat
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _car.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    return await _car.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _car.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _car.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _car.paginate(dataMatch, options)
}



objSchame.statics._delete = async function (_ids) {
    return await _car.deleteMany({_id : {$in : _ids}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('car', objSchame)