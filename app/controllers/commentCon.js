const Comment = require("../models/commentModel")
const _ = require('lodash')
const commentCon = {}

commentCon.create = async(req, res) => {
    const body = _.pick(req.body, ['content'])
    body.user = req.user.userId
    body.post = req.params.id
    try{
        const comment = new Comment(body)
        await comment.save()
        res.json( {message : 'Comment posted',comment})
    }catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

commentCon.edit = async(req, res)=>{
    const {id} = req.params
    const body = _.pick(req.body, ['content'])
    try{
        const comment = await Comment.findByIdAndUpdate(id, body, {new: true})
        res.json({message : 'comment edited',comment})
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

commentCon.showAll = async(req, res)=>{
    try{
        const comments = await Comment.find()
        res.json(comments) 
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

commentCon.delete = async(req, res)=>{
    const {id} = req.params
    try{
        const comment = await Comment.findByIdAndDelete(id)
        res.json({message : 'Comment Deleted Successfully' , comment})
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

module.exports = commentCon