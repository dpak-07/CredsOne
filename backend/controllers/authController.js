/**
 * Authentication Controller
 */

const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { generateToken } = require('../utils/jwtUtils');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user
 * @access  Public
 */
const register = asyncHandler(async (req, res) => {
  const { username, email, password, fullName, role, organization } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: existingUser.username === username 
        ? 'Username already exists' 
        : 'Email already registered'
    });
  }

  // Create user
  const user = await User.create({
    username,
    email,
    password,
    fullName,
    role: role || 'learner',
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

  res.status(201).json({
    success: true,
    token,
    user: user.getPublicProfile()
  });
});

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  // Find user with password
  const user = await User.findByCredentials(username, password);

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

  // Mock 2FA verification - accept "1234" as valid
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
  // Create audit log
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

  // Update fields
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (organization) user.organization = organization;
  if (walletAddress) user.walletAddress = walletAddress;

  await user.save();

  res.json({
    success: true,
    user: user.getPublicProfile()
  });
});

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Send password reset email
 * @access  Public
 */
const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

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
