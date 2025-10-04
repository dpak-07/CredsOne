/**
 * DigiLocker Routes
 */

const express = require('express');
const router = express.Router();
const {
  exportToDigiLocker,
  importFromDigiLocker,
  listDigiLockerDocuments,
  deleteDigiLockerDocument,
  getDigiLockerDocument
} = require('../controllers/digilockerController');
const { protect } = require('../middleware/auth');

// All DigiLocker routes are protected
router.post('/export/:certificateId', protect, exportToDigiLocker);
router.post('/import/:documentId', protect, importFromDigiLocker);
router.get('/documents', protect, listDigiLockerDocuments);
router.get('/documents/:documentId', protect, getDigiLockerDocument);
router.delete('/documents/:documentId', protect, deleteDigiLockerDocument);

module.exports = router;
