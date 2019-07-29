var objSchame = new mongoose.Schema({
    name : {type : String, required: true},
    urlDefault : {type: String, required: true},
    description : {type : String, required: true},
},{id: false, versionKey: 'v'});

objSchame.statics._getAll = async function() {
    return await _role.find();
}

objSchame.statics._getId = async function(_id) {
    return await _role.findById(_id);
}

objSchame.statics._create = async function(role) {
    return await _role.create(role);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _role.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _role.paginate(dataMatch, options)
}

objSchame.statics._delete = async function (_ids) {
    return await _role.deleteMany({_id : {$in : _ids}});
}

objSchame.set('toJSON', {getters: true});
objSchame.set('toObject', {getters: true});
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));

module.exports = mongoose.model('role', objSchame)