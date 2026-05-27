const jwt = require('jsonwebtoken')
const JWT_SECRET = "12345";

const jwtAuthMiddleware = (req,res,next)=>{

  // now condition when jwt token is not available
  const authorization = req.headers.authorization;
  if(!authorization){ // not available
    return res.status(401).json({error:'Token Not Found'});
  }

  // extract the jwt token from the request headers
  // split on basis of space and take the token present in 1st index
  const token = req.headers.authorization.split(' ')[1];

  if(!token){
    return res.status(401).json({error:"Unauthorized"});
  }

  try{
    // verify the jwt token
    const decoded  = jwt.verify(token,JWT_SECRET);

    //Attach user information ot the request object
    req.user = decoded;
    next();
  }
  catch(err){
    console.log(err);
    res.status(401).json({error:"Invalid token"})
  }

}

// function to generate JWT token
const generatetoken = (userData)=>{
  // generate a new jwt token using user data
  return jwt.sign(userData,JWT_SECRET)
}

module.exports = {jwtAuthMiddleware,generatetoken};