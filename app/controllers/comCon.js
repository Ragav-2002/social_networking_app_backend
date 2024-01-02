const Community = require('../models/communityModel')
const _ = require('lodash')
const {validationResult} = require('express-validator')
const User = require('../models/userModel')
const Post = require('../models/postModel')

const comCon = {}

comCon.create = async(req, res) => {
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
        return res.status(400).json({errors : errors.array()})
    }
    const {userId} = req.user
    const requiredFields = [
        'name',
        'category',
        'description',
        'membershipFee', 
        'premium',
    ]
    const body = _.pick(req.body, requiredFields)
    body.createdBy = userId
    if(body.premium){
        body.isApproved = true
    }else{
        body.isApproved = false
    }
    
    try{
        const community = new Community(body)
        await community.save()
      

        await User.findByIdAndUpdate(req.user.userId , {role : 'moderator'}) 
        await User.findByIdAndUpdate(userId , {$push : {createdComs : community._id}})
        res.json({msg: 'community created successfully'})
        
    }catch(e){
        res.status(500).json(e.message)
    }
}

comCon.edit = async(req, res) => {
    
    const requiredFields = [
        'name',
        'category',
        'description',
        'membershipFee',
        'premium'
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
        const response = _.pick(community, ['name','description','users', 'posts', 'premium','category'])
        res.json(response)
    }catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

comCon.remove = async(req, res)=>{
    const {id} = req.params
    try{
       
        if(req.user.userRole == 'admin') {
            await Community.findByIdAndDelete(id)
            res.json({message : 'Deleted Successfully'})
        } else if (req.user.userRole == 'moderator') {
           if (await Community.findOne({createdBy : req.user.userId , _id : id})){
              await Community.findByIdAndDelete(id)
              res.json({message : 'Deleted Successfully'})
           } else {
            return  res.status(403).json({errors: 'you are not supposed to delete this community'})
           }
        } 
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
} 

 comCon.getAllCom = async(req , res) => {
    try {
        const community = await Community.find() 
         res.json(community)
        
    } catch (e) {
        res.status(500).json({errors : 'something went wrong homie'})
     }
 } 

 comCon.getComByUserId = async (req , res) => {
    const {userId} = req.params 
    try {
         const com = await Community.find({createdBy  : userId})
         res.json(com)
    } catch (e) {
        res.status(500).json (e.message)
    }
 }

 comCon.join = async(req , res) => {
    const {communityId} = req.params
    const {userId} = req.user
    try { 
        const community = await Community.findById(communityId) 
        if(!community.users.includes(userId)) {
            await Community.findByIdAndUpdate(communityId , {$push : {users : userId}})
            res.json({message : 'Subscribed..!'})
        } else   {
            await Community.findByIdAndUpdate(communityId , {$pull : {users : userId}})
            res.json({message : 'Unsubscribed..!'})
          
        }
    } catch (e) {
        res.status(500).json({errors : 'something went wrong budyy try again'})
    }
 }  

 comCon.getComByCat = async(req, res) => {
    const {categoryId} = req.params 
    try {
        const communities = await Community.find({category : categoryId})
        res.json(communities)
    } catch (e) {
        res.status(500).json(e.message)
    }
 }



module.exports = comCon