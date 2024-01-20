const Comment = require("../models/commentModel");
const nodemailer = require('nodemailer');
const _ = require('lodash');
const commentCon = {};
const User = require('../models/userModel');
const Post = require('../models/postModel');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'snapp8006@gmail.com',
        pass: 'iswi mqtn vsde pmta'
    }
});

commentCon.create = async (req, res) => {
    const body = _.pick(req.body, ['content']);
    body.user = req.user.userId;
    body.post = req.params.id;

    try {
        const comment = new Comment(body);
        await comment.save();
        const [commentDetails, userDetails, postDetails] = await Promise.all([
        Comment.findById(comment._id).populate('user', 'username'),
        User.findById(req.user.userId),
        Post.findById(req.params.id, 'title').populate('user', 'email'), 
        ]);
        const postCreatorEmail = postDetails.user ? postDetails.user.email : '';
        const commenterUsername = userDetails ? userDetails.username : '';
        const mailOptions = {
            from: 'snapp8006@gmail.com',
            to: postCreatorEmail,
            subject: 'New Comment on Your Post',
            text: ` "${commenterUsername}" has commented on your post "${postDetails.title}" comment: "${body.content}"`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });

        res.json({ message: 'Comment posted', comment });
    } catch (e) {
        res.status(500).json({ errors: 'something went wrong' });
    }
};



commentCon.edit = async(req, res)=>{
    const {id} = req.params
    const body = _.pick(req.body, ['content'])
    try{
        const comment = await Comment.findByIdAndUpdate(id, body, {new: true})
        res.json({message : 'comment edited',comment})
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

commentCon.showAll = async(req, res)=>{
    try{
        const comments = await Comment.find()
        res.json(comments) 
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

commentCon.delete = async(req, res)=>{
    const {id} = req.params
    try{
        const comment = await Comment.findByIdAndDelete(id)
        res.json({message : 'Comment Deleted Successfully' , comment})
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

module.exports = commentCon