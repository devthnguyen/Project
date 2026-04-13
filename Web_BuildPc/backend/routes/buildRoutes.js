const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/build/save
// @desc    Save a PC build to the user's profile
// @access  Private
router.post('/save', protect, async (req, res) => {
  try {
    const { build } = req.body;

    if (!build) {
      return res.status(400).json({ message: 'Build data is required' });
    }

    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Push the new build into the array
    user.savedBuilds.push(build);
    await user.save();

    res.status(200).json({ message: 'Build saved successfully', savedBuilds: user.savedBuilds });
  } catch (error) {
    console.error('Save Build Error:', error);
    res.status(500).json({ message: 'Server error saving build', error: error.message });
  }
});

module.exports = router;