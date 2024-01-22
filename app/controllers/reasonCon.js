const Reason = require('../models/reasonModel')
const _ = require('lodash')
const reasonCon = {} 

reasonCon.create = async(req , res) => {
    const body = _.pick (req.body , ['reason'])
    try {
        const reason = new Reason(body) 
        await reason.save()
        res.json(reason)
    } catch (e) {
        res.status(500).json({errors : 'something went wrong'})
    }
} 

reasonCon.getReasons = async (req , res) => {
    try {
        const reasons = await Reason.find()
        res.json(reasons)
    } catch (e) {
        res.status(500).json({errors : 'something went wrong'})
    }
}

module.exports = reasonCon