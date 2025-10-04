/**
 * Blockchain Configuration
 * Ethereum/Polygon network setup with ethers.js v6
 */

const { ethers } = require('ethers');

// Smart Contract ABI (Application Binary Interface)
const CONTRACT_ABI = [
  {
    "inputs": [
      { "internalType": "bytes32", "name": "certHash", "type": "bytes32" },
      { "internalType": "address", "name": "learner", "type": "address" },
      { "internalType": "string", "name": "certificateId", "type": "string" }
    ],
    "name": "issueCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "certHash", "type": "bytes32" }
    ],
    "name": "verifyCertificate",
    "outputs": [
      { "internalType": "bool", "name": "isValid", "type": "bool" },
      { "internalType": "address", "name": "learner", "type": "address" },
      { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
      { "internalType": "bool", "name": "isRevoked", "type": "bool" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32", "name": "certHash", "type": "bytes32" },
      { "internalType": "string", "name": "reason", "type": "string" }
    ],
    "name": "revokeCertificate",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "bytes32[]", "name": "certHashes", "type": "bytes32[]" },
      { "internalType": "address[]", "name": "learners", "type": "address[]" },
      { "internalType": "string[]", "name": "certificateIds", "type": "string[]" }
    ],
    "name": "batchIssueCertificates",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "certHash", "type": "bytes32" },
      { "indexed": true, "internalType": "address", "name": "learner", "type": "address" },
      { "indexed": false, "internalType": "string", "name": "certificateId", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CertificateIssued",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "bytes32", "name": "certHash", "type": "bytes32" },
      { "indexed": false, "internalType": "string", "name": "reason", "type": "string" },
      { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
    ],
    "name": "CertificateRevoked",
    "type": "event"
  }
];

let provider = null;
let wallet = null;
let contract = null;

/**
 * Initialize blockchain connection
 */
const initBlockchain = () => {
  try {
    // Skip initialization if in mock mode
    if (process.env.MOCK_BLOCKCHAIN === 'true') {
      console.log('⚠️  Blockchain running in MOCK MODE');
      return {
        provider: null,
        wallet: null,
        contract: null,
        mockMode: true
      };
    }

    // Validate required environment variables
    if (!process.env.BLOCKCHAIN_RPC_URL) {
      throw new Error('BLOCKCHAIN_RPC_URL is not defined in environment variables');
    }

    if (!process.env.BLOCKCHAIN_PRIVATE_KEY) {
      throw new Error('BLOCKCHAIN_PRIVATE_KEY is not defined in environment variables');
    }

    if (!process.env.CONTRACT_ADDRESS) {
      throw new Error('CONTRACT_ADDRESS is not defined in environment variables');
    }

    // Create provider (Polygon Mumbai or other network)
    provider = new ethers.JsonRpcProvider(process.env.BLOCKCHAIN_RPC_URL);

    // Create wallet from private key
    wallet = new ethers.Wallet(process.env.BLOCKCHAIN_PRIVATE_KEY, provider);

    // Create contract instance
    contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      wallet
    );

    console.log('✅ Blockchain initialized successfully');
    console.log(`🔗 Network: ${process.env.BLOCKCHAIN_RPC_URL}`);
    console.log(`📝 Contract: ${process.env.CONTRACT_ADDRESS}`);
    console.log(`👛 Wallet: ${wallet.address}`);

    return {
      provider,
      wallet,
      contract,
      mockMode: false
    };

  } catch (error) {
    console.error('❌ Blockchain initialization error:', error.message);
    
    if (process.env.NODE_ENV === 'development') {
      console.log('\n💡 Blockchain Tips:');
      console.log('   1. Set MOCK_BLOCKCHAIN=true in .env for demo mode');
      console.log('   2. Ensure you have a valid private key and RPC URL');
      console.log('   3. Check if the contract is deployed at CONTRACT_ADDRESS');
      console.log('   4. Make sure you have test tokens for gas fees\n');
    }

    // Return mock configuration in development
    if (process.env.NODE_ENV === 'development') {
      console.log('⚠️  Falling back to MOCK MODE');
      return {
        provider: null,
        wallet: null,
        contract: null,
        mockMode: true
      };
    }

    throw error;
  }
};

/**
 * Get blockchain instances
 */
const getBlockchain = () => {
  if (!provider && process.env.MOCK_BLOCKCHAIN !== 'true') {
    return initBlockchain();
  }

  return {
    provider,
    wallet,
    contract,
    mockMode: process.env.MOCK_BLOCKCHAIN === 'true'
  };
};

/**
 * Check if blockchain is available
 */
const isBlockchainAvailable = async () => {
  if (process.env.MOCK_BLOCKCHAIN === 'true') {
    return false;
  }

  try {
    if (!provider) {
      initBlockchain();
    }

    if (!provider) {
      return false;
    }

    await provider.getBlockNumber();
    return true;
  } catch (error) {
    console.error('❌ Blockchain connectivity check failed:', error.message);
    return false;
  }
};

/**
 * Get wallet balance
 */
const getWalletBalance = async () => {
  try {
    if (!wallet || !provider) {
      throw new Error('Wallet not initialized');
    }

    const balance = await provider.getBalance(wallet.address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('❌ Error getting wallet balance:', error.message);
    throw error;
  }
};

/**
 * Get current gas price
 */
const getGasPrice = async () => {
  try {
    if (!provider) {
      throw new Error('Provider not initialized');
    }

    const feeData = await provider.getFeeData();
    return {
      gasPrice: ethers.formatUnits(feeData.gasPrice, 'gwei'),
      maxFeePerGas: feeData.maxFeePerGas ? ethers.formatUnits(feeData.maxFeePerGas, 'gwei') : null,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas ? ethers.formatUnits(feeData.maxPriorityFeePerGas, 'gwei') : null
    };
  } catch (error) {
    console.error('❌ Error getting gas price:', error.message);
    throw error;
  }
};

module.exports = {
  initBlockchain,
  getBlockchain,
  isBlockchainAvailable,
  getWalletBalance,
  getGasPrice,
  CONTRACT_ABI
};
