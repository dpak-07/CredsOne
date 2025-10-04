/**
 * QR Code Service
 * Generate and manage QR codes for certificates
 */

const QRCode = require('qrcode');

/**
 * Generate QR code for certificate
 * @param {String} certificateId - Certificate ID
 * @param {Object} options - QR code options
 * @returns {String} - Base64 encoded QR code
 */
const generateCertificateQR = async (certificateId, options = {}) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;
    
    const qrOptions = {
      errorCorrectionLevel: options.errorLevel || 'H',
      type: 'image/png',
      quality: options.quality || 0.95,
      margin: options.margin || 2,
      width: options.width || 300,
      color: {
        dark: options.darkColor || '#000000',
        light: options.lightColor || '#FFFFFF'
      }
    };

    // Generate QR code as data URL (base64)
    const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, qrOptions);
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code');
  }
};

/**
 * Generate QR code with custom data
 * @param {Object} data - Data to encode in QR
 * @returns {String} - Base64 encoded QR code
 */
const generateQRFromData = async (data) => {
  try {
    const dataString = typeof data === 'string' ? data : JSON.stringify(data);
    
    const qrCodeDataURL = await QRCode.toDataURL(dataString, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      width: 300
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('QR code generation error:', error);
    throw new Error('Failed to generate QR code from data');
  }
};

/**
 * Generate QR code as buffer (for file storage)
 * @param {String} certificateId - Certificate ID
 * @returns {Buffer} - QR code image buffer
 */
const generateQRBuffer = async (certificateId) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;
    
    const buffer = await QRCode.toBuffer(verificationUrl, {
      errorCorrectionLevel: 'H',
      type: 'png',
      width: 300,
      margin: 2
    });
    
    return buffer;
  } catch (error) {
    console.error('QR buffer generation error:', error);
    throw new Error('Failed to generate QR code buffer');
  }
};

/**
 * Generate QR code with logo (branded QR)
 * @param {String} certificateId - Certificate ID
 * @param {String} logoPath - Path to logo image
 * @returns {String} - Base64 encoded QR code with logo
 */
const generateBrandedQR = async (certificateId, logoPath = null) => {
  try {
    // For now, generate standard QR
    // In production, you would overlay a logo using image processing libraries
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;
    
    const qrCodeDataURL = await QRCode.toDataURL(verificationUrl, {
      errorCorrectionLevel: 'H', // High error correction allows for logo overlay
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      width: 400
    });
    
    // TODO: Add logo overlay using sharp or jimp
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Branded QR generation error:', error);
    throw new Error('Failed to generate branded QR code');
  }
};

/**
 * Validate QR code data
 * @param {String} qrData - Decoded QR data
 * @returns {Object} - Validation result
 */
const validateQRData = (qrData) => {
  try {
    // Check if it's a URL
    if (qrData.startsWith('http')) {
      const url = new URL(qrData);
      const pathParts = url.pathname.split('/');
      const certificateId = pathParts[pathParts.length - 1];
      
      return {
        isValid: true,
        type: 'url',
        certificateId,
        data: qrData
      };
    }

    // Check if it's JSON
    try {
      const parsed = JSON.parse(qrData);
      return {
        isValid: true,
        type: 'json',
        data: parsed
      };
    } catch {
      // Not JSON, treat as plain text
      return {
        isValid: true,
        type: 'text',
        data: qrData
      };
    }
  } catch (error) {
    return {
      isValid: false,
      error: 'Invalid QR data format'
    };
  }
};

/**
 * Generate QR code with verification info
 * @param {Object} certificate - Certificate data
 * @returns {String} - Base64 encoded QR code
 */
const generateVerificationQR = async (certificate) => {
  try {
    const verificationData = {
      certificateId: certificate.certificateId,
      learnerName: certificate.learner.name,
      courseName: certificate.course.name,
      issueDate: certificate.issueDate,
      verifyUrl: `${process.env.FRONTEND_URL}/verify/${certificate.certificateId}`
    };

    const qrCodeDataURL = await QRCode.toDataURL(JSON.stringify(verificationData), {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      quality: 0.95,
      margin: 2,
      width: 300
    });
    
    return qrCodeDataURL;
  } catch (error) {
    console.error('Verification QR generation error:', error);
    throw new Error('Failed to generate verification QR code');
  }
};

/**
 * Generate SVG QR code
 * @param {String} certificateId - Certificate ID
 * @returns {String} - SVG string
 */
const generateQRSVG = async (certificateId) => {
  try {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${certificateId}`;
    
    const svg = await QRCode.toString(verificationUrl, {
      type: 'svg',
      errorCorrectionLevel: 'H',
      margin: 2,
      width: 300
    });
    
    return svg;
  } catch (error) {
    console.error('SVG QR generation error:', error);
    throw new Error('Failed to generate SVG QR code');
  }
};

module.exports = {
  generateCertificateQR,
  generateQRFromData,
  generateQRBuffer,
  generateBrandedQR,
  validateQRData,
  generateVerificationQR,
  generateQRSVG
};
