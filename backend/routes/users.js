const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');

// Get or create user profile
router.get('/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    let user = await User.findOne({ walletAddress });

    if (!user) {
      user = new User({ walletAddress });
      await user.save();
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user profile
router.put('/:walletAddress', [
  body('profile.name').optional().trim().isLength({ min: 1, max: 100 }),
  body('profile.email').optional().isEmail(),
  body('profile.bio').optional().isLength({ max: 500 }),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const walletAddress = req.params.walletAddress.toLowerCase();
    const user = await User.findOneAndUpdate(
      { walletAddress },
      { 
        $set: req.body,
        updatedAt: Date.now()
      },
      { new: true, upsert: true }
    );

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get user stats
router.get('/:walletAddress/stats', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const user = await User.findOne({ walletAddress });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update user stats (called by blockchain events)
router.post('/:walletAddress/stats', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const { field, value } = req.body;

    const user = await User.findOneAndUpdate(
      { walletAddress },
      { $inc: { [`stats.${field}`]: value } },
      { new: true, upsert: true }
    );

    res.json(user.stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
