const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const reportPostSchema = new Schema({
    postId : {
        type: Schema.Types.ObjectId,
        ref: 'Post' 
    },
    reason : {
        type: Schema.Types.ObjectId,
        ref: 'Reason' 
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User' 
    }
   
} , {timestamps : true}) 
const ReportPost = model('ReportPost' , reportPostSchema) 
module.exports = ReportPost