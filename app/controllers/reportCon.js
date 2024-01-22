const _ = require('lodash');
const ReportPost = require('../models/RepPostModel');
const Post = require('../models/postModel');
const Comments = require('../models/commentModel');
const Vote = require('../models/voteModel');

const reportCon = {};

reportCon.reportPost = async (req, res) => {
    const { postId } = req.params;
    const body = _.pick(req.body, ['reason']);
    try {
        if(await ReportPost.findOne({userId: req.user.userId, postId: postId})){
            return res.json({ message: 'already reported'})
        }
        body.postId = postId
        body.userId = req.user.userId
        const report = new ReportPost(body); 
        await report.save();
        res.status(201).json({ message: 'Report Sent' });
    } catch (e) {
        console.error('Error submitting report:', e.message);
        res.status(500).json({ errors: 'Internal Server Error'});
    }
};   

reportCon.getReportedPosts = async(req , res) => {
    try {
        const reportedPosts = await ReportPost.find().populate('postId')
        const groupedReports = reportedPosts.reduce((acc, report) => {
            const postId = report.postId._id.toString();
            if (!acc[postId]) {
              acc[postId] = {
                ...report.postId.toObject(),
                  reports: 1,
              };
            } else {
              acc[postId].reports += 1;
            }
            return acc;
          }, {});
          const formattedResponse = Object.values(groupedReports);
          res.json(formattedResponse)
    } catch (e){
        res.status(500).json({errors : 'something went wrong'})
    }
}

reportCon.removeReport = async(req, res) => {
    const id = req.params.id
    try{
        await ReportPost.deleteMany({postId: id})
        res.json({message: 'removed from reportedPosts'})
    }catch(e){
        res.status(500).json({errors : 'something went wrong'})
    }
}


module.exports = reportCon;