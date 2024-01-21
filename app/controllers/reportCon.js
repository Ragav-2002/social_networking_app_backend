const _ = require('lodash');
const ReportPost = require('../models/RepPostModel');
const Post = require('../models/postModel') 
const Community = require('../models/communityModel')
const ReportedCommunity = require('../models/RepComModel')

const reportCon = {};

reportCon.reportPost = async (req, res) => {
    const { postId } = req.params;
    const body = _.pick(req.body, ['reason']);
    try {
       const post = await Post.findById(postId)
       post.reason = body.reason
        const report = new ReportPost({
            post
        }); 
        await report.save();
        res.status(201).json({ message: 'Report Sent' });
    } catch (e) {
        console.error('Error submitting report:', e.message);
        res.status(500).json({ errors: 'Internal Server Error'});
    }
};   

reportCon.getReportedPosts = async(req , res) => {
    try {
        const reportedPosts = await ReportPost.find()
        res.json(reportedPosts)
    } catch (e){
        res.status(500).json({errors : 'something went wrong'})
    }
}  

reportCon.reportComm = async (req , res) => {
    const {communityId} = req.params 
    const body = _.pick(req.body , ['reason']) 
    try {
        const community = await Community.findById(communityId) 
        const report = new ReportedCommunity ({
            community,
            reason : body.reason 
        })
        await report.save()
        res.status(201).json({message : 'Report Sent'})
    } catch (e) {
        res.status(500).json({errors : 'something went wrong'})
    }
} 

reportCon.getAllReportedCommunities = async (req , res) => {
    try {
        const reportedCommunities = await ReportedCommunity.find() 
        res.json(reportedCommunities)
    } catch (e) {
        res.status(500).json({errors : 'something went wrong'})
    }
}



module.exports = reportCon;