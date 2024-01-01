const Post = require('../models/postModel') 
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
    const body = _.pick(req.body, ['title', 'content', 'body' , 'type'] )

    console.log(req.files)
    console.log(body)
        body.user = req.user.userId
        const postId = uuidv4()
        const uploadPromises = req.files.map(async (file, index) => {
        body.type = file.mimetype
        const buffer = file.mimetype.startsWith('video/') ? file.buffer : await sharp(file.buffer).resize({height : 1920 , width: 1080 , fit: 'contain' }).toBuffer()
        const key = file.mimetype.startsWith('video/') ? `${postId}/video_${index + 1}.${file.originalname.split('.').pop()}` : `${postId}/image_${index + 1}.jpg`
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
        res.json(post)

    } catch(e) {
        res.status(500).json(e.message)
    }
}     
        
        
        

postCon.update = async (req , res) => {
    const {id} = req.params
    const body = _.pick(req.body , ['title', 'content' , 'body' , 'type'])
    try { 
        const posts = await Post.findByIdAndUpdate(id , body, {new : true})
        res.json(posts)
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
    const {id} = req.params
    try { 
        const post = await Post.findById(id)
        res.json(post) 

    } catch(e){
        res.status(500).json({errors : 'something went wrong'})
    }
} 

postCon.deletePost = async (req , res) => {
    const {postId} = req.params
    try { 
        const posts = await Post.findById(postId) 
        if(!posts) {
          return  res.status(400).json({message : 'post not found'})
        }
        const deleteProm = posts.content.map(async(iUrl) => {
            const key = iUrl.split('snap-posts-upload.s3.amazonaws.com/')[1]
            const params = {
                Bucket : 'snap-posts-upload',
                Key : key
            }
            await s3.deleteObject(params).promise()
        }) 

        await Promise.all(deleteProm) 
        await Post.findByIdAndDelete(postId) 
        res.json({message : 'Deleted'})

    } catch (e) {
        res.status(500).json({message : 'something went wrong'}) 
        
    }
} 


module.exports = postCon