var menuSchame = new mongoose.Schema({
    name : {type : String, default : null},
    parent : {type : mongoose.Schema.Types.ObjectId, ref: 'menu', default : null},
    priority : {type : Number, default : 1},
    link : {type: String, default: null},
    icon : {type : String, default : null},
},{id: false, versionKey: 'v'});

menuSchame.statics._create = async function(menu) {
    return await _menu.create(menu);
}

menuSchame.statics._getId = async function(_id) {
    return await _menu.findById(_id);
}

menuSchame.statics._getAll = async function() {

    var aggs = [
        {$match : {parent : null}},
        {$sort : {priority : 1}}];

    return await _menu.aggregate(aggs);
}



menuSchame.set('toJSON', {getters: true});
menuSchame.set('toObject', {getters: true});


module.exports = mongoose.model('menu', menuSchame)