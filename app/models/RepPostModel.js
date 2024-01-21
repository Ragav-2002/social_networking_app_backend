const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const reportPostSchema = new Schema({
    post : Object 
} , {timestamps : true}) 
const ReportPost = model('ReportPost' , reportPostSchema) 
module.exports = ReportPost