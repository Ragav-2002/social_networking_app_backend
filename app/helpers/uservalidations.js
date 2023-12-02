const User = require('../models/userModel')

const usernameSchema = {
    notEmpty : {
        errorMessage : 'username should not be empty'
    }, 
    isLength : {
        options : {min : 3},
        errorMessage : 'username should be atleast 3 characters long'
    }
}

const registerEmail = {
    notEmpty : {
        errorMessage : ' email should not be empty'
    }, 

    isEmail : {
        errorMessage : 'invalid email'
    },

    custom : {
        options : async (value) => {
            const user = await User.findOne({email : value}) 
            if (user) {
                throw new Error('Email is already exists')
            } else {
                return true
            }
        }
    }
} 

const passwordSchema = {
    notEmpty : {
        errorMessage : 'password shoul not be empty'
    },

    isLength :{
        options : {min : 8 , max : 128},
        errorMessage : 'password should be 8-128 characters long'
    }
} 

const logInEmail = {
    notEmpty : {
        errorMessage : 'email must be entered to login',

    },

    isEmail : {
        errorMessage : 'invalid email'
    }
} 

const regiSchema = {
    username : usernameSchema,
    email : registerEmail,
    password : passwordSchema
} 

const loginSchema = {
    email : logInEmail,
    password : passwordSchema
} 

module.exports = {regiSchema, loginSchema}