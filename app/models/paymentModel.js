const mongoose = require('mongoose') 
const {Schema , model} = mongoose 
const paymentSchema = new Schema( {
    userId : ObjectId,
    amount : Number,
    communityId : ObjectId
}, {timestamps : true} ) 
const Payment = model ('Payment' , paymentSchema) 
module.exports = Payment 