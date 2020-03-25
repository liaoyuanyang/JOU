module.exports = app => {
    const express = require('express')
    const path = require('path')
    const fs = require('fs')
    const router = express.Router() // 创建express的子路由
    const jwt = require('jsonwebtoken') // 加密生成token的模块
    const assert = require('http-assert') // 判断状态的模块

    // 添加资源
    router.post('/', async(req, res) => {
        const model = await req.Model.create(req.body)
        res.send(model)
    })

    // 修改资源
    router.put('/:id', async(req, res) => {
        const model = await req.Model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除资源
    router.delete('/:id', async(req, res) => {
        const model = await req.Model.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    // 查找所有资源
    router.get('/', async(req, res) => {
        const queryOptions = {}
            // console.log(req.Model)
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        const model = await req.Model.find().setOptions(queryOptions)
        res.send(model)
    })

    // 根据id查找资源
    router.get('/:id', async(req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    // 引入登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    // 引入获取模型中间件
    const resourceMiddleware = require('../../middleware/resource')


    /**
     * 通用CRUD处理
     * inflection:处理类名大小写以及单复数转换的中间件
     */
    app.use('/web/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)


    /**
     * 文件上传的接口
     * multer:处理文件上传的中间件
     * upload.single('file'):single 表示上传单个文件，'file'是前端传来的文件名
     */
    const multer = require('multer')
    const upload = multer({ dest: require('path').join(__dirname, '../../uploads') })
    app.post('/web/api/upload', authMiddleware(), upload.single('file'), async(req, res) => {
        const file = req.file
        file.url = `http://localhost:3000/uploads/${file.filename}`
        res.send(file)
    })


    /**
     * 用户登录的接口
     */
    app.post('/web/api/login', async(req, res) => {
        const { username, password } = req.body

        // 1.根据用户名找到用户
        const User = require('../../models/User')
        const user = await User.findOne({ username }).select('+password')
        assert(user, 422, '用户名不存在')

        // 2.校验密码
        const isValid = require('bcrypt').compareSync(password, user.password)
        assert(isValid, 422, '密码错误')

        // 3.返回token
        const token = jwt.sign({ id: user._id }, app.get('serect'))
        res.send({ token })
    })

    // 错误处理函数
    app.use(async(err, req, res, next) => {
        res.status(err.statusCode || 500).send({
            message: err.message
        })
    })
}