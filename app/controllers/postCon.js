const Post = require('../models/postModel') 
const User = require('../models/userModel')
const _ = require('lodash')
const AWS = require('aws-sdk')
const { v4 : uuidv4} = require('uuid')
const sharp = require('sharp')
const postCon = {} 

AWS.config.update ({
    accesskeyId : process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey : process.env.AWS_SECRET_ACCESS_KEY,
    region : process.env.AWS_REGION
}) 

const s3 = new AWS.S3()

postCon.createPost = async(req , res)=> {
    const body = _.pick(req.body, ['title', 'content', 'body' , 'type','community'] )
    console.log(req.files)
    console.log(body)
    body.user = req.user.userId
    const postId = uuidv4()
    const uploadPromises = req.files.map(async(file, index) => { 
        const fileType = file.originalname.split('.').pop().toLowerCase();
        console.log(fileType)
        const normalizedType = fileType === 'jpg' ? 'image/jpeg' : file.mimetype;
        body.type = normalizedType
        console.log(normalizedType)
        const buffer = file.mimetype.startsWith('video/') ? file.buffer : await sharp(file.buffer).resize({height : 1920 , width: 1080 , fit: 'contain' }).toBuffer()
        console.log(buffer)
        console.log(file.mimetype)
        const key = file.mimetype.startsWith('video/') ? `${postId}/video_${index + 1}.${fileType}` : `${postId}/image_${index + 1}.${fileType}`
            const params = {
                Bucket: 'snap-posts-upload',
                Key: key, 
                Body:buffer, 
                ContentType: file.mimetype,
                ACL: 'public-read', 
            };   
            await s3.upload(params).promise();
            });
        await Promise.all(uploadPromises);
        body.content = req.files.map((file , index) => {
            const mediaType = file.mimetype.startsWith('video') ? 'video' : 'image'
            return `https://snap-posts-upload.s3.amazonaws.com/${postId}/${mediaType}_${index+1}.${file.originalname.split('.').pop()}`
        })
    try {
        const post = new Post(body)    
        await post.save() 
        const user = await User.findById(req.user.userId)
        if(user) {
            user.createdPosts.push(post._id) 
            
            await user.save()
        }
        res.json({message : 'Post created' , post}) 
    } catch(e) {
        console.log(e)
        res.status(500).json({errors : 'something went wrong while posting, Try again'})
    }
}     
        
        
        
postCon.update = async (req , res) => {
    const {postId} = req.params
    const body = _.pick(req.body , ['title', 'content' , 'body' , 'type'])
    try { 
        const posts = await Post.findByIdAndUpdate(postId , body, {new : true})
        res.json({message : 'Post Updated' , posts})
   } catch (e) {
        res.status(500).json({error : 'something went wrong'})
    }
}

postCon.getAllPosts = async(req , res) => {
    try { 
        const posts = await Post.find()
        res.json(posts)
    } catch (e){
        res.status(500).json({errors : 'something went wrong try again later'})
    }
} 

postCon.getPost = async (req , res) => {
    const {postId} = req.params
    try { 
        const post = await Post.findById(postId)
        res.json(post) 
    } catch(e){
        res.status(500).json({errors : 'something went wrong'})
    }
} 

postCon.deletePost = async (req , res) => {
    const {postId} = req.params
    try { 
        const posts = await Post.findById(postId)
        const deleteProm = posts.content.map(async(iUrl) => {
        const key = iUrl.split('snap-posts-upload.s3.amazonaws.com/')[1]
        const params = {
            Bucket : 'snap-posts-upload',
            Key : key
            }
            await s3.deleteObject(params).promise()
        }) 
        if(req.user.userRole == 'admin'){
            await Post.findByIdAndDelete(postId)
            res.json({message : 'Deleted' , posts})
        }  
        else if(req.user.userRole == 'moderator') {
            await Post.findOne({createdBy : req.user.userId , _id : postId}) 
            await Post.findByIdAndDelete(postId)
            await Promise.all(deleteProm) 
            res.json({message : 'Deleted' , posts})
        }
    } catch (e) {
        res.status(500).json({errors : 'something went wrong while deleting the post'}) 
    }
}
module.exports = postCon