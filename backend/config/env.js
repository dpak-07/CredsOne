/**
 * Environment Configuration Validator
 * Validates and exports environment variables with proper types
 */

const path = require('path');
const fs = require('fs');

// Load .env file
require('dotenv').config();

/**
 * Validate required environment variables
 */
const validateEnv = () => {
  const required = [
    'NODE_ENV',
    'PORT',
    'MONGODB_URI',
    'JWT_SECRET'
  ];

  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n💡 Please create a .env file based on .env.example');
    process.exit(1);
  }

  // Warn about default values in production
  if (process.env.NODE_ENV === 'production') {
    const warnings = [];

    if (process.env.JWT_SECRET === 'your_super_secret_jwt_key_change_this_in_production') {
      warnings.push('JWT_SECRET is using default value');
    }

    if (process.env.BLOCKCHAIN_PRIVATE_KEY === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      warnings.push('BLOCKCHAIN_PRIVATE_KEY is using default value');
    }

    if (warnings.length > 0) {
      console.warn('⚠️  Production Security Warnings:');
      warnings.forEach(warning => console.warn(`   - ${warning}`));
      console.warn('');
    }
  }

  console.log('✅ Environment variables validated');
};

/**
 * Parse boolean environment variables
 */
const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null) return defaultValue;
  return value.toLowerCase() === 'true';
};

/**
 * Parse integer environment variables
 */
const parseInt = (value, defaultValue = 0) => {
  const parsed = Number.parseInt(value, 10);
  return isNaN(parsed) ? defaultValue : parsed;
};

/**
 * Environment configuration object
 */
const config = {
  // Application
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT, 5000),
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',

  // Database
  database: {
    uri: process.env.MONGODB_URI,
    name: process.env.MONGODB_URI?.split('/').pop()?.split('?')[0] || 'credsone'
  },

  // JWT
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || '7d'
  },

  // Blockchain
  blockchain: {
    rpcUrl: process.env.BLOCKCHAIN_RPC_URL,
    privateKey: process.env.BLOCKCHAIN_PRIVATE_KEY,
    contractAddress: process.env.CONTRACT_ADDRESS,
    mockMode: parseBoolean(process.env.MOCK_BLOCKCHAIN, true)
  },

  // File Upload
  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 5242880), // 5MB default
    uploadDir: path.join(__dirname, '..', 'uploads'),
    allowedTypes: ['pdf', 'png', 'jpg', 'jpeg']
  },

  // Rate Limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW, 15) * 60 * 1000,
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS, 100)
  },

  // Mock Services
  mock: {
    blockchain: parseBoolean(process.env.MOCK_BLOCKCHAIN, true),
    email: parseBoolean(process.env.MOCK_EMAIL, true),
    ocr: parseBoolean(process.env.MOCK_OCR, true),
    digilocker: parseBoolean(process.env.MOCK_DIGILOCKER, true)
  },

  // Email
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT, 587),
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASSWORD,
    from: process.env.EMAIL_FROM || 'noreply@credsone.com'
  },

  // 2FA
  twoFA: {
    enabled: parseBoolean(process.env.TWO_FA_ENABLED, false),
    mockOTP: process.env.TWO_FA_MOCK_OTP || '1234'
  },

  // DigiLocker
  digilocker: {
    clientId: process.env.DIGILOCKER_CLIENT_ID,
    clientSecret: process.env.DIGILOCKER_CLIENT_SECRET,
    redirectUri: process.env.DIGILOCKER_REDIRECT_URI || 'http://localhost:5000/api/digilocker/callback'
  },

  // CORS
  cors: {
    origin: process.env.NODE_ENV === 'production'
      ? process.env.FRONTEND_URL?.split(',') || []
      : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081']
  }
};

/**
 * Create uploads directory if it doesn't exist
 */
const ensureUploadDir = () => {
  if (!fs.existsSync(config.upload.uploadDir)) {
    fs.mkdirSync(config.upload.uploadDir, { recursive: true });
    console.log(`✅ Created upload directory: ${config.upload.uploadDir}`);
  }
};

/**
 * Display configuration summary
 */
const displayConfig = () => {
  console.log('\n📋 Configuration Summary:');
  console.log(`   Environment: ${config.env}`);
  console.log(`   Port: ${config.port}`);
  console.log(`   Database: ${config.database.name}`);
  console.log(`   Mock Mode: Blockchain=${config.mock.blockchain}, Email=${config.mock.email}, OCR=${config.mock.ocr}`);
  console.log('');
};

// Validate on load
if (require.main !== module) {
  validateEnv();
  ensureUploadDir();
  
  if (config.isDevelopment) {
    displayConfig();
  }
}

module.exports = config;
