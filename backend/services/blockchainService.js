/**
 * Blockchain Service
 * Handles all blockchain interactions
 */

const { ethers } = require('ethers');
const { getContract, getWallet, getProvider, isBlockchainReady } = require('../config/blockchain');
const { toBytes32 } = require('../utils/hashUtils');

/**
 * Issue a certificate on blockchain
 * @param {String} certificateHash - Hash of the certificate
 * @returns {Object} - Transaction details
 */
const issueCertificateOnChain = async (certificateHash) => {
  try {
    // Check if blockchain is ready
    if (!isBlockchainReady()) {
      console.warn('⚠️  Blockchain not ready, using mock mode');
      return {
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
        gasUsed: '21000',
        network: 'Polygon Mumbai (Mock)',
        isMock: true
      };
    }

    const contract = getContract();
    const hash = toBytes32(certificateHash);

    // Estimate gas
    const gasEstimate = await contract.issueCertificate.estimateGas(hash);
    console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);

    // Send transaction
    const tx = await contract.issueCertificate(hash, {
      gasLimit: gasEstimate * BigInt(120) / BigInt(100) // 20% buffer
    });

    console.log(`📤 Transaction sent: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait(1);
    
    console.log(`✅ Certificate issued on blockchain: ${receipt.hash}`);

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      network: 'Polygon Mumbai',
      isMock: false
    };
  } catch (error) {
    console.error('❌ Blockchain issuance error:', error.message);
    
    // Return mock data if blockchain fails
    return {
      txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
      gasUsed: '21000',
      network: 'Polygon Mumbai (Mock - Error)',
      isMock: true,
      error: error.message
    };
  }
};

/**
 * Batch issue certificates on blockchain
 * @param {Array<String>} certificateHashes - Array of certificate hashes
 * @returns {Object} - Transaction details
 */
const batchIssueCertificates = async (certificateHashes) => {
  try {
    if (!isBlockchainReady()) {
      console.warn('⚠️  Blockchain not ready, using mock mode');
      return {
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
        count: certificateHashes.length,
        network: 'Polygon Mumbai (Mock)',
        isMock: true
      };
    }

    const contract = getContract();
    const hashes = certificateHashes.map(hash => toBytes32(hash));

    // Estimate gas
    const gasEstimate = await contract.batchIssueCertificates.estimateGas(hashes);
    console.log(`⛽ Estimated gas for batch: ${gasEstimate.toString()}`);

    // Send transaction
    const tx = await contract.batchIssueCertificates(hashes, {
      gasLimit: gasEstimate * BigInt(120) / BigInt(100)
    });

    console.log(`📤 Batch transaction sent: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait(1);
    
    console.log(`✅ Batch issued ${hashes.length} certificates: ${receipt.hash}`);

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      count: hashes.length,
      network: 'Polygon Mumbai',
      isMock: false
    };
  } catch (error) {
    console.error('❌ Batch issuance error:', error.message);
    
    return {
      txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
      count: certificateHashes.length,
      network: 'Polygon Mumbai (Mock - Error)',
      isMock: true,
      error: error.message
    };
  }
};

/**
 * Verify certificate on blockchain
 * @param {String} certificateHash - Hash of the certificate
 * @returns {Object} - Verification result
 */
const verifyCertificateOnChain = async (certificateHash) => {
  try {
    if (!isBlockchainReady()) {
      console.warn('⚠️  Blockchain not ready, using mock verification');
      return {
        exists: true,
        issuer: '0x' + '0'.repeat(40),
        issuedAt: Math.floor(Date.now() / 1000) - 86400 * 30,
        revoked: false,
        blockchainStatus: 'Valid on Polygon Mumbai (Mock)',
        isMock: true
      };
    }

    const contract = getContract();
    const hash = toBytes32(certificateHash);

    // Call verify function
    const result = await contract.verifyCertificate(hash);
    
    const [exists, issuer, issuedAt, revoked] = result;

    console.log(`🔍 Certificate verification:`, {
      exists,
      issuer,
      issuedAt: issuedAt.toString(),
      revoked
    });

    let status = 'Not found on blockchain';
    
    if (exists && !revoked) {
      status = 'Valid on Polygon Mumbai';
    } else if (exists && revoked) {
      status = 'Revoked on Polygon Mumbai';
    }

    return {
      exists,
      issuer,
      issuedAt: exists ? new Date(Number(issuedAt) * 1000) : null,
      revoked,
      blockchainStatus: status,
      isMock: false
    };
  } catch (error) {
    console.error('❌ Blockchain verification error:', error.message);
    
    // Return neutral result on error
    return {
      exists: false,
      issuer: null,
      issuedAt: null,
      revoked: false,
      blockchainStatus: 'Verification failed - blockchain unavailable',
      isMock: true,
      error: error.message
    };
  }
};

