const mongoose = require('mongoose')
const {Schema , model} = mongoose 
const reportCommSchema = new Schema({
 community : Schema.Types.ObjectId,
 reason : String,
} , {timestamps : true} ) 
const ReportedCommunity = model('ReportedCommunity' , reportCommSchema) 
module.exports = ReportedCommunity