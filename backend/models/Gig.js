const mongoose = require('mongoose');

const gigSchema = new mongoose.Schema({
  gigId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  client: {
    type: String,
    required: true,
    lowercase: true,
    index: true
  },
  freelancer: {
    type: String,
    lowercase: true,
    index: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['development', 'design', 'writing', 'marketing', 'consulting', 'other'],
    default: 'other'
  },
  skills: [String],
  amount: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['open', 'accepted', 'completed', 'disputed', 'cancelled'],
    default: 'open',
    index: true
  },
  proofTokenId: {
    type: Number
  },
  transactionHash: {
    type: String
  },
  completionHash: {
    type: String
  },
  metadata: {
    ipfsHash: String,
    metadataURI: String
  },
  milestones: [{
    title: String,
    description: String,
    amount: Number,
    completed: { type: Boolean, default: false },
    completedAt: Date
  }],
  deliverables: [{
    title: String,
    url: String,
    uploadedAt: Date
  }],
  messages: [{
    sender: String,
    message: String,
    timestamp: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  acceptedAt: Date,
  completedAt: Date,
  cancelledAt: Date
}, {
  timestamps: true
});

// Indexes
gigSchema.index({ status: 1, deadline: 1 });
gigSchema.index({ client: 1, status: 1 });
gigSchema.index({ freelancer: 1, status: 1 });
gigSchema.index({ category: 1, status: 1 });

module.exports = mongoose.model('Gig', gigSchema);
