
const titleSchema = {
    notEmpty : {
        errorMessage : 'Title must be given for the post'
    }, 

    isLength : {
        options : {min : 3},
        errorMessage : 'title must be 3 characters long'
    }
} 

const contentSchema = {
    notEmpty : {
        errorMessage : 'File must be selected to post something'
    }
}  

const descriptionSchema = {
    notEmpty : {
        errorMessage : 'Give description to know about this post briefly'
    }
} 

const postValidationSchema = {
    title : titleSchema,
    content : contentSchema,
    body : descriptionSchema
}  

module.exports = {postValidationSchema}