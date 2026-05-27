const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

// define the Person Schema  
const UserSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true // as this is mandatory parameter for the schema.

  },
  age:{
    type:Number,
    required:true
  },
  email:{
    type:String,
  },
  mobile:{
    type:String,
  },
  address:{
    type:String,
    required:true,
  },
  aadharCardNumber:{
    type:Number,
    required:true,
    unique:true,
  },
  password:{
    type:String,
    required:true,
  },
  role:{
    type:String,
    enum:['voter','admin']
  },
  isVoted:{
    type:Boolean,
    default:false,
  }
})

// now before storing the data need to hash password 
UserSchema.pre('save',async function(){

  // this will store the current person/document we are talking about
  const person = this;
  
  // firstly check is other than password is modified no need to hash
  if( !person.isModified('password') ) return;

  try{
    
    //generate salt 
    const salt = await bcrypt.genSalt(10);
    
    // now hash 
    const hashPassword =await bcrypt.hash(person.password,salt);


    person.password = hashPassword;
    
  }
  catch(err){
    return err;
  }
})

UserSchema.methods.comparePassword = async function(receivedPassword){
  try{
    const isSame = await bcrypt.compare(receivedPassword , this.password);
    return isSame;
  }
  catch(err){
    throw err;
  }
}




// checks if it exists  otherwise creates it
const User = mongoose.models.user || mongoose.model('user', UserSchema);
module.exports = User;