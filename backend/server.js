/**
 * CredsOne Backend Server
 * Blockchain-based Credential Verification System
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

// Connect to Database
connectDB();

// Security Middleware
app.use(helmet());

// CORS Configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:8081'],
  credentials: true
}));

// Body Parser Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression Middleware
app.use(compression());

// Logging Middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Rate Limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW) * 60 * 1000 || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.'
});

app.use('/api/', limiter);
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Health Check Route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'CredsOne API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    mockMode: {
      blockchain: process.env.MOCK_BLOCKCHAIN === 'true',
      email: process.env.MOCK_EMAIL === 'true',
      ocr: process.env.MOCK_OCR === 'true',
      digilocker: process.env.MOCK_DIGILOCKER === 'true'
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/certificates', require('./routes/certificate.routes'));
app.use('/api/verifications', require('./routes/verification.routes'));
app.use('/api/audit', require('./routes/audit.routes'));
app.use('/api/digilocker', require('./routes/digilocker.routes'));
app.use('/api/users', require('./routes/user.routes'));

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);
// Debug Middleware (logs incoming requests)
app.use((req, res, next) => {
  console.log("===== 🛰️ Incoming Request =====");
  console.log("🔹 Time:", new Date().toISOString());
  console.log("🔹 Method:", req.method);
  console.log("🔹 URL:", req.originalUrl);
  console.log("🔹 Headers:", req.headers);
  console.log("🔹 Body:", req.body);
  console.log("🔹 Query:", req.query);
  console.log("🔹 Params:", req.params);
  console.log("================================");
  next();
});


// Start Server
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║               🎓 CredsOne Backend Server 🎓               ║
║                                                           ║
║  Server running on port ${PORT}                              ║
║  Environment: ${process.env.NODE_ENV || 'development'}                                  ║
║  Database: ${process.env.MONGODB_URI ? 'Connected' : 'Not configured'}                                  ║
║                                                           ║
║  Mock Mode:                                               ║
║    - Blockchain: ${process.env.MOCK_BLOCKCHAIN === 'true' ? '✓' : '✗'}                                   ║
║    - Email: ${process.env.MOCK_EMAIL === 'true' ? '✓' : '✗'}                                        ║
║    - OCR: ${process.env.MOCK_OCR === 'true' ? '✓' : '✗'}                                          ║
║    - DigiLocker: ${process.env.MOCK_DIGILOCKER === 'true' ? '✓' : '✗'}                                   ║
║                                                           ║
║  API Documentation: http://localhost:${PORT}/health       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

// Handle Unhandled Promise Rejections
process.on('unhandledRejection', (err) => {
  console.error('❌ Unhandled Promise Rejection:', err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle SIGTERM
process.on('SIGTERM', () => {
  console.log('👋 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('✅ Process terminated');
  });
});

module.exports = app;
