/**
 * Email Service (Mock Implementation for Demo)
 * In production, integrate with SendGrid, AWS SES, or Nodemailer with SMTP
 */

/**
 * Send certificate issued notification email
 * @param {Object} certificate - Certificate data
 * @param {String} recipientEmail - Recipient email address
 * @returns {Object} - Send result
 */
const sendCertificateIssuedEmail = async (certificate, recipientEmail) => {
  try {
    console.log(`📧 Sending certificate issued email to: ${recipientEmail}`);
    
    // Mock email sending
    // In production, use nodemailer or email service API
    
    const emailData = {
      to: recipientEmail,
      from: process.env.SMTP_USER || 'noreply@credsone.com',
      subject: `Certificate Issued: ${certificate.course.name}`,
      html: `
        <h2>Certificate Issued Successfully</h2>
        <p>Dear ${certificate.learner.name},</p>
        <p>Congratulations! Your certificate for <strong>${certificate.course.name}</strong> has been issued.</p>
        <p><strong>Certificate ID:</strong> ${certificate.certificateId}</p>
        <p><strong>Issue Date:</strong> ${new Date(certificate.issueDate).toLocaleDateString()}</p>
        <p>You can view and download your certificate at: ${process.env.FRONTEND_URL}/certificates/${certificate.certificateId}</p>
        <p>Best regards,<br>CredsOne Team</p>
      `
    };
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Certificate issued email sent (mock)');
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      isMock: true
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email'
    };
  }
};

/**
 * Send certificate verification notification
 * @param {Object} verification - Verification data
 * @param {String} recipientEmail - Recipient email address
 * @returns {Object} - Send result
 */
const sendVerificationNotification = async (verification, recipientEmail) => {
  try {
    console.log(`📧 Sending verification notification to: ${recipientEmail}`);
    
    const emailData = {
      to: recipientEmail,
      from: process.env.SMTP_USER || 'noreply@credsone.com',
      subject: 'Certificate Verification Notification',
      html: `
        <h2>Certificate Verification Alert</h2>
        <p>Your certificate has been verified.</p>
        <p><strong>Certificate ID:</strong> ${verification.certificate.certificateId}</p>
        <p><strong>Verification Date:</strong> ${new Date(verification.createdAt).toLocaleString()}</p>
        <p><strong>Verification Type:</strong> ${verification.verificationType}</p>
        <p><strong>Status:</strong> ${verification.isValid ? 'Valid' : 'Invalid'}</p>
      `
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Verification notification sent (mock)');
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      isMock: true
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email'
    };
  }
};

/**
 * Send welcome email to new user
 * @param {Object} user - User data
 * @returns {Object} - Send result
 */
const sendWelcomeEmail = async (user) => {
  try {
    console.log(`📧 Sending welcome email to: ${user.email}`);
    
    const emailData = {
      to: user.email,
      from: process.env.SMTP_USER || 'noreply@credsone.com',
      subject: 'Welcome to CredsOne',
      html: `
        <h2>Welcome to CredsOne!</h2>
        <p>Dear ${user.fullName},</p>
        <p>Thank you for registering with CredsOne. Your account has been created successfully.</p>
        <p><strong>Username:</strong> ${user.username}</p>
        <p><strong>Role:</strong> ${user.role}</p>
        <p>You can now login at: ${process.env.FRONTEND_URL}/login</p>
        <p>Best regards,<br>CredsOne Team</p>
      `
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Welcome email sent (mock)');
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      isMock: true
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email'
    };
  }
};

/**
 * Send password reset email
 * @param {Object} user - User data
 * @param {String} resetToken - Password reset token
 * @returns {Object} - Send result
 */
const sendPasswordResetEmail = async (user, resetToken) => {
  try {
    console.log(`📧 Sending password reset email to: ${user.email}`);
    
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    
    const emailData = {
      to: user.email,
      from: process.env.SMTP_USER || 'noreply@credsone.com',
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>Dear ${user.fullName},</p>
        <p>You requested a password reset for your CredsOne account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
      `
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ Password reset email sent (mock)');
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      isMock: true
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email'
    };
  }
};

/**
 * Send 2FA code email
 * @param {Object} user - User data
 * @param {String} code - 2FA code
 * @returns {Object} - Send result
 */
const send2FACodeEmail = async (user, code) => {
  try {
    console.log(`📧 Sending 2FA code to: ${user.email}`);
    
    const emailData = {
      to: user.email,
      from: process.env.SMTP_USER || 'noreply@credsone.com',
      subject: 'Your 2FA Code',
      html: `
        <h2>Two-Factor Authentication</h2>
        <p>Dear ${user.fullName},</p>
        <p>Your 2FA verification code is:</p>
        <h1 style="font-size: 32px; letter-spacing: 5px;">${code}</h1>
        <p>This code will expire in 10 minutes.</p>
      `
    };
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('✅ 2FA code email sent (mock)');
    
    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      isMock: true
    };
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      error: 'Failed to send email'
    };
  }
};

module.exports = {
  sendCertificateIssuedEmail,
  sendVerificationNotification,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  send2FACodeEmail
};
