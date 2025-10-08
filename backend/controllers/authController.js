/**
 * Authentication Controller
 * Drop-in replacement with input normalization, clear error handling,
 * duplicate-key handling, and dev-friendly debug logs.
 */

const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generateToken } = require('../utils/jwtUtils');
const { asyncHandler } = require('../middleware/errorHandler');

const normalizeString = (v) => (v ? String(v).trim() : '');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  // Normalize & sanitize inputs
  let { username, email, password, fullName, role, organization } = req.body || {};
  email = normalizeString(email).toLowerCase();
  username = normalizeString(username).toLowerCase() || (email ? email.split('@')[0] : '');
  fullName = normalizeString(fullName);
  role = normalizeString(role).toLowerCase() || 'learner';

  // Basic validation
  if (!email || !password || !fullName) {
    return res.status(400).json({
      success: false,
      message: 'email, password and fullName are required'
    });
  }

  // Check for existing user (normalized)
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    const collisionField = existingUser.username === username ? 'username' : 'email';
    return res.status(400).json({
      success: false,
      message: collisionField === 'username' ? 'Username already exists' : 'Email already registered',
      field: collisionField
    });
  }

  // Create user inside try/catch to capture duplicate-key & validation errors
  try {
    const user = await User.create({
      username,
      email,
      password,
      fullName,
      role,
      organization
    });

    // Generate JWT token
    const token = generateToken({ id: user._id, role: user.role });

    // Create audit log
    await AuditLog.createLog({
      action: 'user_created',
      actor: {
        userId: user._id,
        username: user.username,
        role: user.role
      },
      target: {
        type: 'User',
        targetId: user._id.toString(),
        name: user.fullName
      },
      details: new Map([
        ['email', email],
        ['role', user.role]
      ])
    });

    return res.status(201).json({
      success: true,
      token,
      user: user.getPublicProfile()
    });

  } catch (err) {
    // Duplicate key error (E11000)
    if (err.code === 11000) {
      const key = err.keyValue ? Object.keys(err.keyValue)[0] : 'unique field';
      return res.status(400).json({
        success: false,
        message: `${key} already exists`,
        field: key
      });
    }

    // Mongoose validation errors
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join('; ')
      });
    }

    console.error('REGISTER ERROR:', err);
    return res.status(500).json({
      success: false,
      message: 'Internal Server Error'
    });
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const rawIdentifier = req.body.username || req.body.email || '';
  const password = req.body.password;

  if (!rawIdentifier || !password) {
    return res.status(400).json({ success: false, message: 'username/email and password are required' });
  }

  // Find user with password (findByCredentials normalizes)
  let user;
  try {
    user = await User.findByCredentials(rawIdentifier, password);
  } catch (err) {
    // Avoid leaking whether username/email exists; return generic invalid credentials
    return res.status(401).json({ success: false, message: err.message || 'Invalid credentials' });
  }

  // Update last login
  user.lastLogin = new Date();
  await user.save();

  // Generate JWT token
  const token = generateToken({ id: user._id, role: user.role });

  // Create audit log
  await AuditLog.createLog({
    action: 'user_login',
    actor: {
      userId: user._id,
      username: user.username,
      role: user.role,
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    },
    target: {
      type: 'User',
      targetId: user._id.toString()
    }
  });

  res.json({
    success: true,
    token,
    user: user.getPublicProfile()
  });
});

/**
 * @route   POST /api/auth/verify-2fa
 * @desc    Verify 2FA OTP
 * @access  Private
 */
const verify2FA = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  // Mock 2FA verification - accept DEMO_OTP env or "1234" as valid
  if (otp === process.env.DEMO_OTP || otp === '1234') {
    return res.json({
      success: true,
      message: 'OTP verified successfully'
    });
  }

  res.status(400).json({
    success: false,
    message: 'Invalid OTP'
  });
});

/**
 * @route   GET /api/auth/me
 * @desc    Get current user
 * @access  Private
 */
const getMe = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }

  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.json({
    success: true,
    user: user.getPublicProfile()
  });
});

/**
 * @route   POST /api/auth/logout
 * @desc    Logout user
 * @access  Private
 */
const logout = asyncHandler(async (req, res) => {
  if (req.user) {
    await AuditLog.createLog({
      action: 'user_logout',
      actor: {
        userId: req.user._id,
        username: req.user.username,
        role: req.user.role
      },
      target: {
        type: 'User',
        targetId: req.user._id.toString()
      }
    });
  }

  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

/**
 * @route   PUT /api/auth/update-profile
 * @desc    Update user profile
 * @access  Private
 */
const updateProfile = asyncHandler(async (req, res) => {
  const { fullName, email, organization, walletAddress } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Update fields (normalize email if provided)
  if (fullName) user.fullName = String(fullName).trim();
  if (email) user.email = String(email).trim().toLowerCase();
  if (organization) user.organization = organization;
  if (walletAddress) user.walletAddress = walletAddress;

  try {
    await user.save();
    res.json({
      success: true,
      user: user.getPublicProfile()
    });
  } catch (err) {
    // handle duplicate email or validation errors
    if (err.code === 11000) {
      const key = err.keyValue ? Object.keys(err.keyValue)[0] : 'unique field';
      return res.status(400).json({ success: false, message: `${key} already exists` });
    }
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ success: false, message: messages.join('; ') });
    }
    console.error('UPDATE PROFILE ERROR:', err);
    return res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const email = normalizeString(req.body.email).toLowerCase();

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'No user found with that email'
    });
  }

  // In production, generate reset token and send email
  // For demo, just return success
  res.json({
    success: true,
    message: 'Password reset email sent (demo mode)'
  });
});

module.exports = {
  register,
  login,
  verify2FA,
  getMe,
  logout,
  updateProfile,
  forgotPassword
};
