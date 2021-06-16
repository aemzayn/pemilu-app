const mongoose = require('mongoose')
const Candidate = require('./Candidate')
const Election = require('./Election')

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    max: 256,
    min: 3,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    max: 256,
  },
  password: {
    type: String,
    max: 256,
    required: true,
  },
  ppi: {
    type: String,
    required: true,
  },
  hasVoted: {
    type: Boolean,
    default: false,
  },
  confirmed: {
    type: Boolean,
    default: false,
  },
  selection: [
    {
      electionId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Election,
      },
      selectedCandidate: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Candidate,
      },
    },
  ],
  isAdmin: {
    type: Boolean,
    default: false,
  },
})

module.exports = mongoose.model('User', UserSchema)
