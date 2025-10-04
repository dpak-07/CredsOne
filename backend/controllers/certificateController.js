/**
 * Certificate Controller
 */

const Certificate = require('../models/Certificate');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generateCertificateHash, generateBatchHashes } = require('../utils/hashUtils');
const { issueCertificateOnChain, batchIssueCertificates } = require('../services/blockchainService');
const { generateCertificateQR } = require('../services/qrService');
const { extractCertificateData } = require('../services/ocrService');
const { asyncHandler } = require('../middleware/errorHandler');
const path = require('path');
const fs = require('fs').promises;

/**
 * Issue a new certificate
 */
const issueCertificate = asyncHandler(async (req, res) => {
  const {
    learnerName,
    learnerDID,
    learnerEmail,
    issuerDID,
    courseId,
    courseName,
    courseDescription,
    completionDate,
    metadata
  } = req.body;

  // Get issuer info
  const issuer = req.user;

  // Generate certificate hash
  const certData = {
    learnerName,
    learnerDID,
    courseId,
    courseName,
    completionDate,
    issuerDID: issuer.did
  };
  const certHash = generateCertificateHash(certData);

  // Issue on blockchain
  const blockchainResult = await issueCertificateOnChain(certHash);

  // Create certificate in database
  const certificate = await Certificate.create({
    learner: {
      name: learnerName,
      did: learnerDID,
      email: learnerEmail
    },
    issuer: {
      userId: issuer._id,
      name: issuer.fullName,
      did: issuer.did,
      organization: issuer.organization
    },
    course: {
      courseId,
      name: courseName,
      description: courseDescription
    },
    completionDate: new Date(completionDate),
    blockchain: {
      txHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      certHash,
      isOnChain: !blockchainResult.isMock
    },
    metadata: metadata || {},
    status: 'issued',
    badge: 'green'
  });

  // Generate QR code
  const qrCode = await generateCertificateQR(certificate.certificateId);
  certificate.qrCode = qrCode;
  await certificate.save();

  // Create audit log
  await AuditLog.createLog({
    action: 'certificate_issued',
    actor: {
      userId: issuer._id,
      username: issuer.username,
      role: issuer.role
    },
    target: {
      type: 'Certificate',
      targetId: certificate.certificateId,
      name: courseName
    },
    blockchain: {
      txHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber,
      certHash
    },
    badge: 'green',
    details: new Map([
      ['learnerName', learnerName],
      ['courseName', courseName]
    ])
  });

  res.status(201).json({
    success: true,
    certificate: {
      certificateId: certificate.certificateId,
      blockchain: {
        txHash: blockchainResult.txHash,
        certHash,
        blockNumber: blockchainResult.blockNumber
      },
      badge: certificate.badge,
      qrCode: certificate.qrCode,
      createdAt: certificate.createdAt
    },
    message: 'Certificate issued successfully'
  });
});

/**
 * Batch issue certificates
 */
