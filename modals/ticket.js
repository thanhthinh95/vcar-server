var objSchame = new mongoose.Schema({
    tripId : {type : mongoose.Schema.Types.ObjectId, ref: 'trip', required: true},
    customerId : {type : mongoose.Schema.Types.ObjectId, ref: 'customer', required: true},
    dateStart : {type : Date, require : true}, //date only
    position : {type : String, required: true},
    fare : {type : Number, require : true},
    vote : {type : Number, default : null},
    created : {type : Date, default: Date.now},
    updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default: null },
    updated : {type : Date, default: null},
    status : {type : Number, required: true}, //0: Chua thanh toan, 1: Da thanh toan; 2: Da su dung, 3: Da bi huy bo
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _ticket.find({status : 1});
}


objSchame.statics._create = async function(obj) {
    return await _ticket.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _ticket.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._getId = async function(_id) {
    return await _ticket.findById(_id);
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _ticket.paginate(dataMatch, options)
}



objSchame.statics._delete = async function (_ids) {
    return await _ticket.deleteMany({_id : {$in : _ids}});
}


objSchame.statics._deleteManyForCar = async function(carIds) {
    return await _ticket.deleteMany({carId : {$in : carIds}});
}


objSchame.statics._createManyAPI = async function(objs) {
    return await _ticket.insertMany(objs);
}

objSchame.statics._updateManyAPI = async function(query, data) {
    return await _ticket.updateMany(query, data);
}

objSchame.statics._getManyAPI = async function(aggs) {
    return await _ticket.aggregate(aggs).allowDiskUse(true);               
}

objSchame.statics._getPositionSelectedAPI = async function(query) {
    return await _ticket.find(query, {position : 1});               
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));


module.exports = mongoose.model('ticket', objSchame)