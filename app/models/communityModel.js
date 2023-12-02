const mongoose = require ('mongoose') 
const {Schema , model } = mongoose 

const communitySchema = new Schema ({
    name : String,
    category : {
        type : Schema.Types.ObjectId,
        ref : 'Category',
     } , 

    description : String,
    users : [{
        type : Schema.Types.ObjectId,
        ref : 'User'
    }], 
    posts : [{
        type : Schema.Types.ObjectId, 
        ref : 'Post'
    }], 

    membershipFee  :Number, 
    communityType : String,
    isApproved : Boolean, 
    createdBy : ObjectId
}, {timestamps  :true} ) 

const Community  = model ('Community' , communitySchema) 

module.exports = Community 