const batchIssueCertificates = asyncHandler(async (req, res) => {
  const { certificates } = req.body;
  const issuer = req.user;

  if (!Array.isArray(certificates) || certificates.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Certificates array is required'
    });
  }

  // Generate hashes for all certificates
  const certHashes = certificates.map(cert => 
    generateCertificateHash({
      learnerName: cert.learnerName,
      learnerDID: cert.learnerDID,
      courseId: cert.courseId,
      courseName: cert.courseName,
      completionDate: cert.completionDate,
      issuerDID: issuer.did
    })
  );

  // Batch issue on blockchain
  const blockchainResult = await batchIssueCertificates(certHashes);

  // Create certificates in database
  const createdCertificates = [];
  
  for (let i = 0; i < certificates.length; i++) {
    const cert = certificates[i];
    const certHash = certHashes[i];

    const certificate = await Certificate.create({
      learner: {
        name: cert.learnerName,
        did: cert.learnerDID,
        email: cert.learnerEmail
      },
      issuer: {
        userId: issuer._id,
        name: issuer.fullName,
        did: issuer.did,
        organization: issuer.organization
      },
      course: {
        courseId: cert.courseId,
        name: cert.courseName,
        description: cert.courseDescription
      },
      completionDate: new Date(cert.completionDate),
      blockchain: {
        txHash: blockchainResult.txHash,
        blockNumber: blockchainResult.blockNumber,
        certHash,
        isOnChain: !blockchainResult.isMock
      },
      status: 'issued',
      badge: 'green'
    });

    // Generate QR code
    const qrCode = await generateCertificateQR(certificate.certificateId);
    certificate.qrCode = qrCode;
    await certificate.save();

    createdCertificates.push(certificate);
  }

  // Create audit log
  await AuditLog.createLog({
    action: 'batch_issue',
    actor: {
      userId: issuer._id,
      username: issuer.username,
      role: issuer.role
    },
    target: {
      type: 'Certificate',
      name: `Batch of ${certificates.length} certificates`
    },
    blockchain: {
      txHash: blockchainResult.txHash,
      blockNumber: blockchainResult.blockNumber
    },
    badge: 'green',
    details: new Map([
      ['count', certificates.length]
    ])
  });

  res.status(201).json({
    success: true,
    count: createdCertificates.length,
    txHash: blockchainResult.txHash,
    certificates: createdCertificates.map(c => ({
      certificateId: c.certificateId,
      learnerName: c.learner.name,
      courseName: c.course.name,
      badge: c.badge
    }))
  });
});

/**
 * Get all certificates with pagination and filters
 */
const getCertificates = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, status, badge, search } = req.query;

  const query = {};

  // Apply filters
  if (status) query.status = status;
  if (badge) query.badge = badge;
  if (search) {
    query.$or = [
      { 'learner.name': { $regex: search, $options: 'i' } },
      { 'course.name': { $regex: search, $options: 'i' } },
      { certificateId: { $regex: search, $options: 'i' } }
    ];
  }

  // Role-based filtering
  if (req.user.role === 'learner') {
    query['learner.userId'] = req.user._id;
  } else if (req.user.role === 'issuer') {
    query['issuer.userId'] = req.user._id;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await Certificate.countDocuments(query);

  const certificates = await Certificate.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('issuer.userId', 'username fullName')
    .lean();

  res.json({
    success: true,
    certificates,
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    }
  });
});

/**
 * Get certificate by ID
 */
const getCertificateById = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.id })
    .populate('issuer.userId', 'username fullName organization')
    .lean();

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found'
    });
  }

  res.json({
    success: true,
    certificate
  });
});

/**
 * Get certificates by learner
 */
const getCertificatesByLearner = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  // Check permission
  if (req.user.role === 'learner' && req.user._id.toString() !== userId) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view these certificates'
    });
  }

  const certificates = await Certificate.find({ 'learner.userId': userId })
    .sort({ createdAt: -1 })
    .populate('issuer.userId', 'username fullName organization')
    .lean();

  res.json({
    success: true,
    certificates
  });
});

/**
 * Revoke certificate
 */
const revokeCertificate = asyncHandler(async (req, res) => {
  const { reason } = req.body;
  const { id } = req.params;

  const certificate = await Certificate.findOne({ certificateId: id });

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found'
    });
  }

  if (certificate.status === 'revoked') {
    return res.status(400).json({
      success: false,
      message: 'Certificate is already revoked'
    });
  }

  // Revoke on blockchain
  const { revokeCertificateOnChain } = require('../services/blockchainService');
  const blockchainResult = await revokeCertificateOnChain(certificate.blockchain.certHash);

  // Update certificate
  certificate.status = 'revoked';
  certificate.badge = 'red';
  certificate.revocation = {
    isRevoked: true,
    revokedAt: new Date(),
    revokedBy: req.user._id,
    reason,
    txHash: blockchainResult.txHash
  };
  await certificate.save();

  // Create audit log
  await AuditLog.createLog({
    action: 'certificate_revoked',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'Certificate',
      targetId: certificate.certificateId,
      name: certificate.course.name
    },
    blockchain: {
      txHash: blockchainResult.txHash
    },
    badge: 'red',
    details: new Map([
      ['reason', reason]
    ])
  });

  res.json({
    success: true,
    certificate: certificate.getPublicData(),
    message: 'Certificate revoked successfully'
  });
});

