require('dotenv').config()
const express = require('express')
const cors = require('cors')
const app = express()
const configureDB = require('./config/db')
const userCon = require('./app/controllers/userCon')
const {authUser} = require('./app/middleware/authentication')
const {checkSchema} = require('express-validator') 
const {regiSchema , loginSchema} = require('./app/helpers/uservalidations')
app.use(cors())
app.use(express.json())
configureDB()
const port = 4000

app.post('/api/user/register', checkSchema(regiSchema), userCon.register)
app.post('/api/user/login', checkSchema(loginSchema), userCon.login)
app.get('/api/user', authUser, userCon.account)

app.listen(port,()=>{
    console.log('server is running on port',port)
})