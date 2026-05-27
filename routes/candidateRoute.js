const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate");
const  {jwtAuthMiddleware} = require('../jwt');
const User = require('../Models/User');

const checkAdmin = async (userId) => {
  try {
    const DBUser = await User.findById(userId); 
    
    if (DBUser && DBUser.role === 'admin') {
      return true;
    }
    return false;
  } catch (err) {
    console.log("Error in checkAdmin:", err);
    return false;
  }
}
// Register New Candidate by admin
router.post('/', jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    if (!(await checkAdmin(userId))) {
      console.log(`User is not admin - Not allowed : ${userId}`);
      // FIXED: Removed the broken Candidate.find() lines that caused the undefined logs
      return res.status(403).json({ message: "User doesn't have admin role" });
    }
    
    const data = req.body;
    const newCandidate = new Candidate(data);

    await newCandidate.save();
    res.status(200).json({ response: newCandidate });
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.put('/:candidateId',jwtAuthMiddleware , async(req,res)=>{

  try{
    const userId = req.user.id;
    if( !(await checkAdmin(userId) )){
      console.log('User is not admin not allowed')
      return res.status(403).json({mesage:`user don't have admin role `})
    }
    const candidateId = req.params.candidateId;
    

    const updatedCandidateData = req.body;

    const response = await Candidate.findByIdAndUpdate(candidateId , updatedCandidateData ,{
      new:true,
      runValidators:true
    })

    if(!response){
      return res.status(404).json({error:'Candidate not found'});
    }

    console.log('Candidate data updated')
    res.status(200).json(response)
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:'Internel Server Error'});
  }
})

// Deleting the candidate by its id
router.delete('/:candidateId' ,jwtAuthMiddleware,  async(req,res)=>{
  try{
    const userId = req.user.id;
    if( !(await checkAdmin(userId) )){
      console.log('User is not admin not allowed')
      return res.status(403).json({mesage:`user don't have admin role `})
    }
    const candidateId = req.params.candidateId;
    const response = await Candidate.findByIdAndDelete(candidateId);

    if(!response){
      return res.status(404).json({error:'Candidate not found'});
    }

    console.log('Candidate Deleted')
    res.status(200).json(response);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:'Internel Server Error'});
  }
})

// Get List of all candidates with only name and party fields
router.get('/' ,async (req,res)=>{
  try{
    const data = await Candidate.find();

    // get all the data 
    res.status(200).json(data);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server Error"});
  }
})


router.get('/vote/count', async(req,res)=>{
  // See the vote count of all the candidates 

  try{
    const candidate = await Candidate.find().sort({voteCount:'desc'});

    // Now returning only the candidate name and their votecount
    const voteRecord = candidate.map((each)=>{
      return{
        party:each.party,
        count:each.voteCount
      }
    });

    return res.status(200).json(voteRecord);
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server Error"});
  }
})


// User Vote Route 
router.post('/voter/:candidateId' , jwtAuthMiddleware , async (req,res)=>{
  //Allow only voter to vote  , admin not allowed to vote and user vote atmost 1.
  const candidateId = req.params.candidateId;
  const userId = req.user.id;
  try{
    const candidate = await Candidate.findById(candidateId);
    if(!candidate){
      return res.status(404).json({message:'Candidate not Found'});
    }

    const user = await User.findById(userId);

    if(!user){
      return res.status(404).json({message:'User not found'});
    }
    if(user.role === 'admin'){
      res.status(403).json({message:'admin is not allowd'});
    }
    if(user.isVoted){
        return res.status(400).json({ message: 'You have already voted' });
    }


    // voter vote the candidate so push its id 
    candidate.votes.push({user:userId});
    candidate.voteCount++;
    await candidate.save();
    
    user.isVoted = true;
    await user.save();

    res.status(200).json({message:'Your Vote Registered'});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:"Internal server Error"});
  }

})


module.exports = router;
