require('dotenv').config()
const express = require('express')
const cors = require('cors') 
const multer = require('multer')
const app = express() 
const configureDB = require('./config/db')
const catCon = require('./app/controllers/categoryCon')
const userCon = require('./app/controllers/userCon')
const comCon = require('./app/controllers/comCon')
const postCon = require('./app/controllers/postCon')
const commentCon = require('./app/controllers/commentCon')
const paymentCon = require('./app/controllers/paymentCon')
const voteCon = require('./app/controllers/voteCon') 
const reportCon = require('./app/controllers/reportCon')
const {authUser , authorize} = require('./app/middleware/authentication')
const reasonCon = require('./app/controllers/reasonCon')
const {checkSchema} = require('express-validator') 
const {regiSchema , loginSchema} = require('./app/helpers/uservalidations')
const {communitySchema} = require('./app/helpers/comValidations')
const {postValidationSchema} = require('./app/helpers/postValidations')
app.use(cors())
app.use(express.json()) 
const storage = multer.memoryStorage() 
const fileFilter = (req , file, cb) => {
    const acceptTypes = ['image/jpeg' , 'image/jpg' , 'image/png', 'video/mp4' , 'video/quicktime'] 
    if(acceptTypes.includes(file.mimetype)) {
        cb(null , true)
    } else {
        cb(new Error('Invalid file format..!,(jpg/jpeg/png/mp4/quicktime) files are accepted '))
    }
}
const upload = multer({
    storage : storage, 
    fileFilter : fileFilter, 
    limits : {
        fileSize : 500 * 1024 * 1024
    }
}) 

configureDB()  
const port = 4000

app.post('/api/user/register', checkSchema(regiSchema), userCon.register)
app.post('/api/user/login', checkSchema(loginSchema), userCon.login)
app.get('/api/user', authUser, userCon.account)
app.get('/api/allUsers',userCon.getAllUsers)
app.post('/api/category/create' , catCon.create )
app.get('/api/getCategories' , catCon.getCategory)
app.post('/api/community/create', authUser, checkSchema(communitySchema), comCon.create)
app.put('/api/community/edit/:id', authUser, comCon.edit)
app.get('/api/community/:id', comCon.show)
app.get('/api/getComs' , comCon.getAllCom) 
app.get('/api/comByUser/:userId' , authUser , comCon.getComByUserId)
app.get('/api/com/cat/:categoryId', comCon.getComByCat)
app.post('/api/community/join/:communityId' , authUser, comCon.join)
app.delete('/api/community/delete/:id', authUser, authorize([ 'admin' , 'moderator']) , comCon.remove)
app.post('/api/post/create', authUser, upload.array('content' , 10) , postCon.createPost)
app.put('/api/post/update/:postId' , authUser , postCon.update) 
app.get('/api/getPosts' , postCon.getAllPosts) 
app.get('/api/post/:postId', postCon.getPost) 
app.delete('/api/dltPost/:id' , authUser , authorize([ 'admin', 'moderator']) , postCon.deletePost)
app.post('/api/comment/:id', authUser,commentCon.create)
app.put('/api/comment/edit/:id', authUser, commentCon.edit)
app.get('/api/comments', commentCon.showAll)
app.delete('/api/comment/delete/:id', authUser, commentCon.delete) 
app.post('/api/like/:targetId', authUser, voteCon.vote)
app.get('/api/getLikes', voteCon.getLikes)
app.post('/api/report/:postId' , authUser ,  reportCon.reportPost)
app.get('/api/getRepPosts' , authUser , authorize(['admin']) , reportCon.getReportedPosts)
app.post('/api/reason', authUser , reasonCon.create)
app.get('/api/getReason', reasonCon.getReasons)
app.delete('/api/removeReport/:id', authUser, authorize(['admin']), reportCon.removeReport)
app.post('/api/payment/pay' , authUser , paymentCon.pay)

app.listen(port,()=>{
    console.log('server is running on port',port) 
})