const mongoose = require('mongoose') 
const {Schema , model} = mongoose 

const userSchema = new Schema ({
    username : String,
    email : String,
    password : String,
    createdPosts : {type : Schema.Types.ObjectId} ,
    createdComs : [{type : Schema.Types.ObjectId, ref: 'Community'}],
    role : {
        type : String,
        enum : ['admin' , 'moderator', 'user']
    },
    premiumComs: [{type : Schema.Types.ObjectId, ref: 'Community'}],
    freeComs: [{type : Schema.Types.ObjectId, ref: 'Community'}]
} , {timestamps : true} ) 

const User = model ('User' , userSchema) 

module.exports = User