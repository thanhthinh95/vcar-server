var UserSchame = new mongoose.Schema({
    name : {type : String, default : 'Người dùng'},
    email : {type : String, required : true, unique : true},
    numberPhone : {type : String, default : null},
    password : {type : String, required : true},
    brithDay : {type : Date, default : Date.now},
    gender : {type : String, default : null},
    role : [{type : mongoose.Schema.Types.ObjectId, ref : 'Role'}],

    created : {type : String, default : Date.now},
    createBy : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    updated : {type : Date, default : Date.now},
    updateBy : {type : mongoose.Schema.Types.ObjectId, ref : 'User'},
    status : {type : Number, default : 1},
},{id: false, versionKey: 'v'});



//params: account: {email, password}
UserSchame.statics._login = async function(account) {
    var ac = await _user.findOne({email : account.email});
    var kq = await bcrypt.compare(account.password, ac.password);
    return (kq ? ac : null);
}


UserSchame.statics._password_recorery = async function(account, newPassWord) {
    return await _user.findOneAndUpdate(account, {password : newPassWord});
}





UserSchame.set('toJSON', {getters: true});
UserSchame.set('toObject', {getters: true});

module.exports = mongoose.model('User', UserSchame)