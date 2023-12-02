const mongoose = require('mongoose') 
const {Schema , model} = mongoose 

const voteSchema = new Schema({
    user : {
        type : Schema.Types.ObjectId,
        ref : 'User'        
    },
    voteType : {
        type : String,
        enum : ['upvote' , 'downvote']
    },
    
     targetId : {
        type : Schema.Types.ObjectId,
        enum :['Post' , 'Comment']
     }
}, {timestamps : true} ) 

const Vote = model ('Vote' , voteSchema) 

module.exports = Vote 