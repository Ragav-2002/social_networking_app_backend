const Vote = require('../models/voteModel')
const Post = require('../models/postModel')
const User = require('../models/userModel')
const nodemailer = require('nodemailer')

const voteCon = {}

const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : 'snapp8006@gmail.com',
        pass : 'upby yvih lboq mcxw'
    }
})

voteCon.vote = async(req, res)=>{
    const {targetId} = req.params
    const {userId} = req.user
    const voteData = {userId, targetId}
    try{
        const post = await Post.findById(targetId).populate('user', 'email username')
        if(await Vote.findOne(voteData)){
            await Vote.findOneAndDelete(voteData)
            const postCreatorMail = post.user.email 

            const liker = await User.findById(userId)
            const likersName = liker.username

            const mailOptions = {
                from : 'snapp8006@gmail.com',
                to : postCreatorMail,
                subject : 'Post React',
                text : `${likersName} has unliked your post - ${post.title}`
            } 

            // transporter.sendMail (mailOptions , (error , info) => {
            //     if(error) {
            //         console.log(error)
            //     } else {
            //         console.log('sent' + info.response)
            //     }
            // })
            
            const votes = await Vote.find()
            res.json(votes)
        }else{
            const addVote = new Vote(voteData)

            await addVote.save() 
            const postCreatorMail = post.user.email 
            const liker = await User.findById(userId)
            const likersName = liker.username 

            const mailOptions = {
                from : 'snapp8006@gmail.com',
                to : postCreatorMail,
                subject : 'Post React',
                text : `${likersName} has liked your post - ${post.title}`
            } 

            transporter.sendMail(mailOptions , (error , info) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log('sent:' + info.response)
                }
            })
            const votes = await Vote.find()
            res.json(votes)
        }
    }
    catch(e){
        res.status(500).json({errors : 'something went wrong'})
    }
}

voteCon.getLikes = async(req, res)=>{
    try{
        const votes = await Vote.find() 
        res.json(votes)
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}

module.exports = voteCon