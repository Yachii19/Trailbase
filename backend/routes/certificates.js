const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Certificate = require('../models/Certificate');
const User = require('../models/User');

// Get all certificates (with filters)
router.get('/', async (req, res) => {
  try {
    const { student, institution, certificateType, isValid, page = 1, limit = 20 } = req.query;
    const query = {};

    if (student) query.student = student.toLowerCase();
    if (institution) query.institution = institution.toLowerCase();
    if (certificateType) query.certificateType = certificateType;
    if (isValid !== undefined) query.isValid = isValid === 'true';

    const certificates = await Certificate.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const count = await Certificate.countDocuments(query);

    res.json({
      certificates,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      total: count
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single certificate
router.get('/:tokenId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ tokenId: req.params.tokenId });
    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }
    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create certificate metadata (called after blockchain minting)
router.post('/', [
  body('tokenId').isInt(),
  body('student').isEthereumAddress(),
  body('institution').isEthereumAddress(),
  body('institutionName').trim().isLength({ min: 2 }),
  body('courseName').trim().isLength({ min: 2 }),
  body('certificateType').isIn(['course', 'degree', 'workshop', 'certification', 'bootcamp', 'skill']),
  body('transactionHash').isString(),
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      tokenId,
      student,
      institution,
      institutionName,
      courseName,
      certificateType,
      metadata,
      transactionHash
    } = req.body;

    const certificate = new Certificate({
      tokenId,
      student: student.toLowerCase(),
      institution: institution.toLowerCase(),
      institutionName,
      courseName,
      certificateType,
      metadata,
      transactionHash,
      isValid: true
    });

    await certificate.save();

    // Update stats
    await User.findOneAndUpdate(
      { walletAddress: student.toLowerCase() },
      { $inc: { 'stats.certificatesReceived': 1 } },
      { upsert: true }
    );

    await User.findOneAndUpdate(
      { walletAddress: institution.toLowerCase() },
      { $inc: { 'stats.certificatesIssued': 1 } },
      { upsert: true }
    );

    res.status(201).json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify certificate
router.get('/verify/:tokenId', async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ tokenId: req.params.tokenId });
    
    if (!certificate) {
      return res.status(404).json({ 
        verified: false,
        error: 'Certificate not found' 
      });
    }

    res.json({
      verified: certificate.isValid,
      certificate: {
        tokenId: certificate.tokenId,
        student: certificate.student,
        institution: certificate.institutionName,
        courseName: certificate.courseName,
        certificateType: certificate.certificateType,
        issuedDate: certificate.metadata.dateIssued,
        isValid: certificate.isValid
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Revoke certificate
router.post('/:tokenId/revoke', [
  body('reason').optional().trim().isLength({ max: 500 }),
], async (req, res) => {
  try {
    const { reason } = req.body;

    const certificate = await Certificate.findOneAndUpdate(
      { tokenId: req.params.tokenId },
      {
        isValid: false,
        revokedAt: Date.now(),
        revocationReason: reason
      },
      { new: true }
    );

    if (!certificate) {
      return res.status(404).json({ error: 'Certificate not found' });
    }

    res.json(certificate);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
