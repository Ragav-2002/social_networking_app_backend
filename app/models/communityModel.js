const mongoose = require ('mongoose') 
const {Schema , model } = mongoose 

const communitySchema = new Schema ({
    name : String,
    category : Schema.Types.ObjectId,

    description : String,
    users : [Schema.Types.ObjectId], 
    posts : [Schema.Types.ObjectId], 
    membershipFee  :{type:Number, default: 0}, 
    communityType : String,
    isApproved : Boolean, 
    createdBy : Schema.Types.ObjectId
}, {timestamps  :true} ) 

const Community  = model ('Community' , communitySchema) 

module.exports = Community 