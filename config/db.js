const mongoose = require('mongoose')
const configureDB = async() => {
    try{
        const url = 'mongodb+srv://sripalasettyraghavendra2002:ragvirat2002@cluster0.8ogwzzg.mongodb.net/'
        const db = await mongoose.connect(url)
        console.log('connected to db')
    }
    catch(e){
        console.log('error connecting to db')
    }
}
module.exports = configureDB