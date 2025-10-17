const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Gig = require('../models/Gig');
const User = require('../models/User');

// Get all gigs (with filters)
router.get('/', async (req, res) => {
  try {
    const { status, category, client, freelancer, page = 1, limit = 20 } = req.query;
    const query = {};

    if (status) query.status = status;
    if (category) query.category = category;
    if (client) query.client = client.toLowerCase();
    if (freelancer) query.freelancer = freelancer.toLowerCase();

    const gigs = await Gig.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Gig.countDocuments(query);

    res.json({
      gigs,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single gig
router.get('/:gigId', async (req, res) => {
  try {
    const gig = await Gig.findOne({ gigId: req.params.gigId });
    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }
    res.json(gig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create gig metadata (called after blockchain transaction)
router.post('/', [
  body('gigId').isInt(),
  body('client').isEthereumAddress(),
  body('title').trim().isLength({ min: 5, max: 200 }),
  body('description').trim().isLength({ min: 20 }),
  body('amount').isNumeric(),
  body('transactionHash').isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { gigId, client, title, description, category, skills, amount, deadline, transactionHash } = req.body;

    const gig = new Gig({
      gigId,
      client: client.toLowerCase(),
      title,
      description,
      category,
      skills,
      amount,
      deadline,
      status: 'open',
      transactionHash
    });

    await gig.save();

    // Update client stats
    await User.findOneAndUpdate(
      { walletAddress: client.toLowerCase() },
      { 
        $inc: { 'stats.gigsPosted': 1, 'stats.totalSpent': amount }
      },
      { upsert: true }
    );

    res.status(201).json(gig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Accept gig (update after blockchain transaction)
router.post('/:gigId/accept', [
  body('freelancer').isEthereumAddress(),
  body('transactionHash').isString(),
], async (req, res) => {
  try {
    const { freelancer, transactionHash } = req.body;

    const gig = await Gig.findOneAndUpdate(
      { gigId: req.params.gigId },
      {
        freelancer: freelancer.toLowerCase(),
        status: 'accepted',
        acceptedAt: Date.now(),
        $set: { 'metadata.acceptTxHash': transactionHash }
      },
      { new: true }
    );

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Complete gig (update after blockchain transaction)
router.post('/:gigId/complete', [
  body('proofTokenId').isInt(),
  body('completionHash').isString(),
  body('metadataURI').isString(),
], async (req, res) => {
  try {
    const { proofTokenId, completionHash, metadataURI } = req.body;

    const gig = await Gig.findOneAndUpdate(
      { gigId: req.params.gigId },
      {
        status: 'completed',
        completedAt: Date.now(),
        proofTokenId,
        completionHash,
        'metadata.metadataURI': metadataURI
      },
      { new: true }
    );

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    // Update freelancer stats
    await User.findOneAndUpdate(
      { walletAddress: gig.freelancer },
      { 
        $inc: { 'stats.gigsCompleted': 1, 'stats.totalEarned': gig.amount }
      },
      { upsert: true }
    );

    res.json(gig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add message to gig
router.post('/:gigId/messages', [
  body('sender').isEthereumAddress(),
  body('message').trim().isLength({ min: 1, max: 1000 }),
], async (req, res) => {
  try {
    const { sender, message } = req.body;

    const gig = await Gig.findOneAndUpdate(
      { gigId: req.params.gigId },
      {
        $push: {
          messages: {
            sender: sender.toLowerCase(),
            message,
            timestamp: Date.now()
          }
        }
      },
      { new: true }
    );

    if (!gig) {
      return res.status(404).json({ error: 'Gig not found' });
    }

    res.json(gig);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
