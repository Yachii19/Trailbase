const mongoose = require('mongoose');

const institutionSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  institutionName: {
    type: String,
    required: true
  },
  institutionType: {
    type: String,
    enum: ['university', 'college', 'bootcamp', 'training-center', 'online-platform', 'other'],
    required: true
  },
  registrationNumber: {
    type: String
  },
  website: {
    type: String
  },
  contactEmail: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  location: {
    country: String,
    state: String,
    city: String,
    address: String
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  },
  verificationDocuments: [{
    documentType: String,
    documentUrl: String,
    uploadedAt: Date
  }],
  onChainVerified: {
    type: Boolean,
    default: false
  },
  verifiedAt: Date,
  verifiedBy: String, // Admin wallet address
  rejectionReason: String,
  stats: {
    certificatesIssued: { type: Number, default: 0 },
    studentsServed: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes
institutionSchema.index({ verificationStatus: 1 });
institutionSchema.index({ institutionType: 1 });
institutionSchema.index({ onChainVerified: 1 });

module.exports = mongoose.model('Institution', institutionSchema);
