/**
 * Authentication Routes
 */

const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verify2FA,
  getMe,
  logout,
  updateProfile,
  forgotPassword
} = require('../controllers/authController');
const { protect, verify2FA: verify2FAMiddleware } = require('../middleware/auth');
const {
  validateRegistration,
  validateLogin
} = require('../utils/validators');

// Public routes
router.post('/register', validateRegistration, register);
router.post('/login', validateLogin, login);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.post('/verify-2fa', protect, verify2FA);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-profile', protect, updateProfile);

module.exports = router;
