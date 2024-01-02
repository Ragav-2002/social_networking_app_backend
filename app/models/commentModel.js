const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const commentSchema = new Schema ({
    content : String, 
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    },
    post : {
        type : Schema.Types.ObjectId,
        ref : 'Post'
    }, 
    vote : []
}, {timestamps : true} ) 
const Comments = model('Comments' , commentSchema) 
module.exports = Comments