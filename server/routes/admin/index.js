module.exports = app => {
    const express = require('express')
    const router = express.Router() // 创建express的子路由

    // 添加资源
    router.post('/', async(req, res) => {
        const model = await req.model.create(req.body)
        res.send(model)
    })

    // 修改资源
    router.put('/:id', async(req, res) => {
        const model = await req.model.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除资源
    router.delete('/:id', async(req, res) => {
        const model = await req.model.findByIdAndDelete(req.params.id, req.body)
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
        const model = await req.Model.find().setOptions(queryOptions)
        res.send(model)
    })

    // 根据id查找资源
    router.get('/:id', async(req, res) => {
        const model = await req.model.findById(req.params.id)
        res.send(model)
    })

    app.use('/admin/api/rest/:resource', async(req, res, next) => {
        const modelName = require('inflection').classify(req.params.resource)
        req.model = require(`../../models/${modelName}`)
        next()
    }, router)
}