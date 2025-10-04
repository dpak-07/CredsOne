/**
 * Authentication Middleware
 * JWT token verification and user authentication
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { AppError } = require('./errorHandler');
const AuditLog = require('../models/AuditLog');

/**
 * Protect routes - verify JWT token
 */
const protect = async (req, res, next) => {
  try {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('Not authorized to access this route', 401));
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      const user = await User.findById(decoded.userId).select('-password');

      if (!user) {
        return next(new AppError('User not found', 404));
      }

      if (!user.isActive) {
        return next(new AppError('User account is deactivated', 403));
      }

      // Attach user to request
      req.user = user;
      req.userId = user._id;
      req.userRole = user.role;

      next();
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return next(new AppError('Token has expired', 401));
      }
      if (error.name === 'JsonWebTokenError') {
        return next(new AppError('Invalid token', 401));
      }
      throw error;
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Optional authentication - doesn't fail if no token
 */
const optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.userId).select('-password');

        if (user && user.isActive) {
          req.user = user;
          req.userId = user._id;
          req.userRole = user.role;
        }
      } catch (error) {
        // Silently fail for optional auth
        console.log('Optional auth failed:', error.message);
      }
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Verify 2FA code (mock implementation)
 */
const verify2FA = async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return next(new AppError('2FA code is required', 400));
    }

    // Mock 2FA verification
    const mockOTP = process.env.TWO_FA_MOCK_OTP || '1234';

    if (code !== mockOTP) {
      // Log failed attempt
      await AuditLog.createLog({
        action: 'user_login',
        actor: {
          userId: req.user._id,
          username: req.user.username,
          role: req.user.role,
          ipAddress: req.ip,
          userAgent: req.get('user-agent')
        },
        status: 'failure',
        errorMessage: 'Invalid 2FA code'
      });

      return next(new AppError('Invalid 2FA code', 401));
    }

    next();
  } catch (error) {
    next(error);
  }
};

/**
 * Check if user owns the resource
 */
const checkOwnership = (resourceField = 'userId') => {
  return async (req, res, next) => {
    try {
      const resourceUserId = req.params[resourceField] || req.body[resourceField];

      if (!resourceUserId) {
        return next(new AppError('Resource user ID not provided', 400));
      }

      // Admins can access any resource
      if (req.userRole === 'admin') {
        return next();
      }

      // Check if user owns the resource
      if (req.userId.toString() !== resourceUserId.toString()) {
        return next(new AppError('Not authorized to access this resource', 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};

/**
 * Rate limit sensitive operations per user
 */
const sensitiveOperation = async (req, res, next) => {
  try {
    // This is a placeholder for more sophisticated rate limiting
    // You can implement Redis-based rate limiting here
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  protect,
  optionalAuth,
  verify2FA,
  checkOwnership,
  sensitiveOperation
};
