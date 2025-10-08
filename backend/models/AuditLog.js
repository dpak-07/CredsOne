/**
 * backend/models/AuditLog.js
 *
 * AuditLog model with a tolerant createLog helper that coerces common legacy values
 * and ensures required fields exist before saving to avoid validation crashes.
 */

const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: [
      'user_register',
      'user_login',
      'user_logout',
      'user_update',
      'user_delete',
      'certificate_issue',
      'certificate_batch_issue',
      'certificate_revoke',
      'certificate_view',
      'certificate_download',
      'certificate_upload',
      'certificate_migrate',
      'verification_qr',
      'verification_blockchain',
      'verification_manual',
      'audit_view',
      'audit_export',
      'digilocker_export',
      'digilocker_import',
      'settings_update',
      'role_change',
      'system_error'
    ]
  },
  actor: {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    username: String,
    role: String,
    ipAddress: String,
    userAgent: String
  },
  target: {
    type: {
      type: String,
      enum: ['user', 'certificate', 'verification', 'audit', 'system']
    },
    id: mongoose.Schema.Types.ObjectId,
    identifier: String,
    name: String
  },
  blockchain: {
    txHash: String,
    certHash: String,
    network: String
  },
  badge: {
    type: String,
    enum: ['green', 'amber', 'blue', 'red']
  },
  status: {
    type: String,
    enum: ['success', 'failure', 'pending', 'warning'],
    required: true
  },
  details: {
    type: mongoose.Schema.Types.Mixed
  },
  changes: {
    before: mongoose.Schema.Types.Mixed,
    after: mongoose.Schema.Types.Mixed
  },
  errorMessage: String,
  metadata: {
    duration: Number,
    requestId: String,
    sessionId: String
  }
}, {
  timestamps: true
});

/**
 * Helper: safe coercions & sanitization
 */
const ACTION_MAP = {
  // common legacy -> canonical
  user_created: 'user_register',
  user_removed: 'user_delete',
  user_signed_in: 'user_login',
  user_signed_out: 'user_logout'
};

const TARGET_TYPE_MAP = {
  // legacy capitalization or synonyms -> canonical lowercase
  User: 'user',
  Certificate: 'certificate',
  Verification: 'verification',
  Audit: 'audit',
  System: 'system'
};

function toObjectIdIfPossible(val) {
  try {
    if (!val) return val;
    if (val instanceof mongoose.Types.ObjectId) return val;
    if (typeof val === 'string' && mongoose.Types.ObjectId.isValid(val)) {
      return mongoose.Types.ObjectId(val);
    }
  } catch (e) {
    // fallthrough
  }
  return val;
}

function sanitizeDetails(details, maxLen = 10000) {
  if (!details) return details;
  try {
    // If it's an object, stringify and trim if too big, otherwise store object.
    if (typeof details === 'object') {
      const str = JSON.stringify(details);
      if (str.length > maxLen) {
        return { __truncated__: true, preview: str.slice(0, 1000) };
      }
      return details;
    }
    if (typeof details === 'string') {
      if (details.length > maxLen) return details.slice(0, maxLen) + '...';
      return details;
    }
    return details;
  } catch (e) {
    return { __error_serializing_details__: true };
  }
}

/**
 * Static method to create audit log (tolerant)
 * - Coerces some legacy values
 * - Ensures required fields exist (status)
 * - Sanitizes details
 * - Never throws (returns null on failure)
 */
