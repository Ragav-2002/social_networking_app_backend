const Vote = require('../models/voteModel')
const voteCon = {}

voteCon.vote = async(req, res)=>{
    const {targetId} = req.params
    const {userId} = req.user
    const voteData = {userId, targetId}
    try{
        if(await Vote.findOne(voteData)){
            await Vote.findOneAndDelete(voteData)
            const votes = await Vote.find()
            res.json(votes)
        }else{
            const addVote = new Vote(voteData)
            await addVote.save()
            const votes = await Vote.find()
            res.json(votes)
        }
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
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