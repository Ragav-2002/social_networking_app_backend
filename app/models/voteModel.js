const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const voteSchema = new Schema({
    userId : {
        type : Schema.Types.ObjectId,
        ref : 'User'        
    },
    targetId : {
        type : Schema.Types.ObjectId,
        enum :['Post' , 'Comment']
        }
}, {timestamps : true} ) 
const Vote = model ('Vote' , voteSchema) 
module.exports = Vote 