/**
 * Verification Routes
 */

const express = require('express');
const router = express.Router();
const {
  verifyCertificate,
  manualVerification,
  getVerifications,
  getVerificationById,
  getVerificationsByCertificate,
  getVerificationStats
} = require('../controllers/verificationController');
const { protect, optionalAuth } = require('../middleware/auth');
const { canVerifyCertificates } = require('../middleware/rbac');
const {
  validateVerification,
  validateManualVerification,
  validatePagination
} = require('../utils/validators');

// Public routes
router.post('/verify', optionalAuth, validateVerification, verifyCertificate);
router.get('/certificate/:certificateId', getVerificationsByCertificate);

// Protected routes
router.post('/manual', protect, canVerifyCertificates, validateManualVerification, manualVerification);
router.get('/', protect, validatePagination, getVerifications);
router.get('/stats', protect, getVerificationStats);
router.get('/:id', protect, getVerificationById);

module.exports = router;
