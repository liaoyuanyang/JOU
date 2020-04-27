/**
 * 物品数据集合
 */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 物品名称
    name: { type: String },
    // 物品类型
    // type: [{ type: String }],
    type: [{ type: mongoose.SchemaTypes.ObjectId, ref: 'Category' }],
    // 物品描述
    description: { type: String },
    // 购入时间
    date: { type: Date, default: Date.now },
    // 物品照片
    photo: [{ type: String }],
    // 价格
    price: { type: String },
    // 原价
    originalPrice: { type: String },
    // 校区
    campus: {
        type: Number,
        enum: [0, 1, 2], // 分别表示：宋跳校区、苍梧校区、通灌校区
        default: 0
    },
    /* campus: { type: String }, */
    // 联系方式
    tel: { type: String },
    // 发布人
    userId: { type: mongoose.SchemaTypes.ObjectId, ref: 'User' }
}, {
    // 时间戳(会自动生成创建时间和更新时间)
    timestamps: true
})


module.exports = mongoose.model('Good', schema, 'goods')