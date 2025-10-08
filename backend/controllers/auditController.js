// backend/controllers/auditController.js
const AuditLog = require('../models/AuditLog');
const Certificate = require('../models/Certificate');
const Verification = require('../models/Verification');
const { asyncHandler } = require('../middleware/errorHandler');

/**
 * GET /api/audit? page/filters
 */
const getAuditLogs = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 20,
    action,
    userId,
    startDate,
    endDate
  } = req.query;

  const query = {};

  if (action) query.action = action;
  if (userId) query['actor.userId'] = userId;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const total = await AuditLog.countDocuments(query);

  const logs = await AuditLog.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit))
    .populate('actor.userId', 'username fullName')
    .lean();

  res.json({
    success: true,
    logs: logs.map(log => ({
      _id: log._id,
      action: log.action,
      actor: {
        userId: log.actor.userId?._id || log.actor.userId,
        username: log.actor.username || log.actor.userId?.username,
        role: log.actor.role
      },
      target: log.target,
      blockchain: log.blockchain,
      badge: log.badge,
      timestamp: log.createdAt,
      details: log.details
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
 * GET /api/audit/export
 * supports ?format=csv|json
 */
const exportAuditLogs = asyncHandler(async (req, res) => {
  const { format = 'json', startDate, endDate } = req.query;

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;

  const exportData = await AuditLog.exportLogs(filters, format);

  if (format === 'csv') {
    const { headers, rows } = exportData;
    let csv = headers.join(',') + '\n';
    rows.forEach(row => {
      csv += row.map(cell => `"${String(cell || '')}"`).join(',') + '\n';
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.csv"`);
    res.send(csv);
    return;
  }

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="audit-logs-${Date.now()}.json"`);
  res.json({
    success: true,
    logs: exportData
  });
});

/**
 * GET /api/audit/stats
 */
const getAuditStats = asyncHandler(async (req, res) => {
  // Certificates stats
  const certificateStats = await Certificate.aggregate([
    {
      $group: {
        _id: null,
        totalCertificates: { $sum: 1 },
        byBadge: { $push: '$badge' },
        byStatus: { $push: '$status' }
      }
    }
  ]);

  const certStats = certificateStats[0] || { totalCertificates: 0, byBadge: [], byStatus: [] };

  const certificatesByBadge = certStats.byBadge.reduce((acc, badge) => {
    if (!badge) return acc;
    acc[badge] = (acc[badge] || 0) + 1;
    return acc;
  }, {});

  const certificatesByStatus = certStats.byStatus.reduce((acc, status) => {
    if (!status) return acc;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  // Verifications
  const verificationStats = await Verification.aggregate([
    {
      $group: {
        _id: null,
        totalVerifications: { $sum: 1 },
        validVerifications: { $sum: { $cond: ['$isValid', 1, 0] } }
      }
    }
  ]);

  const verStats = verificationStats[0] || { totalVerifications: 0, validVerifications: 0 };

  // Recent activity
  const recentActivity = await AuditLog.find()
    .sort({ createdAt: -1 })
    .limit(10)
    .populate('actor.userId', 'username fullName')
    .lean();

  // activitySummary may be optional
  let activitySummary = [];
  if (typeof AuditLog.getActivitySummary === 'function') {
    try {
      activitySummary = await AuditLog.getActivitySummary({}, 30);
    } catch (e) {
      activitySummary = [];
    }
  }

  res.json({
    success: true,
    stats: {
      totalCertificates: certStats.totalCertificates,
      totalVerifications: verStats.totalVerifications,
      certificatesByBadge,
      certificatesByStatus,
      recentActivity: recentActivity.map(log => ({
        action: log.action,
        actor: log.actor?.username || (log.actor?.userId?.username ?? 'System'),
        timestamp: log.createdAt,
        badge: log.badge
      })),
      activitySummary
    }
  });
});

/**
 * GET /api/audit/summary
 */
const getActivitySummary = asyncHandler(async (req, res) => {
  const { startDate, endDate, userId, action } = req.query;

  const filters = {};
  if (startDate) filters.startDate = startDate;
  if (endDate) filters.endDate = endDate;
  if (userId) filters.userId = userId;
  if (action) filters.action = action;

  const summary = typeof AuditLog.getActivitySummary === 'function'
    ? await AuditLog.getActivitySummary(filters)
    : [];

  res.json({
    success: true,
    summary
  });
});

/**
 * GET /api/audit/user/:userId
 */
const getUserActivity = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const { limit = 50 } = req.query;

  const logs = await AuditLog.find({ 'actor.userId': userId })
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .lean();

  res.json({
    success: true,
    logs: logs.map(log => ({
      _id: log._id,
      action: log.action,
      actor: log.actor,
      target: log.target,
      timestamp: log.createdAt,
      details: log.details
    }))
  });
});

module.exports = {
  getAuditLogs,
  exportAuditLogs,
  getAuditStats,
  getActivitySummary,
  getUserActivity
};
