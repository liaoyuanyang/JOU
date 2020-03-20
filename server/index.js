/**
 * 后端入口文件
 */

const express = require('express')
const path = require('path')
const app = express() // 创建一个网站服务器

app.use(require('cors')()) // 允许跨域请求
app.use(express.json()) // 允许处理post请求

require('./plugins/db')(app) // 引入连接数据库的方法
require('./routes/admin')(app) // 引入admin的路由方法

app.use('/public', express.static(__dirname + '/public')) // 开放public为静态资源

app.listen(3000, () => {
    console.log('服务器启动成功...')
})