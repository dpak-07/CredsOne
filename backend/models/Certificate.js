/**
 * Certificate Model
 * Manages digital certificates with blockchain integration
 */

const mongoose = require('mongoose');

const certificateSchema = new mongoose.Schema({
  certificateId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  learner: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    walletAddress: String,
    did: String
  },
  issuer: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: true
    },
    organization: {
      type: String,
      required: true
    }
  },
  course: {
    name: {
      type: String,
      required: true
    },
    description: String,
    duration: String,
    completionDate: {
      type: Date,
      required: true
    },
    grade: String,
    credits: Number
  },
  blockchain: {
    txHash: String,
    certHash: String,
    blockNumber: Number,
    timestamp: Date,
    network: {
      type: String,
      default: 'mumbai'
    }
  },
  badge: {
    type: String,
    enum: ['green', 'amber', 'blue', 'red'],
    default: 'green'
  },
  status: {
    type: String,
    enum: ['pending', 'issued', 'revoked', 'expired'],
    default: 'pending'
  },
  qrCode: {
    type: String
  },
  metadata: {
    skills: [String],
    achievements: [String],
    verificationUrl: String,
    ipfsHash: String
  },
  revocation: {
    isRevoked: {
      type: Boolean,
      default: false
    },
    revokedAt: Date,
    revokedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reason: String
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  legacyData: {
    isLegacy: {
      type: Boolean,
      default: false
    },
    source: String,
    originalFormat: String,
    migrationDate: Date,
    ocrConfidence: Number,
    needsApproval: {
      type: Boolean,
      default: false
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    approvedAt: Date
  }
}, {
  timestamps: true
});

// Virtual for verification URL
certificateSchema.virtual('verificationUrl').get(function() {
  return `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${this.certificateId}`;
});

// Method to get public certificate data
certificateSchema.methods.getPublicData = function() {
  return {
    certificateId: this.certificateId,
    learner: {
      name: this.learner.name,
      email: this.learner.email
    },
    issuer: {
      name: this.issuer.name,
      organization: this.issuer.organization
    },
    course: this.course,
    badge: this.badge,
    status: this.status,
    blockchain: {
      txHash: this.blockchain.txHash,
      certHash: this.blockchain.certHash,
      timestamp: this.blockchain.timestamp,
      network: this.blockchain.network
    },
    qrCode: this.qrCode,
    verificationCount: this.verificationCount,
    issuedAt: this.createdAt,
    isRevoked: this.revocation.isRevoked
  };
};

// Method to convert to Verifiable Credential format
certificateSchema.methods.toVerifiableCredential = function() {
  return {
    '@context': [
      'https://www.w3.org/2018/credentials/v1',
      'https://www.w3.org/2018/credentials/examples/v1'
    ],
    id: `urn:uuid:${this.certificateId}`,
    type: ['VerifiableCredential', 'EducationalCredential'],
    issuer: {
      id: this.issuer.walletAddress || this.issuer.userId.toString(),
      name: this.issuer.organization
    },
    issuanceDate: this.createdAt.toISOString(),
    credentialSubject: {
      id: this.learner.did || this.learner.walletAddress || this.learner.userId?.toString(),
      name: this.learner.name,
      email: this.learner.email,
      achievement: {
        name: this.course.name,
        description: this.course.description,
        completionDate: this.course.completionDate.toISOString(),
        grade: this.course.grade,
        credits: this.course.credits
      }
    },
    proof: {
      type: 'BlockchainProof',
      created: this.blockchain.timestamp?.toISOString(),
      proofPurpose: 'assertionMethod',
      verificationMethod: this.blockchain.txHash,
      blockchainNetwork: this.blockchain.network,
      certHash: this.blockchain.certHash
    }
  };
};

// Indexes
certificateSchema.index({ certificateId: 1 });
certificateSchema.index({ 'learner.userId': 1 });
certificateSchema.index({ 'learner.email': 1 });
certificateSchema.index({ 'issuer.userId': 1 });
certificateSchema.index({ status: 1 });
certificateSchema.index({ 'blockchain.txHash': 1 });
certificateSchema.index({ 'blockchain.certHash': 1 });
certificateSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Certificate', certificateSchema);
