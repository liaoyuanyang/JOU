/**
 * 用户数据集合
 */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 用户名称
    username: { type: String },
    // 用户密码
    password: {
        type: String,
        select: false,
        set(val) {
            return require('bcrypt').hashSync(val, 10)
        }
    },
    // 头像
    // avatar: { type: String, default: '/public/img/avatar-max-img.png' },
    avatar: { type: String, default: 'http://localhost:3000/public/img/avatar-max-img.png' },
    // qq
    qq: { type: String },
    // Wechat
    wechat: { type: String },
    // 电话号码
    tel: { type: String },
    // 校区
    campus: { type: String },

}, {
    // 时间戳(会自动生成创建时间和更新时间)
    timestamps: true
})


module.exports = mongoose.model('User', schema)