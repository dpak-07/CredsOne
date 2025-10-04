/**
 * Hash Utilities
 * Blockchain and cryptographic hashing functions
 */

const crypto = require('crypto');
const { ethers } = require('ethers');

/**
 * Generate certificate hash using keccak256 (Ethereum standard)
 */
const generateCertificateHash = (certificateData) => {
  const dataString = JSON.stringify({
    certificateId: certificateData.certificateId,
    learnerEmail: certificateData.learner.email,
    learnerName: certificateData.learner.name,
    courseName: certificateData.course.name,
    completionDate: certificateData.course.completionDate,
    issuerOrganization: certificateData.issuer.organization,
    timestamp: certificateData.timestamp || Date.now()
  });

  // Use ethers.js keccak256 for Ethereum compatibility
  return ethers.keccak256(ethers.toUtf8Bytes(dataString));
};

/**
 * Generate SHA256 hash
 */
const generateSHA256Hash = (data) => {
  return crypto
    .createHash('sha256')
    .update(typeof data === 'string' ? data : JSON.stringify(data))
    .digest('hex');
};

/**
 * Generate batch certificate hashes
 */
const generateBatchHashes = (certificates) => {
  return certificates.map(cert => generateCertificateHash(cert));
};

/**
 * Generate Merkle root from multiple hashes
 */
const generateMerkleRoot = (hashes) => {
  if (hashes.length === 0) {
    return ethers.ZeroHash;
  }

  if (hashes.length === 1) {
    return hashes[0];
  }

  let currentLevel = [...hashes];

  while (currentLevel.length > 1) {
    const nextLevel = [];

    for (let i = 0; i < currentLevel.length; i += 2) {
      if (i + 1 < currentLevel.length) {
        const combined = ethers.solidityPacked(
          ['bytes32', 'bytes32'],
          [currentLevel[i], currentLevel[i + 1]]
        );
        nextLevel.push(ethers.keccak256(combined));
      } else {
        nextLevel.push(currentLevel[i]);
      }
    }

    currentLevel = nextLevel;
  }

  return currentLevel[0];
};

/**
 * Convert string to bytes32 format
 */
const toBytes32 = (str) => {
  return ethers.encodeBytes32String(str);
};

/**
 * Convert bytes32 to string
 */
const fromBytes32 = (bytes32) => {
  return ethers.decodeBytes32String(bytes32);
};

/**
 * Verify certificate hash matches data
 */
const verifyCertificateHash = (certificateData, hash) => {
  const computedHash = generateCertificateHash(certificateData);
  return computedHash === hash;
};

/**
 * Generate random hash (for testing)
 */
const generateRandomHash = () => {
  return ethers.hexlify(ethers.randomBytes(32));
};

module.exports = {
  generateCertificateHash,
  generateSHA256Hash,
  generateBatchHashes,
  generateMerkleRoot,
  toBytes32,
  fromBytes32,
  verifyCertificateHash,
  generateRandomHash
};
