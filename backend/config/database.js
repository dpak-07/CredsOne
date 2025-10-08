/**
 * Database Configuration
 * MongoDB Atlas connection setup with Mongoose
 */

const mongoose = require('mongoose');

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = 3;
  }

  async connectDB() {
    try {
      // Validate MongoDB URI
      if (!process.env.MONGODB_URI) {
        throw new Error('❌ MONGODB_URI is not defined in environment variables');
      }

      // Mask password in logs for security
      const maskedURI = this.maskMongoURI(process.env.MONGODB_URI);
      console.log(`🔗 Attempting to connect to MongoDB Atlas: ${maskedURI}`);

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 30000, // Increased timeout for cloud
        socketTimeoutMS: 45000,
        maxPoolSize: 10, // Connection pool size
        minPoolSize: 5,
        retryWrites: true,
        w: 'majority',
        heartbeatFrequencyMS: 10000, // Keep connection alive
      };

      const conn = await mongoose.connect(process.env.MONGODB_URI, options);

      this.isConnected = true;
      this.connectionAttempts = 0;

      console.log(`✅ MongoDB Atlas Connected Successfully!`);
      console.log(`   Host: ${conn.connection.host}`);
      console.log(`   Database: ${conn.connection.name}`);
      console.log(`   Port: ${conn.connection.port}`);
      console.log(`   Ready State: ${this.getReadyState(conn.connection.readyState)}`);

      this.setupEventHandlers();
      return conn;

    } catch (error) {
      this.connectionAttempts++;
      
      console.error(`❌ MongoDB Atlas Connection Attempt ${this.connectionAttempts} Failed:`, error.message);

      // Retry logic
      if (this.connectionAttempts < this.maxRetries) {
        console.log(`🔄 Retrying connection in 5 seconds... (${this.connectionAttempts}/${this.maxRetries})`);
        await this.delay(5000);
        return this.connectDB();
      } else {
        await this.handleConnectionFailure(error);
      }
    }
  }

  maskMongoURI(uri) {
    // Mask password in connection string for security
    return uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:****@');
  }

  getReadyState(state) {
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    return states[state] || 'unknown';
  }

  setupEventHandlers() {
    // Connection events
    mongoose.connection.on('connected', () => {
      console.log('✅ Mongoose connected to MongoDB Atlas');
      this.isConnected = true;
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ Mongoose connection error:', err.message);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  Mongoose disconnected from MongoDB Atlas');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔁 Mongoose reconnected to MongoDB Atlas');
      this.isConnected = true;
    });

    mongoose.connection.on('reconnectFailed', () => {
      console.error('❌ Mongoose reconnection failed');
      this.isConnected = false;
    });

    // Graceful shutdown
    process.on('SIGINT', this.gracefulShutdown.bind(this));
    process.on('SIGTERM', this.gracefulShutdown.bind(this));
  }

  async gracefulShutdown() {
    console.log('\n🛑 Received shutdown signal. Closing MongoDB connection...');
    
    try {
      await mongoose.connection.close();
      console.log('✅ MongoDB Atlas connection closed gracefully');
      process.exit(0);
    } catch (err) {
      console.error('❌ Error closing MongoDB connection:', err);
      process.exit(1);
    }
  }

  async handleConnectionFailure(error) {
    console.error('❌ All MongoDB Atlas connection attempts failed');
    
    // Detailed troubleshooting based on error type
    if (process.env.NODE_ENV === 'development') {
      console.log('\n🔧 MongoDB Atlas Troubleshooting Guide:');
      
      if (error.message.includes('authentication failed')) {
        console.log('   🔐 Authentication Issue:');
        console.log('   • Check your username and password in MONGODB_URI');
        console.log('   • Verify the database user exists in Atlas');
        console.log('   • Ensure the user has correct privileges');
      } else if (error.message.includes('getaddrinfo')) {
        console.log('   🌐 Network/DNS Issue:');
        console.log('   • Check your internet connection');
        console.log('   • Verify the cluster URL is correct');
        console.log('   • Ensure your IP is whitelisted in Atlas');
      } else if (error.message.includes('querySrv')) {
        console.log('   🔗 SRV Record Issue:');
        console.log('   • Ensure you\'re using mongodb+srv:// format');
        console.log('   • Check your DNS settings');
      } else {
        console.log('   💡 General Tips:');
        console.log('   • Verify MONGODB_URI format in .env file');
        console.log('   • Check Atlas cluster status (might be down)');
        console.log('   • Ensure database exists in Atlas');
        console.log('   • Check Network Access in Atlas dashboard');
      }
      
      console.log('\n   📖 Atlas Setup Checklist:');
      console.log('   1. Go to MongoDB Atlas → Clusters');
      console.log('   2. Click "Connect" on your cluster');
      console.log('   3. Choose "Connect your application"');
      console.log('   4. Copy the connection string');
      console.log('   5. Replace username, password, and database name');
      console.log('   6. Add your IP to Network Access');
      console.log('   7. Create a database user with read/write privileges\n');
    }
    
    process.exit(1);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility method to check connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      collections: Object.keys(mongoose.connection.collections)
    };
  }
}

// Create and export singleton instance
const databaseManager = new DatabaseManager();
module.exports = databaseManager.connectDB.bind(databaseManager);

// Also export the manager for advanced usage
module.exports.DatabaseManager = databaseManager;