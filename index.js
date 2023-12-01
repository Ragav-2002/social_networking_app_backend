const express = require('express')
const cors = require('cors')
const app = express()
const configureDB = require('./config/db')
app.use(cors())
app.use(express.json())
configureDB()
const port = 4000

app.listen(port,()=>{
    console.log('server is running on port', port)
})