/**
 * User Controller
 */

const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * Get all users with pagination
 */
const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, role, search, isActive } = req.query;

  const query = {};

  // Apply filters
  if (role) query.role = role;
  if (search) {
    query.$or = [
      { username: { $regex: search, $options: 'i' } },
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (isActive !== undefined) {
    query.isActive = isActive === 'true';
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .lean();

  res.json({
    success: true,
    users: users.map(user => ({
      id: user._id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      organization: user.organization,
      walletAddress: user.walletAddress,
      did: user.did,
      isActive: user.isActive,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin
    })),
    pagination: {
      total,
      page: parseInt(page),
      pages: Math.ceil(total / parseInt(limit)),
      limit: parseInt(limit)
    }
  });
});

/**
 * Get user by ID
 */
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

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
 * Update user
 */
const updateUser = asyncHandler(async (req, res) => {
  const { fullName, email, organization, walletAddress } = req.body;
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Store old values for audit
  const oldValues = {
    fullName: user.fullName,
    email: user.email,
    organization: user.organization,
    walletAddress: user.walletAddress
  };

  // Update fields
  if (fullName) user.fullName = fullName;
  if (email) user.email = email;
  if (organization !== undefined) user.organization = organization;
  if (walletAddress !== undefined) user.walletAddress = walletAddress;

  await user.save();

  // Create audit log
  await AuditLog.createLog({
    action: 'user_updated',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'User',
      targetId: user._id.toString(),
      name: user.fullName
    },
    changes: {
      before: new Map(Object.entries(oldValues)),
      after: new Map(Object.entries({
        fullName: user.fullName,
        email: user.email,
        organization: user.organization,
        walletAddress: user.walletAddress
      }))
    }
  });

  res.json({
    success: true,
    user: user.getPublicProfile()
  });
});

/**
 * Update user role
 */
const updateUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  const oldRole = user.role;
  user.role = role;
  await user.save();

  // Create audit log
  await AuditLog.createLog({
    action: 'role_changed',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'User',
      targetId: user._id.toString(),
      name: user.fullName
    },
    details: new Map([
      ['oldRole', oldRole],
      ['newRole', role]
    ])
  });

  res.json({
    success: true,
    user: user.getPublicProfile()
  });
});

/**
 * Toggle user active status
 */
const toggleUserStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Don't allow deactivating self
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot deactivate your own account'
    });
  }

  user.isActive = !user.isActive;
  await user.save();

  // Create audit log
  await AuditLog.createLog({
    action: user.isActive ? 'user_activated' : 'user_deactivated',
    actor: {
      userId: req.user._id,
      username: req.user.username,
      role: req.user.role
    },
    target: {
      type: 'User',
      targetId: user._id.toString(),
      name: user.fullName
    },
    details: new Map([
      ['isActive', user.isActive]
    ])
  });

  res.json({
    success: true,
    user: {
      id: user._id,
      username: user.username,
      isActive: user.isActive
    }
  });
});

/**
 * Delete user (soft delete - deactivate)
 */
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  // Don't allow deleting self
  if (user._id.toString() === req.user._id.toString()) {
    return res.status(400).json({
      success: false,
      message: 'Cannot delete your own account'
    });
  }

  // Soft delete - just deactivate
  user.isActive = false;
  await user.save();

  res.json({
    success: true,
    message: 'User deactivated successfully'
  });
});

/**
 * Get user statistics
 */
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await User.aggregate([
    {
      $group: {
        _id: null,
        totalUsers: { $sum: 1 },
        activeUsers: {
          $sum: { $cond: ['$isActive', 1, 0] }
        },
        byRole: {
          $push: '$role'
        }
      }
    }
  ]);

  const result = stats[0] || {
    totalUsers: 0,
    activeUsers: 0,
    byRole: []
  };

  // Count users by role
  const usersByRole = result.byRole.reduce((acc, role) => {
    acc[role] = (acc[role] || 0) + 1;
    return acc;
  }, {});

  res.json({
    success: true,
    stats: {
      totalUsers: result.totalUsers,
      activeUsers: result.activeUsers,
      inactiveUsers: result.totalUsers - result.activeUsers,
      usersByRole
    }
  });
});

module.exports = {
  getUsers,
  getUserById,
  updateUser,
  updateUserRole,
  toggleUserStatus,
  deleteUser,
  getUserStats
};
