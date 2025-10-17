const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    index: true
  },
  userType: {
    type: String,
    enum: ['student', 'freelancer', 'client', 'institution'],
    default: 'student'
  },
  profile: {
    name: String,
    email: String,
    bio: String,
    avatar: String,
    location: String,
    skills: [String],
    socialLinks: {
      twitter: String,
      linkedin: String,
      github: String,
      website: String
    }
  },
  institutionData: {
    institutionName: String,
    institutionType: String,
    registrationNumber: String,
    website: String,
    contactEmail: String,
    isVerified: { type: Boolean, default: false },
    verifiedAt: Date
  },
  stats: {
    certificatesIssued: { type: Number, default: 0 },
    certificatesReceived: { type: Number, default: 0 },
    gigsCompleted: { type: Number, default: 0 },
    gigsPosted: { type: Number, default: 0 },
    totalEarned: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
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
userSchema.index({ 'profile.email': 1 });
userSchema.index({ 'institutionData.isVerified': 1 });
userSchema.index({ userType: 1 });

module.exports = mongoose.model('User', userSchema);
