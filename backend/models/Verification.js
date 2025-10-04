/**
 * Verification Model
 * Tracks certificate verification attempts and results
 */

const mongoose = require('mongoose');

const verificationSchema = new mongoose.Schema({
  verificationId: {
    type: String,
    required: true,
    unique: true
  },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    required: true
  },
  certificateId: {
    type: String,
    required: true
  },
  verificationType: {
    type: String,
    enum: ['qr', 'blockchain', 'manual', 'api'],
    required: true
  },
  verifier: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: String,
    email: String,
    organization: String,
    ipAddress: String,
    userAgent: String
  },
  isValid: {
    type: Boolean,
    required: true
  },
  badge: {
    type: String,
    enum: ['green', 'amber', 'blue', 'red'],
    required: true
  },
  result: {
    blockchainVerified: Boolean,
    certificateFound: Boolean,
    notRevoked: Boolean,
    notExpired: Boolean,
    hashMatches: Boolean,
    message: String,
    details: mongoose.Schema.Types.Mixed
  },
  isManual: {
    type: Boolean,
    default: false
  },
  manualVerification: {
    verifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    documents: [String],
    approvalStatus: {
      type: String,
      enum: ['pending', 'approved', 'rejected']
    }
  }
}, {
  timestamps: true
});

// Method to get public verification data
verificationSchema.methods.getPublicData = function() {
  return {
    verificationId: this.verificationId,
    certificateId: this.certificateId,
    verificationType: this.verificationType,
    isValid: this.isValid,
    badge: this.badge,
    result: this.result,
    verifiedAt: this.createdAt,
    verifier: this.verifier.organization || 'Anonymous'
  };
};

// Static method to get verification statistics
verificationSchema.statics.getStats = async function(filters = {}) {
  const stats = await this.aggregate([
    { $match: filters },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        valid: { $sum: { $cond: ['$isValid', 1, 0] } },
        invalid: { $sum: { $cond: ['$isValid', 0, 1] } },
        byType: {
          $push: {
            type: '$verificationType',
            isValid: '$isValid'
          }
        },
        byBadge: {
          $push: {
            badge: '$badge',
            count: 1
          }
        }
      }
    }
  ]);

  return stats[0] || {
    total: 0,
    valid: 0,
    invalid: 0,
    byType: [],
    byBadge: []
  };
};

// Indexes
verificationSchema.index({ verificationId: 1 });
verificationSchema.index({ certificate: 1 });
verificationSchema.index({ certificateId: 1 });
verificationSchema.index({ 'verifier.userId': 1 });
verificationSchema.index({ verificationType: 1 });
verificationSchema.index({ isValid: 1 });
verificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Verification', verificationSchema);
