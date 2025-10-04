/**
 * OCR Service (Mock Implementation for Demo)
 * In production, integrate with Tesseract.js or cloud OCR services
 */

/**
 * Extract text from uploaded certificate image/PDF
 * @param {String} filePath - Path to uploaded file
 * @returns {Object} - Extracted data
 */
const extractCertificateData = async (filePath) => {
  try {
    // Mock OCR extraction
    // In production, use Tesseract.js, AWS Textract, Google Cloud Vision, etc.
    
    console.log(`📄 Mock OCR processing file: ${filePath}`);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Return mock extracted data
    const mockData = {
      learnerName: 'John Doe',
      courseName: 'Full Stack Web Development',
      issueDate: new Date().toISOString().split('T')[0],
      issuerName: 'NCVET Training Institute',
      courseId: 'FS-WD-2024',
      completionDate: new Date().toISOString().split('T')[0],
      confidence: 0.85, // Confidence score (0-1)
      additionalInfo: {
        duration: '6 months',
        grade: 'A',
        certificateNumber: `CERT-${Date.now()}`
      }
    };
    
    console.log('✅ OCR extraction completed (mock data)');
    
    return {
      success: true,
      data: mockData,
      confidence: 0.85,
      isMock: true
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    return {
      success: false,
      error: 'Failed to extract certificate data',
      isMock: true
    };
  }
};

/**
 * Validate extracted data quality
 * @param {Object} ocrData - Extracted OCR data
 * @returns {Object} - Validation result
 */
const validateOCRData = (ocrData) => {
  const requiredFields = ['learnerName', 'courseName', 'issueDate'];
  const missingFields = [];
  
  for (const field of requiredFields) {
    if (!ocrData[field] || ocrData[field].trim() === '') {
      missingFields.push(field);
    }
  }
  
  const isValid = missingFields.length === 0;
  const confidence = ocrData.confidence || 0;
  
  return {
    isValid,
    confidence,
    missingFields,
    message: isValid 
      ? 'OCR data is valid' 
      : `Missing required fields: ${missingFields.join(', ')}`
  };
};

/**
 * Extract text from PDF
 * @param {String} pdfPath - Path to PDF file
 * @returns {Object} - Extracted text
 */
const extractTextFromPDF = async (pdfPath) => {
  try {
    // Mock PDF text extraction
    console.log(`📄 Mock PDF text extraction: ${pdfPath}`);
    
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
      success: true,
      text: 'CERTIFICATE OF COMPLETION\n\nThis is to certify that John Doe has successfully completed the course Full Stack Web Development...',
      pages: 1,
      isMock: true
    };
  } catch (error) {
    console.error('PDF extraction error:', error);
    return {
      success: false,
      error: 'Failed to extract text from PDF'
    };
  }
};

/**
 * Extract text from image
 * @param {String} imagePath - Path to image file
 * @returns {Object} - Extracted text
 */
const extractTextFromImage = async (imagePath) => {
  try {
    // Mock image text extraction
    console.log(`🖼️  Mock image text extraction: ${imagePath}`);
    
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
      success: true,
      text: 'Certificate of Completion\nLearner: John Doe\nCourse: Web Development\nDate: 2024',
      confidence: 0.82,
      isMock: true
    };
  } catch (error) {
    console.error('Image extraction error:', error);
    return {
      success: false,
      error: 'Failed to extract text from image'
    };
  }
};

/**
 * Clean and normalize extracted text
 * @param {String} text - Raw extracted text
 * @returns {String} - Cleaned text
 */
const cleanExtractedText = (text) => {
  if (!text) return '';
  
  return text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .replace(/\n+/g, '\n') // Replace multiple newlines with single newline
    .trim();
};

/**
 * Parse certificate fields from text
 * @param {String} text - Extracted text
 * @returns {Object} - Parsed fields
 */
const parseCertificateFields = (text) => {
  const fields = {};
  
  // Simple pattern matching (mock implementation)
  const nameMatch = text.match(/(?:learner|name|awarded to|this certifies that)[:\s]+([a-zA-Z\s]+)/i);
  const courseMatch = text.match(/(?:course|program|training)[:\s]+([a-zA-Z\s]+)/i);
  const dateMatch = text.match(/(?:date|issued on|dated)[:\s]+([\d\-\/]+)/i);
  
  if (nameMatch) fields.learnerName = nameMatch[1].trim();
  if (courseMatch) fields.courseName = courseMatch[1].trim();
  if (dateMatch) fields.issueDate = dateMatch[1].trim();
  
  return fields;
};

/**
 * Get OCR confidence level description
 * @param {Number} confidence - Confidence score (0-1)
 * @returns {String} - Confidence level description
 */
const getConfidenceLevel = (confidence) => {
  if (confidence >= 0.9) return 'Very High';
  if (confidence >= 0.75) return 'High';
  if (confidence >= 0.6) return 'Medium';
  if (confidence >= 0.4) return 'Low';
  return 'Very Low';
};

/**
 * Process certificate upload with OCR
 * @param {Object} file - Uploaded file object
 * @returns {Object} - Processing result
 */
const processCertificateUpload = async (file) => {
  try {
    const fileExtension = file.originalname.split('.').pop().toLowerCase();
    
    let result;
    
    if (['pdf'].includes(fileExtension)) {
      result = await extractTextFromPDF(file.path);
    } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
      result = await extractTextFromImage(file.path);
    } else {
      return {
        success: false,
        error: 'Unsupported file format'
      };
    }
    
    if (result.success) {
      const extractedData = await extractCertificateData(file.path);
      return extractedData;
    }
    
    return result;
  } catch (error) {
    console.error('Certificate upload processing error:', error);
    return {
      success: false,
      error: 'Failed to process certificate upload'
    };
  }
};

module.exports = {
  extractCertificateData,
  validateOCRData,
  extractTextFromPDF,
  extractTextFromImage,
  cleanExtractedText,
  parseCertificateFields,
  getConfidenceLevel,
  processCertificateUpload
};
