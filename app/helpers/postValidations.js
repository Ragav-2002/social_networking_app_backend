
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
    } , 

    custom : {
        options : ({req}) => {
            if(!req.content || req.content.length === 0) {
                throw new Error('Please select a file')
            }
            return true
        }
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