/**
 * 分类数据集合
 */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 分类名称
    name: { type: String },
    // 父级分类
    /* parent: { type: mongoose.SchemaTypes.ObjectId, ref: 'Category' } */
})

module.exports = mongoose.model('Category', schema)