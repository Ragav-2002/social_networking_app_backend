const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const reportPostSchema = new Schema({
    postId : {
        type : Schema.Types.ObjectId,
    } ,
    reason : String,
} , {timestamps : true}) 
const PostRepo = model('Report' , reportPostSchema) 
module.exports = PostRepo