const mongoose = require('mongoose')

const CandidateSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  cvUrl: String,
  image: String,
})

module.exports = mongoose.model('Candidate', CandidateSchema)
