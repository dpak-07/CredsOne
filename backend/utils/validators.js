/**
 * Input Validators
 * Express-validator rules for all API endpoints
 */

const { body, query, param } = require('express-validator');

/**
 * User Registration Validation
 */
const validateRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .withMessage('Username must be between 3 and 30 characters')
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage('Username can only contain letters, numbers, and underscores'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
  
  body('fullName')
    .trim()
    .notEmpty()
    .withMessage('Full name is required'),
  
  body('role')
    .optional()
    .isIn(['admin', 'issuer', 'verifier', 'learner'])
    .withMessage('Invalid role')
];

/**
 * User Login Validation
 */
const validateLogin = [
  body('username')
    .trim()
    .notEmpty()
    .withMessage('Username or email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

/**
 * Certificate Issuance Validation
 */
const validateCertificateIssuance = [
  body('learner.name')
    .trim()
    .notEmpty()
    .withMessage('Learner name is required'),
  
  body('learner.email')
    .trim()
    .isEmail()
    .withMessage('Valid learner email is required'),
  
  body('course.name')
    .trim()
    .notEmpty()
    .withMessage('Course name is required'),
  
  body('course.completionDate')
    .isISO8601()
    .withMessage('Valid completion date is required')
];

/**
 * Batch Certificate Issuance Validation
 */
const validateBatchIssuance = [
  body('certificates')
    .isArray({ min: 1, max: 100 })
    .withMessage('Certificates must be an array with 1-100 items'),
  
  body('certificates.*.learner.name')
    .trim()
    .notEmpty()
    .withMessage('Each certificate must have learner name'),
  
  body('certificates.*.learner.email')
    .trim()
    .isEmail()
    .withMessage('Each certificate must have valid learner email'),
  
  body('certificates.*.course.name')
    .trim()
    .notEmpty()
    .withMessage('Each certificate must have course name')
];

/**
 * Certificate Verification Validation
 */
const validateVerification = [
  body('certificateId')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Certificate ID cannot be empty'),
  
  body('qrData')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('QR data cannot be empty'),
  
  body('certHash')
    .optional()
    .matches(/^0x[a-fA-F0-9]{64}$/)
    .withMessage('Invalid certificate hash format')
];

/**
 * Manual Verification Validation
 */
const validateManualVerification = [
  body('certificateId')
    .trim()
    .notEmpty()
    .withMessage('Certificate ID is required'),
  
  body('notes')
    .optional()
    .trim(),
  
  body('documents')
    .optional()
    .isArray()
    .withMessage('Documents must be an array')
];

/**
 * Certificate Revocation Validation
 */
const validateRevocation = [
  body('reason')
    .trim()
    .notEmpty()
    .withMessage('Revocation reason is required')
    .isLength({ min: 10, max: 500 })
    .withMessage('Reason must be between 10 and 500 characters')
];

/**
 * Legacy Migration Validation
 */
const validateLegacyMigration = [
  body('learner.name')
    .trim()
    .notEmpty()
    .withMessage('Learner name is required'),
  
  body('course.name')
    .trim()
    .notEmpty()
    .withMessage('Course name is required'),
  
  body('legacyData.source')
    .trim()
    .notEmpty()
    .withMessage('Legacy source is required')
];

/**
 * Pagination Validation
 */
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sort')
    .optional()
    .isIn(['createdAt', '-createdAt', 'updatedAt', '-updatedAt', 'name', '-name'])
    .withMessage('Invalid sort field')
];

/**
 * Certificate ID Validation
 */
const validateCertificateId = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Certificate ID is required')
];

/**
 * User ID Validation
 */
const validateUserId = [
  param('id')
    .isMongoId()
    .withMessage('Invalid user ID')
];

/**
 * Role Update Validation
 */
const validateRoleUpdate = [
  body('role')
    .isIn(['admin', 'issuer', 'verifier', 'learner'])
    .withMessage('Invalid role')
];

/**
 * Profile Update Validation
 */
const validateProfileUpdate = [
  body('fullName')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Full name cannot be empty'),
  
  body('email')
    .optional()
    .trim()
    .isEmail()
    .withMessage('Valid email is required'),
  
  body('organization.name')
    .optional()
    .trim()
];

/**
 * Date Range Validation
 */
const validateDateRange = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid start date'),
  
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('Invalid end date')
];

module.exports = {
  validateRegistration,
  validateLogin,
  validateCertificateIssuance,
  validateBatchIssuance,
  validateVerification,
  validateManualVerification,
  validateRevocation,
  validateLegacyMigration,
  validatePagination,
  validateCertificateId,
  validateUserId,
  validateRoleUpdate,
  validateProfileUpdate,
  validateDateRange
};
