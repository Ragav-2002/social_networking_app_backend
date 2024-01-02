const Vote = require('../models/voteModel')
const voteCon = {}

voteCon.vote = async(req, res)=>{
    const {targetId} = req.params
    const {userId} = req.user
    const voteData = {userId, targetId}
    try{
        if(await Vote.findOne(voteData)){
            await Vote.findOneAndDelete(voteData)
            res.json({msg: 'vote removed'})
        }else{
            const addVote = new Vote(voteData)
            await addVote.save()
            
            res.json({msg: 'vote added'})
        }
    }
    catch(e){
        res.status(500).json({errors: 'something went wrong'})
    }
}


module.exports = voteCon