const Post = require('../models/postModel') 
const _ = require('lodash')
const postCon = {} 

postCon.create = async(req , res)=> {
    const body = _.pick(req.body, ['title', 'content', 'body' , 'type', 'isPremium'] )

    try {
        body.user = req.user.userId
        const post = new Post(body)
        await post.save()
        res.json(post)

    } catch(e) {
        res.status(500).json({errors: 'something went wrong'})
    }
} 

postCon.update = async (req , res) => {
    const {id} = req.params
    const body = _.pick(req.body , ['title', 'content' , 'body' , 'type','isPremium'])
    try { 
        const posts = await Post.findByIdAndUpdate(id , body, {new : true})
        res.json(posts)
   } catch (e) {
        res.status(500).json({error : 'something went wrong'})
    }
}

postCon.getAllPosts = async(req , res) => {
    try { 
        const posts = await Post.find()
        res.json(posts)

    } catch (e){
        res.status(500).json({errors : 'something went wrong try again later'})
    }
} 

postCon.getPost = async (req , res) => {
    const {id} = req.params
    try { 
        const post = await Post.findById(id)
        res.json(post) 

    } catch(e){
        res.status(500).json({errors : 'something went wrong'})
    }
} 

postCon.deletePost = async (req , res) => {
    const {id} = req.params
    try { 
        const posts = await Post.findByIdAndDelete(id) 
        res.json({msg : 'deleted'})

    } catch (e) {
        res.status(500).json({errors : 'Server error try again later'}) 
        
    }
} 


module.exports = postCon