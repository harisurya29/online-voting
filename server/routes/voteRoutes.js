const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const User = require('../models/User');
const Election = require('../models/Election');
const { auth } = require('../middleware/auth');

// Cast a vote
router.post('/', auth, async (req, res) => {
  try {
    const { electionId, candidateName } = req.body;
    
    // Check if election exists
    const election = await Election.findById(electionId);
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    // Check if election is active
    if (election.status !== 'active') {
      return res.status(400).json({ message: 'Election is not active' });
    }
    
    // Check if user has already voted in this election
    const existingVote = await Vote.findOne({
      voter: req.user._id,
      election: electionId
    });
    
    if (existingVote) {
      return res.status(400).json({ message: 'You have already voted in this election' });
    }
    
    // Create vote
    const vote = new Vote({
      voter: req.user._id,
      election: electionId,
      candidate: candidateName
    });
    
    await vote.save();
    
    // Update candidate vote count
    await Election.findOneAndUpdate(
      { _id: electionId, 'candidates.name': candidateName },
      { $inc: { 'candidates.$.votes': 1 } }
    );
    
    // Update user's hasVoted map
    await User.findByIdAndUpdate(
      req.user._id,
      { $set: { [`hasVoted.${electionId}`]: true } }
    );
    
    res.status(201).json({ message: 'Vote cast successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get vote statistics for an election
router.get('/stats/:electionId', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.electionId);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    const totalVotes = election.candidates.reduce((sum, candidate) => sum + candidate.votes, 0);
    
    const stats = {
      totalVotes,
      candidates: election.candidates.map(candidate => ({
        name: candidate.name,
        votes: candidate.votes,
        percentage: totalVotes > 0 ? (candidate.votes / totalVotes) * 100 : 0
      }))
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Check if user has voted in a specific election
router.get('/check/:electionId', auth, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      voter: req.user._id,
      election: req.params.electionId
    });
    
    res.json({ hasVoted: !!vote });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;