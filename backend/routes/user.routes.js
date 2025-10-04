/**
 * User Routes
 */

const express = require('express');
const router = express.Router();
const {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const { canManageUsers, authorize } = require('../middleware/rbac');
const { validatePagination } = require('../utils/validators');

// All user management routes are protected and require admin access
router.get('/', protect, canManageUsers, validatePagination, getUsers);
router.get('/stats', protect, canManageUsers, getUserStats);
router.get('/:id', protect, authorize('admin', 'issuer'), getUserById);
router.put('/:id', protect, canManageUsers, updateUser);
router.put('/:id/role', protect, authorize('admin'), updateUserRole);
router.put('/:id/status', protect, canManageUsers, toggleUserStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
