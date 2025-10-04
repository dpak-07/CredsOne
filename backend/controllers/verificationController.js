/**
 * Verification Controller
 */

const Verification = require('../models/Verification');
const Certificate = require('../models/Certificate');
const AuditLog = require('../models/AuditLog');
const { verifyCertificateOnChain } = require('../services/blockchainService');
const { generateCertificateHash, verifyCertificateHash } = require('../utils/hashUtils');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Verify certificate
 */
const verifyCertificate = asyncHandler(async (req, res) => {
  const { certificateData, verificationType } = req.body;

  // Generate hash from certificate data
  const certHash = generateCertificateHash(certificateData);

  // Find certificate in database
  const certificate = await Certificate.findOne({
    'blockchain.certHash': certHash
  });

  // Verify on blockchain
  const blockchainResult = await verifyCertificateOnChain(certHash);

  let isValid = false;
  let badge = 'red';
  let result = {
    exists: false,
    issuer: null,
    issuedAt: null,
    revoked: false,
    blockchainStatus: 'Not found'
  };

  if (certificate) {
    isValid = true;
    
    if (certificate.status === 'revoked') {
      badge = 'red';
      isValid = false;
      result.revoked = true;
    } else if (certificate.blockchain.isOnChain && blockchainResult.exists) {
      badge = 'green';
      result.exists = true;
      result.issuer = blockchainResult.issuer;
      result.issuedAt = blockchainResult.issuedAt;
      result.blockchainStatus = blockchainResult.blockchainStatus;
    } else if (certificate.isLegacy) {
      badge = 'amber';
      result.exists = true;
      result.blockchainStatus = 'Legacy certificate (not on blockchain)';
    } else {
      badge = 'blue';
      result.exists = true;
      result.blockchainStatus = 'Database record found';
    }

    // Update verification count
    certificate.verificationCount += 1;
    certificate.lastVerifiedAt = new Date();
    await certificate.save();
  }

  // Create verification record
  const verification = await Verification.create({
    certificate: {
      certificateId: certificate ? certificate.certificateId : 'UNKNOWN',
      certHash,
      dbReference: certificate ? certificate._id : null
    },
    verificationType,
    verifier: req.user ? {
      userId: req.user._id,
      name: req.user.fullName,
      organization: req.user.organization,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    } : {
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    },
    isValid,
    badge,
    result,
    certificateData
  });

  // Create audit log
  if (req.user) {
    await AuditLog.createLog({
      action: 'certificate_verified',
      actor: {
        userId: req.user._id,
        username: req.user.username,
        role: req.user.role,
        ipAddress: req.ip
      },
      target: {
        type: 'Certificate',
        targetId: certificate ? certificate.certificateId : 'UNKNOWN'
      },
      badge,
      details: new Map([
        ['verificationType', verificationType],
        ['isValid', isValid]
      ])
    });
  }

  res.json({
    success: true,
    verification: {
      isValid,
      badge,
      result,
      certificate: certificate ? certificate.getPublicData() : null
    }
  });
});

/**
 * Manual verification (for certificates not on blockchain)
 */
const manualVerification = asyncHandler(async (req, res) => {
  const { certificateHash, notes, evidence, certificateData } = req.body;

  // Create manual verification record
  const verification = await Verification.create({
    certificate: {
      certificateId: certificateData.certificateId || 'MANUAL',
      certHash: certificateHash
    },
    verificationType: 'manual',
    verifier: {
      userId: req.user._id,
      name: req.user.fullName,
      organization: req.user.organization
    },
    isValid: true,
    badge: 'blue',
    result: {
      exists: true,
      blockchainStatus: 'Manually verified',
      databaseStatus: 'Manual verification'
    },
    isManual: true,
    manualVerification: {
      notes,
      evidence: evidence || [],
      verifiedBy: req.user._id,
      verifiedAt: new Date(),
      confidence: 85
    },
    certificateData
  });

  // Create audit log
  await AuditLog.createLog({
    action: 'manual_verification',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'Verification',
      targetId: verification.verificationId
    },
    badge: 'blue',
    details: new Map([
      ['notes', notes],
      ['certificateHash', certificateHash]
    ])
  });

  res.status(201).json({
    success: true,
    verification: {
      verificationId: verification.verificationId,
      badge: verification.badge,
      isManual: true
    }
  });
});

/**
 * Get all verifications with pagination
 */
const getVerifications = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, badge, startDate, endDate } = req.query;

  const query = {};

  // Apply filters
  if (badge) query.badge = badge;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  // Role-based filtering
  if (req.user.role === 'verifier') {
    query['verifier.userId'] = req.user._id;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Verification.countDocuments(query);

  const verifications = await Verification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('verifier.userId', 'username fullName')
    .lean();

  res.json({
    success: true,
    verifications,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    }
  });
});

/**
 * Get verification by ID
 */
const getVerificationById = asyncHandler(async (req, res) => {
  const verification = await Verification.findOne({ 
    verificationId: req.params.id 
  })
    .populate('verifier.userId', 'username fullName organization')
    .populate('certificate.dbReference')
    .lean();

  if (!verification) {
    return res.status(404).json({
      success: false,
      message: 'Verification not found'
    });
  }

  res.json({
    success: true,
    verification
  });
});

/**
 * Get verifications for a specific certificate
 */
const getVerificationsByCertificate = asyncHandler(async (req, res) => {
  const { certificateId } = req.params;

  const verifications = await Verification.find({
    'certificate.certificateId': certificateId
  })
    .sort({ createdAt: -1 })
    .populate('verifier.userId', 'username fullName organization')
    .lean();

  res.json({
    success: true,
    verifications
  });
});

/**
 * Get verification statistics
 */
const getVerificationStats = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const stats = await Verification.getStats(filters);

  res.json({
    success: true,
    stats
  });
});

module.exports = {
  verifyCertificate,
  manualVerification,
  getVerifications,
  getVerificationById,
  getVerificationsByCertificate,
  getVerificationStats
};
