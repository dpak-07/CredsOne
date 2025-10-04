/**
 * JWT Utilities
 * Token generation and verification
 */

const jwt = require('jsonwebtoken');

/**
 * Generate JWT token
 */
const generateToken = (payload, expiresIn = process.env.JWT_EXPIRE || '7d') => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn
  });
};

/**
 * Verify JWT token
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token has expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
};

/**
 * Decode JWT token without verification
 */
const decodeToken = (token) => {
  return jwt.decode(token);
};

/**
 * Generate auth tokens (access + refresh)
 */
const generateAuthTokens = (userId, role) => {
  const accessToken = generateToken(
    { userId, role },
    process.env.JWT_EXPIRE || '7d'
  );

  const refreshToken = generateToken(
    { userId, type: 'refresh' },
    '30d'
  );

  return {
    accessToken,
    refreshToken
  };
};

/**
 * Extract token from authorization header
 */
const extractToken = (authHeader) => {
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.substring(7);
};

/**
 * Check if token is expired
 */
const isTokenExpired = (token) => {
  try {
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.exp) {
      return true;
    }
    return decoded.exp < Date.now() / 1000;
  } catch (error) {
    return true;
  }
};

module.exports = {
  generateToken,
  verifyToken,
  decodeToken,
  generateAuthTokens,
  extractToken,
  isTokenExpired
};
