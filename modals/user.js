var objSchame = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true},
    numberPhone: { type: String, required: true},
    password: { type: String, required: true },
    birthDay: { type: Date, required: true},
    gender: { type: Number, required: true},//0: Nu | 1: Nam
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role', required: true}],

    created: { type: Date, default: Date.now},
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default : null},
    updated: { type: Date, default: Date.now },
    updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user', default : null},
    status: { type: Number, required: true  },
}, { id: false, versionKey: 'v' });


objSchame.statics._getAll = async function () {
    return await _user.find({status : 1});
}

objSchame.statics._getId = async function (_id) {
    return await _user.findOne({ _id: _id });
}

objSchame.statics._create = async function(obj) {
    return await _user.create(obj);
}

objSchame.statics._update = async function(_id, dataUpdate) {
    return await _user.findByIdAndUpdate(_id, dataUpdate,  {new: true});
}

objSchame.statics._delete = async function (_ids) {
    return await _user.deleteMany({_id : {$in : _ids}});
}

objSchame.statics._login = async function (email, password) {
    var user = await _user.findOne({ email: email, status: 1 });
    if (!user) return null; //Khong ton tai email
    var kq = await bcrypt.compare(password, user.password);
    return (kq ? user : null);
}


objSchame.statics._updatePassword = async function (email, newPassword) {
    return await _user.findOneAndUpdate({ email: email, status: 1 }, { password: newPassword });
}

objSchame.statics._getRoles = async function (_idUser) {
    var data = await _user.aggregate([
        { $match: { _id: mongoose.Types.ObjectId(_idUser), status: 1 } },
        {
            $lookup: {
                from: 'roles',
                localField: 'roles',
                foreignField: '_id',
                as: 'roles'
            }
        },
        { $project: { roles: 1 } }
    ]);

    if (data && data.length > 0 && _.has(data[0], 'roles')) return data[0].roles;
    return null;
}


objSchame.statics._addRole = async function(_id, roleId) {
    return await _user.updateOne({_id : _id}, 
        {$addToSet : {roles : roleId}});
}

objSchame.statics._removeRole = async function(_ids, roleId) {
    return await _user.updateMany({_id : {$in : _ids}}, 
        {$pull : {roles : roleId}});
}


objSchame.statics._search = async function (dataMatch, sort, page, sumRow) {
    let options  = {
        page : Number(page),
        limit : Number(sumRow),
        sort : sort,
    }

    return await _user.paginate(dataMatch, options)
}


objSchame.set('toJSON', { getters: true });
objSchame.set('toObject', { getters: true });
objSchame.index({ email: 1 });
objSchame.plugin(require('mongoose-aggregate-paginate'));
objSchame.plugin(require('mongoose-paginate-v2'));



module.exports = mongoose.model('user', objSchame)