/**
 * Revoke certificate on blockchain
 * @param {String} certificateHash - Hash of the certificate
 * @returns {Object} - Transaction details
 */
const revokeCertificateOnChain = async (certificateHash) => {
  try {
    if (!isBlockchainReady()) {
      console.warn('⚠️  Blockchain not ready, using mock mode');
      return {
        txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
        blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
        network: 'Polygon Mumbai (Mock)',
        isMock: true
      };
    }

    const contract = getContract();
    const hash = toBytes32(certificateHash);

    // Estimate gas
    const gasEstimate = await contract.revokeCertificate.estimateGas(hash);

    // Send transaction
    const tx = await contract.revokeCertificate(hash, {
      gasLimit: gasEstimate * BigInt(120) / BigInt(100)
    });

    console.log(`📤 Revocation transaction sent: ${tx.hash}`);

    // Wait for confirmation
    const receipt = await tx.wait(1);
    
    console.log(`✅ Certificate revoked on blockchain: ${receipt.hash}`);

    return {
      txHash: receipt.hash,
      blockNumber: receipt.blockNumber,
      gasUsed: receipt.gasUsed.toString(),
      network: 'Polygon Mumbai',
      isMock: false
    };
  } catch (error) {
    console.error('❌ Blockchain revocation error:', error.message);
    
    return {
      txHash: `0x${Math.random().toString(16).substring(2, 66)}`,
      blockNumber: Math.floor(Math.random() * 1000000) + 30000000,
      network: 'Polygon Mumbai (Mock - Error)',
      isMock: true,
      error: error.message
    };
  }
};

/**
 * Get wallet balance
 * @returns {Object} - Wallet balance info
 */
const getWalletBalance = async () => {
  try {
    const provider = getProvider();
    const wallet = getWallet();
    
    const balance = await provider.getBalance(wallet.address);
    
    return {
      address: wallet.address,
      balance: ethers.formatEther(balance),
      network: 'Polygon Mumbai'
    };
  } catch (error) {
    console.error('Error getting wallet balance:', error);
    return null;
  }
};

/**
 * Get transaction details
 * @param {String} txHash - Transaction hash
 * @returns {Object} - Transaction details
 */
const getTransactionDetails = async (txHash) => {
  try {
    const provider = getProvider();
    
    const tx = await provider.getTransaction(txHash);
    const receipt = await provider.getTransactionReceipt(txHash);
    
    return {
      hash: tx.hash,
      from: tx.from,
      to: tx.to,
      value: ethers.formatEther(tx.value),
      gasPrice: tx.gasPrice ? ethers.formatUnits(tx.gasPrice, 'gwei') : null,
      gasUsed: receipt ? receipt.gasUsed.toString() : null,
      blockNumber: receipt ? receipt.blockNumber : null,
      status: receipt ? (receipt.status === 1 ? 'Success' : 'Failed') : 'Pending',
      confirmations: tx.confirmations
    };
  } catch (error) {
    console.error('Error getting transaction details:', error);
    return null;
  }
};

/**
 * Check if blockchain is available
 * @returns {Boolean}
 */
const isBlockchainAvailable = () => {
  return isBlockchainReady();
};

module.exports = {
  issueCertificateOnChain,
  batchIssueCertificates,
  verifyCertificateOnChain,
  revokeCertificateOnChain,
  getWalletBalance,
  getTransactionDetails,
  isBlockchainAvailable
};
