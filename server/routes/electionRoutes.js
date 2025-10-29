const express = require('express');
const router = express.Router();
const Election = require('../models/Election');
const { auth, adminAuth } = require('../middleware/auth');

// Create a new election (admin only)
router.post('/', adminAuth, async (req, res) => {
  try {
    const election = new Election({
      ...req.body,
      createdBy: req.user._id
    });
    
    await election.save();
    res.status(201).json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get all elections
router.get('/', auth, async (req, res) => {
  try {
    const elections = await Election.find();
    res.json(elections);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get election by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const election = await Election.findById(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Update election (admin only)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const election = await Election.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json(election);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete election (admin only)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const election = await Election.findByIdAndDelete(req.params.id);
    
    if (!election) {
      return res.status(404).json({ message: 'Election not found' });
    }
    
    res.json({ message: 'Election deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;