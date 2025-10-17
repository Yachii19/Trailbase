const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Institution = require('../models/Institution');

// Get all institutions
router.get('/', async (req, res) => {
  try {
    const { verificationStatus, institutionType, onChainVerified, page = 1, limit = 20 } = req.query;
    const query = {};

    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (institutionType) query.institutionType = institutionType;
    if (onChainVerified !== undefined) query.onChainVerified = onChainVerified === 'true';

    const institutions = await Institution.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Institution.countDocuments(query);

    res.json({
      institutions,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single institution
router.get('/:walletAddress', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const institution = await Institution.findOne({ walletAddress });
    
    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit verification request
router.post('/verify', [
  body('walletAddress').isEthereumAddress(),
  body('institutionName').trim().isLength({ min: 2, max: 200 }),
  body('institutionType').isIn(['university', 'college', 'bootcamp', 'training-center', 'online-platform', 'other']),
  body('contactEmail').isEmail(),
  body('website').optional().isURL(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      walletAddress,
      institutionName,
      institutionType,
      registrationNumber,
      website,
      contactEmail,
      description,
      location
    } = req.body;

    // Check if already exists
    let institution = await Institution.findOne({ walletAddress: walletAddress.toLowerCase() });

    if (institution) {
      return res.status(400).json({ error: 'Institution already registered' });
    }

    institution = new Institution({
      walletAddress: walletAddress.toLowerCase(),
      institutionName,
      institutionType,
      registrationNumber,
      website,
      contactEmail,
      description,
      location,
      verificationStatus: 'pending'
    });

    await institution.save();

    res.status(201).json(institution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Approve institution (admin only - add auth middleware in production)
router.post('/:walletAddress/approve', [
  body('verifiedBy').isEthereumAddress(),
], async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const { verifiedBy } = req.body;

    const institution = await Institution.findOneAndUpdate(
      { walletAddress },
      {
        verificationStatus: 'approved',
        verifiedAt: Date.now(),
        verifiedBy: verifiedBy.toLowerCase()
      },
      { new: true }
    );

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reject institution
router.post('/:walletAddress/reject', [
  body('reason').trim().isLength({ min: 5, max: 500 }),
], async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();
    const { reason } = req.body;

    const institution = await Institution.findOneAndUpdate(
      { walletAddress },
      {
        verificationStatus: 'rejected',
        rejectionReason: reason
      },
      { new: true }
    );

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mark as on-chain verified (called after blockchain transaction)
router.post('/:walletAddress/on-chain', async (req, res) => {
  try {
    const walletAddress = req.params.walletAddress.toLowerCase();

    const institution = await Institution.findOneAndUpdate(
      { walletAddress },
      { onChainVerified: true },
      { new: true }
    );

    if (!institution) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    res.json(institution);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
