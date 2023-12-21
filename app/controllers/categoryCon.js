const Category = require('../models/categoryModel')
const _ = require('lodash')
const catCon = {} 

catCon.create = async(req , res) => {
    const body = _.pick(req.body, ['name'])
    try {
        const categories = new Category(body)
        await categories.save()
        res.json(categories)

    } catch (e) {
        res.status(500).json(e.message)
    }
} 

module.exports = catCon