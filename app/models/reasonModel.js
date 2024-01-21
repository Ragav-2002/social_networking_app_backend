const mongoose = require('mongoose') 
const {Schema , model} = mongoose 

const reasonSchema = new Schema ({
    reason : String
} , {timestamps : true}) 

const Reason = model ('Reason' , reasonSchema) 
module.exports = Reason