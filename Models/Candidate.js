const mongoose = require("mongoose")
const bcrypt = require('bcrypt')

// define the Person Schema  
const CandidateSchema = new mongoose.Schema({
  name:{
    type:String,
    required:true // as this is mandatory parameter for the schema.

  },
  party:{
    type:String,
    required:true
  },
  age:{
    type:Number,
    required:true
  },
  votes:[
    {
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required:true
      },
      votedAt:{
        type:Date,
        default:Date.now()
      }
    }
  ],
  voteCount:{
    type:Number,
    default:0
  }
})

const Candidate = mongoose.model('candidate', CandidateSchema);
module.exports = Candidate;