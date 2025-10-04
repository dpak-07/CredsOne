/**
 * Certificate Routes
 */

const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const {
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
} = require('../controllers/certificateController');
const { protect } = require('../middleware/auth');
const {
  canIssueCertificates,
  canRevokeCertificates,
  authorize
} = require('../middleware/rbac');
const {
  validateCertificateIssuance,
  validateBatchIssuance,
  validateRevocation,
  validateLegacyMigration,
  validatePagination,
  validateCertificateId
} = require('../utils/validators');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.random().toString(36).substring(7);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|png|jpg|jpeg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only PDF and image files are allowed'));
  }
});

// Public routes
router.get('/:id', getCertificateById);
router.get('/:id/download', downloadCertificate);

// Protected routes
router.post('/issue', protect, canIssueCertificates, validateCertificateIssuance, issueCertificate);
router.post('/batch-issue', protect, canIssueCertificates, validateBatchIssuance, batchIssueCertificates);
router.get('/', protect, validatePagination, getCertificates);
router.get('/learner/:userId', protect, getCertificatesByLearner);
router.put('/:id/revoke', protect, canRevokeCertificates, validateRevocation, revokeCertificate);
router.post('/upload', protect, canIssueCertificates, upload.single('file'), uploadCertificate);
router.post('/migrate-legacy', protect, canIssueCertificates, validateLegacyMigration, migrateLegacyCertificate);
router.put('/legacy/:id/approve', protect, authorize('admin', 'issuer'), approveLegacyCertificate);

module.exports = router;
