const Community = require('../models/communityModel')
const _ = require('lodash')
const User = require('../models/userModel')
const Post = require('../models/postModel')

const comCon = {}

comCon.create = async(req, res) => {
    const {userId} = req.user
    const requiredFields = [
        'name',
        'category',
        'description',
        'membershipFee', 
        'communityType',
    ]
    const body = _.pick(req.body, requiredFields)
    body.createdBy = userId
    if(body.communityType == 'free'){
        body.isApproved = true
    }else{
        body.isApproved = false
    }
    try{
        const community = new Community(body)
        await community.save()
        res.json(community)
    }catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

comCon.edit = async(req, res) => {
    const requiredFields = [
        'name',
        'category',
        'description',
        'membershipFee',
        'communityType'
    ]
    const id = req.params.id
    const body = _.pick(req.body, requiredFields)
    try{
        const community = await Community.findByIdAndUpdate(id,body,{new: true})
        res.json(community)
    }catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

comCon.show = async(req, res) => {
    const id = req.params.id
    try{
        const community = await Community.findById(id)
        const response = _.pick(community, ['name','description','users', 'posts', 'communityType','category'])
        res.json(response)
    }catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

comCon.remove = async(req, res)=>{
    const {id} = req.params
    try{
        await Community.findByIdAndDelete(id)
        res.json({message: 'community deleted successfully'})
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

module.exports = comCon