/**
 * Upload certificate for OCR processing
 */
const uploadCertificate = asyncHandler(async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: 'No file uploaded'
    });
  }

  // Extract data using OCR
  const ocrResult = await extractCertificateData(req.file.path);

  const fileUrl = `/uploads/${req.file.filename}`;

  res.json({
    success: true,
    ocrData: ocrResult.data,
    fileUrl
  });
});

/**
 * Download certificate as Verifiable Credential
 */
const downloadCertificate = asyncHandler(async (req, res) => {
  const certificate = await Certificate.findOne({ certificateId: req.params.id });

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found'
    });
  }

  const vc = certificate.toVerifiableCredential();

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="${certificate.certificateId}.json"`);
  res.json(vc);
});

/**
 * Migrate legacy certificate
 */
const migrateLegacyCertificate = asyncHandler(async (req, res) => {
  const { learnerName, courseName, issueDate, pdfUrl, notes } = req.body;
  const issuer = req.user;

  const certificate = await Certificate.create({
    learner: {
      name: learnerName,
      did: `did:legacy:${learnerName.replace(/\s/g, '_').toLowerCase()}`
    },
    issuer: {
      userId: issuer._id,
      name: issuer.fullName,
      did: issuer.did,
      organization: issuer.organization
    },
    course: {
      courseId: `LEGACY-${Date.now()}`,
      name: courseName
    },
    completionDate: new Date(issueDate),
    issueDate: new Date(issueDate),
    blockchain: {
      certHash: generateCertificateHash({ learnerName, courseName, issueDate }),
      isOnChain: false
    },
    metadata: {
      pdfUrl
    },
    isLegacy: true,
    legacyData: {
      originalIssueDate: new Date(issueDate),
      migrationDate: new Date(),
      notes,
      approved: false
    },
    status: 'pending',
    badge: 'amber'
  });

  // Generate QR code
  const qrCode = await generateCertificateQR(certificate.certificateId);
  certificate.qrCode = qrCode;
  await certificate.save();

  // Create audit log
  await AuditLog.createLog({
    action: 'legacy_migration',
    actor: {
      userId: issuer._id,
      username: issuer.username,
      role: issuer.role
    },
    target: {
      type: 'Certificate',
      targetId: certificate.certificateId,
      name: courseName
    },
    badge: 'amber',
    details: new Map([
      ['learnerName', learnerName],
      ['originalIssueDate', issueDate]
    ])
  });

  res.status(201).json({
    success: true,
    certificate: {
      certificateId: certificate.certificateId,
      badge: certificate.badge,
      status: certificate.status
    }
  });
});

/**
 * Approve legacy certificate
 */
const approveLegacyCertificate = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const certificate = await Certificate.findOne({ certificateId: id });

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found'
    });
  }

  if (!certificate.isLegacy) {
    return res.status(400).json({
      success: false,
      message: 'This is not a legacy certificate'
    });
  }

  certificate.legacyData.approved = true;
  certificate.legacyData.approvedBy = req.user._id;
  certificate.legacyData.approvedAt = new Date();
  certificate.status = 'issued';
  await certificate.save();

  // Create audit log
  await AuditLog.createLog({
    action: 'legacy_approval',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'Certificate',
      targetId: certificate.certificateId
    },
    badge: 'amber'
  });

  res.json({
    success: true,
    certificate: {
      certificateId: certificate.certificateId,
      badge: certificate.badge,
      status: certificate.status
    }
  });
});

module.exports = {
  issueCertificate,
  batchIssueCertificates,
  getCertificates,
  getCertificateById,
  getCertificatesByLearner,
  revokeCertificate,
  uploadCertificate,
  downloadCertificate,
  migrateLegacyCertificate,
  approveLegacyCertificate
};
