const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const postSchema = new Schema({
  title : String,
  content : [{}],
  body : String,
  type : {
    type : String, 
  } , 
  isApproved : {
    type : Boolean, default : true
  } ,
  user : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  }, 
  community : {
    type : Schema.Types.ObjectId,  
  }, 

  votes : [{
    type : Schema.Types.ObjectId
  }]
} , {timestamps : true} ) 
const Post = model('Post' , postSchema) 
module.exports = Post