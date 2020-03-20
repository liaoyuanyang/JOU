module.exports = app => {
    const express = require('express')
    const router = express.Router() // 创建express的子路由
    const Category = require('../../models/Category')

    // 添加分类
    router.post('/categories', async(req, res) => {
        const model = await Category.create(req.body)
        res.send(model)
    })

    // 修改分类
    router.put('/categories/:id', async(req, res) => {
        const model = await Category.findByIdAndUpdate(req.params.id, req.body)
        res.send(model)
    })

    // 删除分类
    router.delete('/categories/:id', async(req, res) => {
        const model = await Category.findByIdAndDelete(req.params.id, req.body)
        res.send({
            success: true
        })
    })

    // 查找所有分类
    router.get('/categories', async(req, res) => {
        const model = await Category.find().populate('parent').limit(50)
        res.send(model)
    })

    // 根据id查找分类
    router.get('/categories/:id', async(req, res) => {
        const model = await Category.findById(req.params.id)
        res.send(model)
    })

    app.use('/admin/api', router) // 挂载子路由到qpp上
}