const Category = require('../models/categoryModel')
const _ = require('lodash')
const catCon = {} 

catCon.create = async(req , res) => {
    const body = _.pick(req.body, ['name'])
    try {
        const category = new Category(body)
        await category.save()
        res.json( { message : 'Category Sent', category})

    } catch (e) {
        res.status(500).json({errors : 'Hey There is something wrong try again'})
    }
} 

catCon.getCategory = async(req,res) => {
    try {
        const categories = await Category.find() 
        res.json(categories)
    } catch (e) {
        res.status(500).json({errors : 'something went wrong'})
    }
}

module.exports = catCon