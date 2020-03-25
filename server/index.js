/**
 * 后端入口文件
 */

const express = require('express')
const path = require('path')
const app = express() // 创建一个网站服务器

// 在app实例上添加一个属性，该属性的token生成时需要用到的一个密钥
// 这个值最好添加到环境变量，而不是放到源代码中
app.set('serect', 'liaoyuanayng')

app.use(require('cors')()) // 允许跨域请求
app.use(express.json()) // 允许处理post请求

// 将 uploads 文件夹开放为静态资源
app.use('/uploads', express.static(path.join(__dirname, '/uploads')))

require('./plugins/db')(app) // 引入连接数据库的方法
require('./routes/admin')(app) // 引入admin的路由方法
require('./routes/web')(app) // 引入admin的路由方法

app.use('/public', express.static(__dirname + '/public')) // 开放public为静态资源

app.listen(3000, () => {
    console.log('服务器启动成功...')
})