
const nameSchema = {

    notEmpty: {
        errorMessage : 'Name cannot be empty'
    }, 
    isLength : {
        options : {min : 3 },
        errorMessage : 'name should contain 3 characters long'
    }
} 

const categoryValidation = {
    notEmpty : {
        errorMessage : 'category must be included'
    }
}    

const comTypeSchema = {
    notEmpty: {
        errorMessage : 'community type must be selected'
    }
}

// const membershipSchema = { 
//     custom: {
//         options :  (value , {req}) => {
//             if(req.body.communityType == 'free'){
//                 return  true
//             } else if (req.body.communityType == 'premium') {
//                 if(value <= 0){
//                     throw new Error('u need to buy premium')
//                 }
//                 } else {
//                     return true
//                 }

//             }

//         }
//     }



const communitySchema = {
    name : nameSchema,
    category : categoryValidation,
    communityType : comTypeSchema,
   // membershipFee : membershipSchema 
} 

module.exports = {communitySchema}