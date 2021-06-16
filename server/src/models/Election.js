const mongoose = require('mongoose')
const Candidate = require('./Candidate')

const ElectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  candidates: [
    {
      totalVotes: {
        type: Number,
        default: 0,
      },
      candidateId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Candidate,
      },
      voters: [
        {
          name: String,
          ppi: String,
        },
      ],
      votesPerRegion: {
        Ankara: {
          type: Number,
          default: 0,
        },
        Bandirma: {
          type: Number,
          default: 0,
        },
        Bursa: {
          type: Number,
          default: 0,
        },
        Isparta: {
          type: Number,
          default: 0,
        },
        Istanbul: {
          type: Number,
          default: 0,
        },
        Izmir: {
          type: Number,
          default: 0,
        },
        Kastamonu: {
          type: Number,
          default: 0,
        },
        Kayseri: {
          type: Number,
          default: 0,
        },
        Kirklareli: {
          type: Number,
          default: 0,
        },
        Konya: {
          type: Number,
          default: 0,
        },
        Sakarya: {
          type: Number,
          default: 0,
        },
        Samsun: {
          type: Number,
          default: 0,
        },
        Trabzon: {
          type: Number,
          default: 0,
        },
      },
    },
  ],
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  hasStarted: {
    type: Boolean,
    default: false,
  },
  hasEnded: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  totalVotes: {
    type: Number,
    default: 0,
  },
})

module.exports = mongoose.model('Election', ElectionSchema)