auditLogSchema.statics.createLog = async function (rawLogData = {}) {
  try {
    const logData = { ...rawLogData };

    // Coerce action if legacy
    if (logData.action && ACTION_MAP[logData.action]) {
      console.warn(`AuditLog: coercing legacy action '${logData.action}' -> '${ACTION_MAP[logData.action]}'`);
      logData.action = ACTION_MAP[logData.action];
    }

    // If action missing, attempt to infer or default to system_error (safer than throwing)
    if (!logData.action) {
      console.warn('AuditLog: missing action; defaulting to "system_error"');
      logData.action = 'system_error';
    }

    // Coerce target.type
    if (logData.target && logData.target.type && TARGET_TYPE_MAP[logData.target.type]) {
      logData.target = { ...logData.target, type: TARGET_TYPE_MAP[logData.target.type] };
      console.warn(`AuditLog: coercing legacy target.type '${rawLogData.target?.type}' -> '${logData.target.type}'`);
    }

    // Ensure target.type uses canonical values if present and valid otherwise leave it undefined
    if (logData.target && logData.target.type && !['user','certificate','verification','audit','system'].includes(logData.target.type)) {
      // remove invalid target.type to avoid enum validation error
      console.warn(`AuditLog: removing invalid target.type '${logData.target.type}'`);
      delete logData.target.type;
    }

    // Ensure status exists and is valid — if missing, default to 'success' (backward compat).
    // Choose a sane default; adjust to 'pending' if you prefer.
    const allowedStatuses = ['success', 'failure', 'pending', 'warning'];
    if (!logData.status || !allowedStatuses.includes(logData.status)) {
      // If caller had some indication of failure in errorMessage, set failure
      if (logData.errorMessage) {
        logData.status = 'failure';
      } else {
        logData.status = 'success';
      }
      console.warn(`AuditLog: defaulting missing/invalid status -> '${logData.status}'`);
    }

    // Normalize actor.userId to ObjectId if string present
    if (logData.actor && logData.actor.userId) {
      logData.actor.userId = toObjectIdIfPossible(logData.actor.userId);
    }

    // Normalize target.id
    if (logData.target && logData.target.id) {
      logData.target.id = toObjectIdIfPossible(logData.target.id);
    }

    // Sanitize details
    if (logData.details) {
      logData.details = sanitizeDetails(logData.details);
    }

    // Limit metadata sizes (optional)
    if (logData.metadata && typeof logData.metadata === 'object') {
      // clamp some keys if they are too big
      if (typeof logData.metadata.requestId === 'string' && logData.metadata.requestId.length > 200) {
        logData.metadata.requestId = logData.metadata.requestId.slice(0, 200);
      }
      if (typeof logData.metadata.sessionId === 'string' && logData.metadata.sessionId.length > 200) {
        logData.metadata.sessionId = logData.metadata.sessionId.slice(0, 200);
      }
    }

    // Build model and save
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    // Helpful log for debugging — do not rethrow
    console.error('Failed to create audit log:', error);
    return null;
  }
};

/**
 * Static method to get activity summary
 * Accepts either (userId, days) OR (filters) for backwards compatibility.
 */
auditLogSchema.statics.getActivitySummary = async function (arg1 = {}, arg2 = 30) {
  // If arg1 looks like an ObjectId or string, treat as userId
  let userId = null;
  let days = 30;
  let filters = {};

  if (typeof arg1 === 'string' || mongoose.Types.ObjectId.isValid(arg1)) {
    userId = arg1;
    days = arg2 || 30;
  } else if (typeof arg1 === 'object') {
    filters = arg1;
    days = arg2 || 30;
    if (filters.userId) userId = filters.userId;
  }

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days || 30));

  const match = { createdAt: { $gte: startDate } };
  if (userId) {
    match['actor.userId'] = mongoose.Types.ObjectId(userId);
  }
  // Merge any other allowed filters (action, date range, etc.)
  if (filters.action) match.action = filters.action;
  if (filters.startDate) match.createdAt = match.createdAt || {};
  if (filters.startDate) match.createdAt.$gte = new Date(filters.startDate);
  if (filters.endDate) match.createdAt = match.createdAt || {};
  if (filters.endDate) match.createdAt.$lte = new Date(filters.endDate);

  const summary = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastActivity: { $max: '$createdAt' }
      }
    },
    { $sort: { count: -1 } }
  ]);

  return summary;
};

/**
 * Static method to export logs (keeps previous behavior)
 */
auditLogSchema.statics.exportLogs = async function (filters = {}, format = 'json') {
  const logs = await this.find(filters)
    .populate('actor.userId', 'username email role')
    .sort({ createdAt: -1 })
    .lean();

  if (format === 'csv') {
    const headers = ['Timestamp', 'Action', 'Actor', 'Status', 'Target', 'Details'];
    const rows = logs.map(log => [
      log.createdAt ? new Date(log.createdAt).toISOString() : '',
      log.action,
      log.actor?.username || 'System',
      log.status,
      log.target?.identifier || '-',
      JSON.stringify(log.details || {})
    ]);
    return { headers, rows, data: [headers, ...rows] };
  }

  return logs;
};

// Indexes
auditLogSchema.index({ action: 1 });
auditLogSchema.index({ 'actor.userId': 1 });
auditLogSchema.index({ 'target.type': 1, 'target.id': 1 });
auditLogSchema.index({ status: 1 });
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ 'blockchain.txHash': 1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
