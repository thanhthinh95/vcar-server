var userSchame = new mongoose.Schema({
    name: { type: String, default: 'Người dùng' },
    email: { type: String, required: true, unique: true },
    numberPhone: { type: String, default: null },
    password: { type: String, required: true },
    brithDay: { type: Date, default: Date.now },
    gender: { type: String, default: null },
    roles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'role' }],

    created: { type: String, default: Date.now },
    createBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    updated: { type: Date, default: Date.now },
    updateBy: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
    status: { type: Number, default: 1 },
}, { id: false, versionKey: 'v' });


userSchame.statics._getAll = async function () {
    return await _user.find({});
}

userSchame.statics._getId = async function (userId) {
    return await _user.findOne({ _id: userId });
}


userSchame.statics._login = async function (email, password) {
    var user = await _user.findOne({ email: email, status: 1 });
    if (!user) return null; //Khong ton tai email
    var kq = await bcrypt.compare(password, user.password);
    return (kq ? user : null);
}


userSchame.statics._updatePassword = async function (email, newPassword) {
    return await _user.findOneAndUpdate({ email: email, status: 1 }, { password: newPassword });
}

userSchame.statics._getRoles = async function (_idUser) {
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


userSchame.set('toJSON', { getters: true });
userSchame.set('toObject', { getters: true });
userSchame.index({ email: 1 });


module.exports = mongoose.model('user', userSchame)