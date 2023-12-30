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
const voteCon = require('./app/controllers/voteCon')
const {authUser} = require('./app/middleware/authentication')
const {checkSchema} = require('express-validator') 
const {regiSchema , loginSchema} = require('./app/helpers/userValidations')
const {communitySchema} = require('./app/helpers/comValidations')
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
        fileSize : 10 * 1024 * 1024
    }
})

configureDB()
const port = 4000

app.post('/api/user/register', checkSchema(regiSchema), userCon.register)
app.post('/api/user/login', checkSchema(loginSchema), userCon.login)
app.get('/api/user', authUser, userCon.account)
app.post('/api/category/create' , catCon.create )
app.get('/api/getCategories' , catCon.getCategory)
app.post('/api/community/create', authUser, checkSchema(communitySchema), comCon.create)
app.put('/api/community/edit/:id', authUser, comCon.edit)
app.get('/api/community/:id', comCon.show)
app.get('/api/getComs' , comCon.getAllCom) 
app.get('/api/comByUser/:userId' , authUser , comCon.getComByUserId)
app.get('/api/com/cat/:categoryId', comCon.getComByCat)
app.post('/api/community/join/:communityId' , authUser, comCon.join)
app.delete('/api/community/delete/:id', authUser, comCon.remove)
app.post('/api/post/create', authUser, upload.array('content' , 10) , postCon.createPost)
app.put('/api/post/update/:id' , authUser , postCon.update) 
app.get('/api/getPosts' , postCon.getAllPosts) 
app.get('/api/post/:id', postCon.getPost) 
app.delete('/api/dltPost/:postId' , authUser , postCon.deletePost)
app.post('/api/comment/:id', authUser,commentCon.create)
app.put('/api/comment/edit/:id', authUser, commentCon.edit)
app.get('/api/comments', commentCon.showAll)
app.delete('/api/comment/delete/:id', authUser, commentCon.delete)
app.post('/api/like/:targetId', authUser, voteCon.vote)

app.listen(port,()=>{
    console.log('server is running on port',port)
})