var roleSchame = new mongoose.Schema({
    name : {type : String, default : null},
    description : {type : String, default : null},
},{id: false, versionKey: 'v'});




roleSchame.statics._create = async function(role) {
    return await _role.create(role);
}





roleSchame.set('toJSON', {getters: true});
roleSchame.set('toObject', {getters: true});


module.exports = mongoose.model('role', roleSchame)