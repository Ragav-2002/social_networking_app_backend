const Community = require('../models/communityModel')
const _ = require('lodash')
const {validationResult} = require('express-validator')
const User = require('../models/userModel')
const Payment = require('../models/paymentModel')
const nodemailer = require('nodemailer')
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
    try{
        const community = new Community(body)
        await community.save()
        const user = await User.findById(userId)
        if(user.role == 'user') {
            await User.findByIdAndUpdate(userId , {role : 'moderator'})
        }
        
        // await User.findByIdAndUpdate(userId , {$push : {createdComs : community._id}}) 
        
        res.json({msg: 'community created successfully', community })
        
    }catch(e){
        res.status(500).json({errors : 'Something went wrong.!, Try to create again'})
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
        res.json({ message : 'Community edited successfully', community})
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
    console.log(req.user.userRole)
    try{
       
        if(req.user.userRole == 'admin') {
            await Community.findByIdAndDelete(id)
            res.json({message : 'Deleted Successfully'})
        } else if (req.user.userRole == 'moderator') {
           if (await Community.findOne({createdBy : req.user.userId , _id : id})){
              await Community.findByIdAndDelete(id)
              await Post.deleteMany( { "community" : id } )
              const result = await Post.find()
              res.json(result)
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
        const community = await Community.find({isApproved : true}) 
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
        res.status(500).json ({errors : 'something went wrong'})
    }
 }

 comCon.join = async (req, res) => {
    const { communityId } = req.params;
    const { userId } = req.user;

    try {
        const community = await Community.findById(communityId);

        if (community.premium) {
            // Check if the user has made a payment
            const hasSubscription = await Payment.findOne({
                userId: userId,
                communityId: communityId,
            });

            if (!hasSubscription) {
                return res.status(403).json({ errors: 'You are not subscribed' });
            }
        }

        // Update user membership directly without toggle
        const updatedCommunity = await Community.findByIdAndUpdate(
            community._id,
            community.users.includes(userId)
                ? { $pull: { users: userId } }
                : { $push: { users: userId } },
            { new: true }
        );

        res.json({
            message: 'Joined/Left Community Successfully!',
            users: updatedCommunity.users,
        });
    } catch (e) {
        res.status(500).json({ errors: 'There must be a problem, try again later..!' });
    }
};

        
    comCon.getComByCat = async(req, res) => {
    const {categoryId} = req.params 
    try {
        const communities = await Community.find({category : categoryId})
        res.json(communities)
    } catch (e) {
        res.status(500).json({errors : 'something went wrong try again..!'})
    }
}



module.exports = comCon