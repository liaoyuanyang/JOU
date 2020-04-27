/**
 * 举报数据集合
 */
const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    // 举报的id
    reportID: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User'
    },
    /* reportID: { type: String }, */
    reportContent: { type: String }
})


module.exports = mongoose.model('Report', schema)