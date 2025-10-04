/**
 * AuditLog Model
 * Comprehensive audit trail for all system actions
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

// Static method to create audit log
auditLogSchema.statics.createLog = async function(logData) {
  try {
    const log = new this(logData);
    await log.save();
    return log;
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw error to prevent audit logging from breaking the main flow
    return null;
  }
};

// Static method to get activity summary
auditLogSchema.statics.getActivitySummary = async function(userId, days = 30) {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const summary = await this.aggregate([
    {
      $match: {
        'actor.userId': mongoose.Types.ObjectId(userId),
        createdAt: { $gte: startDate }
      }
    },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
        lastActivity: { $max: '$createdAt' }
      }
    },
    {
      $sort: { count: -1 }
    }
  ]);

  return summary;
};

// Static method to export logs
auditLogSchema.statics.exportLogs = async function(filters = {}, format = 'json') {
  const logs = await this.find(filters)
    .populate('actor.userId', 'username email role')
    .sort({ createdAt: -1 })
    .lean();

  if (format === 'csv') {
    // Convert to CSV format
    const headers = ['Timestamp', 'Action', 'Actor', 'Status', 'Target', 'Details'];
    const rows = logs.map(log => [
      log.createdAt.toISOString(),
      log.action,
      log.actor.username || 'System',
      log.status,
      log.target?.identifier || '-',
      JSON.stringify(log.details || {})
    ]);

    return {
      headers,
      rows,
      data: [headers, ...rows]
    };
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
