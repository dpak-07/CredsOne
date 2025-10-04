/**
 * Role-Based Access Control (RBAC) Middleware
 * Authorization based on user roles and permissions
 */

const { AppError } = require('./errorHandler');

/**
 * Role hierarchy
 */
const ROLE_HIERARCHY = {
  admin: 4,
  issuer: 3,
  verifier: 2,
  learner: 1
};

/**
 * Check if user has required role
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    if (!roles.includes(req.userRole)) {
      return next(
        new AppError(
          `Role '${req.userRole}' is not authorized to access this route`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Check if user has minimum role level
 */
const minimumRole = (minRole) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const userRoleLevel = ROLE_HIERARCHY[req.userRole] || 0;
    const minRoleLevel = ROLE_HIERARCHY[minRole] || 0;

    if (userRoleLevel < minRoleLevel) {
      return next(
        new AppError(
          `Minimum role '${minRole}' required. Your role: '${req.userRole}'`,
          403
        )
      );
    }

    next();
  };
};

/**
 * Admin only access
 */
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.userRole !== 'admin') {
    return next(new AppError('Admin access required', 403));
  }

  next();
};

/**
 * Can issue certificates
 */
const canIssueCertificates = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!['admin', 'issuer'].includes(req.userRole)) {
    return next(
      new AppError('Only admins and issuers can issue certificates', 403)
    );
  }

  next();
};

/**
 * Can verify certificates
 */
const canVerifyCertificates = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!['admin', 'issuer', 'verifier'].includes(req.userRole)) {
    return next(
      new AppError('Only admins, issuers, and verifiers can verify certificates', 403)
    );
  }

  next();
};

/**
 * Can revoke certificates
 */
const canRevokeCertificates = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!['admin', 'issuer'].includes(req.userRole)) {
    return next(
      new AppError('Only admins and issuers can revoke certificates', 403)
    );
  }

  next();
};

/**
 * Can view audit logs
 */
const canViewAuditLogs = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (!['admin', 'issuer'].includes(req.userRole)) {
    return next(
      new AppError('Only admins and issuers can view audit logs', 403)
    );
  }

  next();
};

/**
 * Can manage users
 */
const canManageUsers = (req, res, next) => {
  if (!req.user) {
    return next(new AppError('Authentication required', 401));
  }

  if (req.userRole !== 'admin') {
    return next(
      new AppError('Only admins can manage users', 403)
    );
  }

  next();
};

/**
 * Check specific permission
 */
const checkPermission = (permission) => {
  const PERMISSIONS = {
    'certificate:issue': ['admin', 'issuer'],
    'certificate:revoke': ['admin', 'issuer'],
    'certificate:verify': ['admin', 'issuer', 'verifier'],
    'certificate:view': ['admin', 'issuer', 'verifier', 'learner'],
    'user:manage': ['admin'],
    'user:view': ['admin', 'issuer'],
    'audit:view': ['admin', 'issuer'],
    'audit:export': ['admin'],
    'digilocker:access': ['admin', 'issuer', 'learner']
  };

  return (req, res, next) => {
    if (!req.user) {
      return next(new AppError('Authentication required', 401));
    }

    const allowedRoles = PERMISSIONS[permission];

    if (!allowedRoles) {
      return next(new AppError('Invalid permission', 500));
    }

    if (!allowedRoles.includes(req.userRole)) {
      return next(
        new AppError(`Permission '${permission}' denied for role '${req.userRole}'`, 403)
      );
    }

    next();
  };
};

/**
 * Check if user can access specific certificate
 */
const canAccessCertificate = async (req, res, next) => {
  try {
    const Certificate = require('../models/Certificate');
    const certificateId = req.params.id || req.params.certificateId;

    if (!certificateId) {
      return next(new AppError('Certificate ID is required', 400));
    }

    // Admins and issuers can access all certificates
    if (['admin', 'issuer', 'verifier'].includes(req.userRole)) {
      return next();
    }

    // Learners can only access their own certificates
    const certificate = await Certificate.findOne({
      $or: [
        { certificateId },
        { _id: certificateId }
      ]
    });

    if (!certificate) {
      return next(new AppError('Certificate not found', 404));
    }

    if (certificate.learner.userId?.toString() !== req.userId.toString()) {
      return next(
        new AppError('You can only access your own certificates', 403)
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  authorize,
  minimumRole,
  isAdmin,
  canIssueCertificates,
  canVerifyCertificates,
  canRevokeCertificates,
  canViewAuditLogs,
  canManageUsers,
  checkPermission,
  canAccessCertificate
};
