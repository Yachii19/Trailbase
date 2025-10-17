const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  tokenId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  student: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  institution: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  institutionName: {
    type: String,
    required: true
  },
  courseName: {
    type: String,
    required: true
  },
  certificateType: {
    type: String,
    enum: ['course', 'degree', 'workshop', 'certification', 'bootcamp', 'skill'],
    required: true
  },
  metadata: {
    description: String,
    dateIssued: Date,
    dateCompleted: Date,
    credits: Number,
    grade: String,
    skills: [String],
    ipfsHash: String,
    metadataURI: String,
    imageUrl: String
  },
  transactionHash: {
    type: String,
    required: true
  },
  isValid: {
    type: Boolean,
    default: true
  },
  revokedAt: Date,
  revocationReason: String,
  verification: {
    verifiedBy: String,
    verifiedAt: Date,
    verificationMethod: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
certificateSchema.index({ student: 1, isValid: 1 });
certificateSchema.index({ institution: 1, isValid: 1 });
certificateSchema.index({ certificateType: 1 });
certificateSchema.index({ 'metadata.dateIssued': -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
