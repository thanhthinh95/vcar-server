var objSchame = new mongoose.Schema({
    ticketId : {type : mongoose.Schema.Types.ObjectId, ref: 'ticket', required: true},
    customerId : {type : mongoose.Schema.Types.ObjectId, ref: 'customer', required: true},
    content : {type : String, require : true},
    handling : {type : String, default : null},
    created : {type : Date, default: Date.now},
    updated : {type : Date, default: null},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref: 'user', default: null},
    status : {type : Number, default: 0}, //0: chua xu ly, 1: da xu ly
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _complain.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    return await _complain.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _complain.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _complain.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }
    return await _complain.paginate(dataMatch, options)
}

objSchame.statics._delete = async function (_ids) {
    return await _complain.deleteMany({_id : {$in : _ids}});
}


objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('complain', objSchame)