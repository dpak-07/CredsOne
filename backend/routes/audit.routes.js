/**
 * Audit Routes
 */

const express = require('express');
const router = express.Router();
const {
  getAuditLogs,
  exportAuditLogs,
  getAuditStats,
  getActivitySummary,
  getUserActivity
} = require('../controllers/auditController');
const { protect } = require('../middleware/auth');
const { canViewAuditLogs, authorize } = require('../middleware/rbac');
const { validatePagination } = require('../utils/validators');

// All audit routes are protected
router.get('/', protect, canViewAuditLogs, validatePagination, getAuditLogs);
router.get('/export', protect, canViewAuditLogs, exportAuditLogs);
router.get('/stats', protect, canViewAuditLogs, getAuditStats);
router.get('/activity-summary', protect, canViewAuditLogs, getActivitySummary);
router.get('/user/:userId', protect, authorize('admin', 'issuer'), getUserActivity);

module.exports = router;
