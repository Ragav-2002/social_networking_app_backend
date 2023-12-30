const mongoose = require('mongoose') 
const {Schema , model} = mongoose 

const postSchema = new Schema({
  title : String,
  content : [String],
  body : String,
  type : {
    type : String, 
   
  } , 

  isPremium : {
    type : Boolean
  } ,
  user : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  }, 

  community : {
    type : Schema.Types.ObjectId,
    ref : 'Community' 
    
  }, 

  votes : [{
    type : Schema.Types.ObjectId
  }]
} , {timestamps : true} ) 

const Post = model('Post' , postSchema) 

module.exports = Post