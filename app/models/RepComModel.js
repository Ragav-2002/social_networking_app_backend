const mongoose = require('mongoose')
const {Schema , model} = mongoose 
const reportCommSchema = new Schema({
 communityId : Schema.Types.ObjectId,
 reason : String,
} , {timestamps : true} ) 
const CommReport = model('CommReport' , reportCommSchema) 
module.exports = CommReport