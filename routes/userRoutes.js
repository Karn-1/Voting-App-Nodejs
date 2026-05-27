const express = require("express");
const router = express.Router();
const user = require("../models/User");
const  {jwtAuthMiddleware,generatetoken} = require('../jwt');
const Candidate = require("../models/candidate");

const AdminPresent = async function(data){
  const allRecord = await user.find({role:'admin'});
  if(allRecord.length >=1){
    /// means more than one admin person so now no more allowed
    return true;
  }
  return false;
}

// POST route to add a user
router.post("/signup", async (req, res) => {
  // now new user come here sign up needed take the id from the response and put into the payload and its been used to make the token
  try {
    const data = req.body; // Assuming the request 

    if( data.role === 'admin' && await AdminPresent(data)){
      return res.status(400).json({ error: "More than one admin is present" });
    }

     // Validate Aadhar Card Number must have exactly 12 digit
    if (!/^\d{12}$/.test(data.aadharCardNumber)) {
        return res.status(400).json({ error: 'Aadhar Card Number must be exactly 12 digits' });
    }

    // Check if a user with the same Aadhar Card Number already exists
    const existingUser = await user.findOne({ aadharCardNumber: data.aadharCardNumber });
    if (existingUser) {
        return res.status(400).json({ error: 'User with the same Aadhar Card Number already exists' });
    }

    const newuser = new user(data);

    // Save the new person to the database
    const response = await newuser.save();
    if(!response){
      return res.status(500).json({error:"Internel Server Error in Saving use unique email"});
    }
    console.log("data saved");

    const payload = {
      id:response.id, // Other info not there so that they remain safe.
    }

    console.log(JSON.stringify(payload));
    const token = generatetoken(payload); // token generated 

    console.log("Here user: " , response.name , "have token:" , token);
    res.status(200).json({response:response , token:token});


  } catch (err) {
    console.log(err);
    res.status(400).json("Internal Server Error");
  }
});

// Login Route
router.post('/login' , async(req,res)=>{
  try{
    // extract the data received in body 
    const {aadharCardNumber , password} = req.body;

    // find this user 
    const User =await user.findOne({aadharCardNumber:aadharCardNumber});

    // check does user of this aadhar card number is present or not . 
    if(!(User) || !(await User.comparePassword(password))){
      return res.status(401).json({error:'Invalid username or password'});
    }

    // Generate token 
    const payload = {
      id : User.id,
    }
    const token = generatetoken(payload);

    // return token as response
    res.json({token});
  }
  catch(err){
    console.log(err);
    res.status(500).json({error:'Internal Server Error'});
  }
})

// Prfile route
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {

    const userData = req.user;

    const User = await user.findById(userData.id);
        if(!User){
      return res.status(404).json({
          error: "User not found"
      });
    }

    res.status(200).json({ User });

  } catch (err) {

    console.log(err);

    res.status(500).json({ error: "Internal Server Error" });

  }
});

router.get("/",jwtAuthMiddleware , async (req, res) => {
  try {
    console.log("YOOOO");
    const data = await Person.find();
    res.status(200).json(data);
  } catch (error) {
    console.log(error);
    res.send(404).json({ error: "Error in finding data" });
  }
});

// when call put on this url then password will change
router.put("/profile/password",jwtAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.id;
    // const userNewData = req.body;

    const {currentPassword,newPassowrd} = req.body; // finding the new and old password for checking
    
    const User = await user.findById(userid);


    // if password does not match return error
    if(!(await User.comaprePassword(currentPassword))){
      return res.status(401).json({error:'Invalid pasword'});

      // update the password
      User.password = newPassword;
      await User.save();

      console.log('password updated')
      res.status(200).json({mesage:"Password  updated"})

    }
    

  } catch(err){
      cosnole.log(err);
      res.status(500).json({error:"Internal Server Error"});
    }
});



router.put('/profile/password', jwtAuthMiddleware, async (req, res) => {
    try {
        const userId = req.user.id; // Extract the id from the token
        const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body

        // Check if currentPassword and newPassword are present in the request body
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: 'Both currentPassword and newPassword are required' });
        }

        // Find the user by userID
        const user = await User.findById(userId);

        // If user does not exist or password does not match, return error
        if (!user || !(await user.comparePassword(currentPassword))) {
            return res.status(401).json({ error: 'Invalid current password' });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        console.log('password updated');
        res.status(200).json({ message: 'Password updated' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
