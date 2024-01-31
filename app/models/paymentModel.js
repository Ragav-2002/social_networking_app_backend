const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const paymentSchema = new Schema( {
    userId : Schema.Types.ObjectId,
    amount : Number,
    method : String,
    communityId : Schema.Types.ObjectId
}, {timestamps : true} ) 
const Payment = model ('Payment' , paymentSchema) 
module.exports = Payment 