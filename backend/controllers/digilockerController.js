/**
 * DigiLocker Controller (Mock Implementation)
 */

const Certificate = require('../models/Certificate');
const AuditLog = require('../models/AuditLog');
const { asyncHandler } = require('../middleware/errorHandler');

// Mock DigiLocker storage (in-memory for demo)
const digilockerStorage = new Map();

/**
 * Export certificate to DigiLocker
 */
const exportToDigiLocker = asyncHandler(async (req, res) => {
  const { certificateId } = req.body;

  const certificate = await Certificate.findOne({ certificateId });

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Certificate not found'
    });
  }

  // Check if user is authorized
  if (req.user.role === 'learner' && 
      certificate.learner.userId && 
      certificate.learner.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to export this certificate'
    });
  }

  // Generate mock DigiLocker document ID
  const digilockerDocId = `DL-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;

  // Store in mock DigiLocker storage
  const digilockerDoc = {
    digilockerDocId,
    certificateId: certificate.certificateId,
    userId: req.user._id,
    username: req.user.username,
    documentType: 'educational_certificate',
    issuer: certificate.issuer.name,
    learner: certificate.learner.name,
    course: certificate.course.name,
    issueDate: certificate.issueDate,
    exportedAt: new Date(),
    metadata: {
      badge: certificate.badge,
      status: certificate.status,
      blockchain: certificate.blockchain
    }
  };

  digilockerStorage.set(digilockerDocId, digilockerDoc);

  // Create audit log
  await AuditLog.createLog({
    action: 'digilocker_export',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'DigiLocker',
      targetId: digilockerDocId,
      name: certificate.course.name
    },
    badge: certificate.badge,
    details: new Map([
      ['certificateId', certificateId],
      ['digilockerDocId', digilockerDocId]
    ])
  });

  res.json({
    success: true,
    digilockerDocId,
    exportedAt: digilockerDoc.exportedAt
  });
});

/**
 * Import certificate from DigiLocker
 */
const importFromDigiLocker = asyncHandler(async (req, res) => {
  const { digilockerDocId } = req.body;

  // Retrieve from mock DigiLocker storage
  const digilockerDoc = digilockerStorage.get(digilockerDocId);

  if (!digilockerDoc) {
    return res.status(404).json({
      success: false,
      message: 'DigiLocker document not found'
    });
  }

  // Check if user is authorized
  if (digilockerDoc.userId.toString() !== req.user._id.toString() && 
      req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to import this document'
    });
  }

  // Get the actual certificate
  const certificate = await Certificate.findOne({ 
    certificateId: digilockerDoc.certificateId 
  });

  if (!certificate) {
    return res.status(404).json({
      success: false,
      message: 'Original certificate not found in database'
    });
  }

  // Create audit log
  await AuditLog.createLog({
    action: 'digilocker_import',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'DigiLocker',
      targetId: digilockerDocId
    },
    badge: certificate.badge,
    details: new Map([
      ['certificateId', certificate.certificateId],
      ['digilockerDocId', digilockerDocId]
    ])
  });

  res.json({
    success: true,
    certificate: certificate.getPublicData()
  });
});

/**
 * List user's DigiLocker documents
 */
const listDigiLockerDocuments = asyncHandler(async (req, res) => {
  // Get all documents for the user from mock storage
  const userDocuments = [];

  for (const [docId, doc] of digilockerStorage.entries()) {
    if (doc.userId.toString() === req.user._id.toString() || req.user.role === 'admin') {
      userDocuments.push({
        digilockerDocId: doc.digilockerDocId,
        certificateId: doc.certificateId,
        documentType: doc.documentType,
        issuer: doc.issuer,
        learner: doc.learner,
        course: doc.course,
        exportedAt: doc.exportedAt,
        badge: doc.metadata.badge,
        status: doc.metadata.status
      });
    }
  }

  // Sort by export date (newest first)
  userDocuments.sort((a, b) => b.exportedAt - a.exportedAt);

  res.json({
    success: true,
    documents: userDocuments,
    total: userDocuments.length
  });
});

/**
 * Delete DigiLocker document
 */
const deleteDigiLockerDocument = asyncHandler(async (req, res) => {
  const { digilockerDocId } = req.params;

  const doc = digilockerStorage.get(digilockerDocId);

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: 'DigiLocker document not found'
    });
  }

  // Check authorization
  if (doc.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this document'
    });
  }

  digilockerStorage.delete(digilockerDocId);

  res.json({
    success: true,
    message: 'DigiLocker document deleted successfully'
  });
});

/**
 * Get DigiLocker document details
 */
const getDigiLockerDocument = asyncHandler(async (req, res) => {
  const { digilockerDocId } = req.params;

  const doc = digilockerStorage.get(digilockerDocId);

  if (!doc) {
    return res.status(404).json({
      success: false,
      message: 'DigiLocker document not found'
    });
  }

  // Check authorization
  if (doc.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to view this document'
    });
  }

  res.json({
    success: true,
    document: doc
  });
});

module.exports = {
  exportToDigiLocker,
  importFromDigiLocker,
  listDigiLockerDocuments,
  deleteDigiLockerDocument,
  getDigiLockerDocument
};
