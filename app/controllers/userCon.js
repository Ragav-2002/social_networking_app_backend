const User = require('../models/userModel')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken') 
const {validationResult} = require('express-validator')

const userCon = {}

userCon.register = async(req, res) => { 

    const body = _.pick(req.body, ['username', 'email', 'password']) 
    const errors = validationResult(req) 
    if(!errors.isEmpty()) {
       return res.status(400).json({errors : errors.array()})
    }
     
    try{
        const salt = await bcrypt.genSalt()
        const hashedPass = await bcrypt.hash(body.password, salt)
        body.password = hashedPass
        const users = await User.countDocuments()
        if(users == 0){
            body.role = 'admin'
        }else{
            body.role = 'user'
        }
        const user = new User(body)
        await user.save()
        res.json('registered successfully')
    }catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

userCon.login = async(req, res) => {
    const body = _.pick(req.body, ['email', 'password'])
     const errors = validationResult(req) 
     if(!errors.isEmpty()) {
       return res.status(400).json({errors : errors.array()})
     }
    try{
        const user = await User.findOne({email: body.email})
        if(!user){
            return res.status(404).json({errors: [{ msg: 'invalid email or password' }]})
        }else if(!await bcrypt.compare(body.password, user.password)){
            return res.status(404).json({errors: [{ msg: 'invalid email or password' }]})
        }else{
            const tokenData = {userId: user._id, userRole: user.role}
            const token = jwt.sign(tokenData, process.env.SECRET)
            res.json({token: `bearer ${token}`,message: 'login successful'})
        }
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

userCon.account = async(req, res)=> {
    const {userId} = req.user
    try{
        const user = await User.findById(userId)
        res.json(user)
    }catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}


module.exports = userCon