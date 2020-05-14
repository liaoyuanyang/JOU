module.exports = app => {
    const express = require('express')
    const router = express.Router() // 创建express的子路由
    const assert = require('http-assert') // 判断状态的模块
    const jwt = require('jsonwebtoken') // 加密生成token的模块
    const AdminUser = require('../../models/AdminUser') // 引入管理员用户数据模型

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
        if (req.Model.modelName === 'Category') {
            queryOptions.populate = 'parent'
        }
        if (req.Model.modelName === 'Good') {
            queryOptions.populate = 'type userId'
        }
        if (req.Model.modelName === 'Report') {
            queryOptions.populate = 'reportID'
        }
        if (req.Model.modelName === 'Demand') {
            queryOptions.populate = 'userId'
        }
        const model = await req.Model.find().setOptions(queryOptions)
        res.send(model)
    })

    // 根据id查找资源
    router.get('/:id', async(req, res) => {
        const model = await req.Model.findById(req.params.id)
        res.send(model)
    })

    /* app.use('/admin/api/rest/:resource', async(req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource)
        req.Model = require(`../../models/${modelName}`)
        next()
    }, router) */

    // 引入登录校验中间件
    const authMiddleware = require('../../middleware/auth')

    // 引入获取模型中间件
    const resourceMiddleware = require('../../middleware/resource')

    /**
     * 将子路由 router 挂载到 app 中
     * /admin/api/rest/:resource 为响应路径的前缀
     * :resource 为动态参数，根据客户端请求发生变化
     */
    app.use('/admin/api/rest/:resource', authMiddleware(), resourceMiddleware(), router)

    // 管理员登录的方法
    app.post('/admin/api/login', async(req, res) => {
        const { username, password } = req.body // 解构赋值的方式获取客户端传来的用户名和密码

        // 1 根据用户名找用户
        /* 由于再管理员数据模型中设置了select: false, 让密码默认不被查出来，
           但是后面需要判断密码是否正确时，需要取出数据的密码，
           所以可以通过 .select('+password') 的方式临时让其能取出密码 */
        const user = await AdminUser.findOne({ username }).select('+password')

        // 判断用户是否存在
        /* 若用户不存在，则返回一个错误消息：'用户名不存在'
            若用户存在，则判断密码是否正确
            若密码不正确，则返回一个错误消息：'密码错误' */
        /* if (!user) {
            return res.status(422).send({
                message: '用户名不存在'
            })
        } */
        assert(user, 422, '用户名不存在')

        // 2 校验密码
        /* 由于密码在保存到数据库时，用了 bcrypt 模块进行散列加密
           所以这里再通过 bcrypt 模块的 compareSync 方法来解密比较密码是否正确
           第一个参数是用户传来的密码，第二个参数是数据库保存的密码*/
        const isValid = require('bcrypt').compareSync(password, user.password)
            /* if (!isValid) {
                return res.status(422).send({
                    message: '密码错误'
                })
            } */
        assert(isValid, 422, '密码错误')

        // 3 返回token
        /* sign方法用来生成token（将传入的数据散列生成一个字符串）
          它接收两个参数：
          第一个参数就是想要生成token的数据
          第二个参数是一个密钥，表示在生成token的时候会加入一个密钥
          虽然客户端可以不需要这个密钥就能把token解析出来
          但是想要验证token是否被客户端篡改，就需要这个密钥
        */
        // app.get 只有一个参数，表示是获取配置，而不是定义路由
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