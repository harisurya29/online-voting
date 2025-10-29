const mongoose = require('mongoose');

const VoteSchema = new mongoose.Schema({
  voter: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  election: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Election',
    required: true
  },
  candidate: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Ensure a voter can only vote once per election
VoteSchema.index({ voter: 1, election: 1 }, { unique: true });

module.exports = mongoose.model('Vote', VoteSchema);