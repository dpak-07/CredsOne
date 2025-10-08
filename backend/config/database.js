// db/databaseManager.js
/**
 * Database Configuration + Detailed Debug Logs
 * MongoDB Atlas connection setup with Mongoose + Winston logging
 */

const mongoose = require('mongoose');
const winston = require('winston');
const os = require('os');

class DatabaseManager {
  constructor() {
    this.isConnected = false;
    this.connectionAttempts = 0;
    this.maxRetries = parseInt(process.env.MONGO_MAX_RETRIES || '3', 10);
    this.retryDelayMs = parseInt(process.env.MONGO_RETRY_DELAY_MS || '5000', 10);

    // Initialize logger
    const level = process.env.LOG_LEVEL || 'info';
    const transports = [
      new winston.transports.Console({ stderrLevels: ['error'] })
    ];
    if (process.env.LOG_TO_FILE === 'true') {
      transports.push(new winston.transports.File({ filename: process.env.LOG_FILE || 'mongo-debug.log' }));
    }
    this.logger = winston.createLogger({
      level,
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}] ${message}`)
      ),
      transports
    });

    // If using mongoose debug mode for queries
    if (process.env.MONGO_DEBUG === 'true') {
      mongoose.set('debug', (collectionName, method, query, doc, options) => {
        try {
          const qStr = JSON.stringify(query);
          const dStr = doc ? JSON.stringify(doc) : '';
          this.logger.debug(`MONGODB QUERY → ${collectionName}.${method}(${qStr}) ${dStr}`);
        } catch (err) {
          this.logger.debug(`MONGODB QUERY → ${collectionName}.${method} (could not stringify query)`);
        }
      });
    }

    // Global plugin to log writes/uploads
    mongoose.plugin((schema) => {
      // pre save
      schema.pre('save', function (next) {
        this.__startSave = Date.now();
        const modelName = this.constructor.modelName || 'UnknownModel';
        // Do not log entire doc in production unless explicit debug
        this.constructor.db && this.constructor.db.client; // no-op to avoid lint errors
        this.loggerSafe = this.loggerSafe || (() => {}); // fallback
        next();
      });

      // post save
      schema.post('save', function (doc) {
        const modelName = doc.constructor.modelName || 'UnknownModel';
        const id = doc._id;
        // minimal safe info
        DatabaseManager.globalLogger.debug(`MODEL SAVE → ${modelName}._id=${id} (duration=${Date.now() - (this.__startSave || Date.now())}ms)`);
      });

      // updateOne / findOneAndUpdate etc.
      schema.pre('updateOne', function (next) {
        this.__startOp = Date.now();
        next();
      });
      schema.post('updateOne', function (res) {
        const modelName = this.model ? this.model.modelName : 'UnknownModel';
        DatabaseManager.globalLogger.debug(`MODEL updateOne → ${modelName} (duration=${Date.now() - (this.__startOp || Date.now())}ms)`);
      });

      schema.pre('insertMany', function (next) {
        this.__startOp = Date.now();
        next();
      });
      schema.post('insertMany', function (docs) {
        DatabaseManager.globalLogger.debug(`MODEL insertMany → count=${docs.length} (duration=${Date.now() - (this.__startOp || Date.now())}ms)`);
      });

      schema.post('remove', function (doc) {
        const modelName = doc.constructor.modelName || 'UnknownModel';
        DatabaseManager.globalLogger.debug(`MODEL REMOVE → ${modelName}._id=${doc._id}`);
      });
    });

    // Expose logger to static context used in plugin closures
    DatabaseManager.globalLogger = this.logger;
  }

  // main connect function
  async connectDB() {
    try {
      if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not defined in environment variables');
      }

      this.connectionAttempts++;
      const maskedURI = this.maskMongoURI(process.env.MONGODB_URI);
      this.logger.info(`Attempting to connect to MongoDB Atlas (attempt ${this.connectionAttempts}/${this.maxRetries}). URI: ${maskedURI}`);

      const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: parseInt(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || '30000', 10),
        socketTimeoutMS: parseInt(process.env.MONGO_SOCKET_TIMEOUT_MS || '45000', 10),
        maxPoolSize: parseInt(process.env.MONGO_MAX_POOL_SIZE || '10', 10),
        minPoolSize: parseInt(process.env.MONGO_MIN_POOL_SIZE || '0', 10),
        retryWrites: true,
        w: 'majority',
        heartbeatFrequencyMS: parseInt(process.env.MONGO_HEARTBEAT_MS || '10000', 10),
      };

      // Log options but remove anything sensitive
      const safeOptions = Object.assign({}, options);
      this.logger.debug(`Connection options: ${JSON.stringify(safeOptions)}`);

      // Extra environment context
      this.logger.debug(`Node env: ${process.env.NODE_ENV || 'undefined'}, Hostname: ${os.hostname()}, PID: ${process.pid}`);

      // Attach listeners before connecting for earliest coverage
      this.setupEventHandlers();

      const conn = await mongoose.connect(process.env.MONGODB_URI, options);

      this.isConnected = true;
      this.connectionAttempts = 0;

      this.logger.info('MongoDB Atlas Connected Successfully!');
      this.logger.info(`   Host: ${conn.connection.host}`);
      this.logger.info(`   Database: ${conn.connection.name}`);
      this.logger.info(`   Port: ${conn.connection.port}`);
      this.logger.info(`   Ready State: ${this.getReadyState(conn.connection.readyState)}`);
      // list collections - don't stringify full content
      try {
        const collections = Object.keys(conn.connection.collections || {});
        this.logger.debug(`Collections present: ${collections.join(', ') || '<none>'}`);
      } catch (err) {
        this.logger.debug('Could not get collections metadata: ' + (err.message || err));
      }

      return conn;
    } catch (error) {
      this.logger.error(`MongoDB Connection Attempt ${this.connectionAttempts} Failed: ${error.message}`);
      if (this.connectionAttempts < this.maxRetries) {
        this.logger.warn(`Retrying connection in ${this.retryDelayMs}ms... (${this.connectionAttempts}/${this.maxRetries})`);
        await this.delay(this.retryDelayMs);
        return this.connectDB();
      } else {
        await this.handleConnectionFailure(error);
      }
    }
  }

  maskMongoURI(uri) {
    try {
      return uri.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://$1:****@');
    } catch (err) {
      return 'mongodb+srv://<masked_uri>';
    }
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
    // Avoid double-binding if called multiple times
    if (this._handlersAttached) return;
    this._handlersAttached = true;

    mongoose.connection.on('connecting', () => {
      this.logger.info('Mongoose connecting...');
    });

    mongoose.connection.on('open', () => {
      this.logger.info('Mongoose connection open');
    });

    mongoose.connection.on('connected', () => {
      this.logger.info('Mongoose connected to MongoDB Atlas (event)');
      this.isConnected = true;
      // log server info
      const { host, port } = mongoose.connection;
      this.logger.debug(`Connected event: host=${host}, port=${port}`);
    });

    mongoose.connection.on('error', (err) => {
      this.logger.error(`Mongoose connection error: ${err && err.message ? err.message : err}`);
      this.isConnected = false;
    });

    mongoose.connection.on('disconnected', () => {
      this.logger.warn('Mongoose disconnected');
      this.isConnected = false;
    });

    mongoose.connection.on('reconnected', () => {
      this.logger.info('Mongoose reconnected to MongoDB Atlas');
      this.isConnected = true;
    });

    mongoose.connection.on('reconnectFailed', () => {
      this.logger.error('Mongoose reconnection failed');
      this.isConnected = false;
    });

    // Index build events (fired on `Model.on('index', ...)` — mongoose supports this on connection)
    mongoose.connection.on('index', (err) => {
      if (err) {
        this.logger.error('Index build error: ' + (err.message || err));
      } else {
        this.logger.debug('Index build complete (connection event)');
      }
    });

    // DNS and topology warnings - mongoose emits no direct DNS event; we can log serverSelectionTimeout errors via `error`.
    // Graceful shutdown - prefer once handlers so we don't attach duplicates
    const shutdown = this.gracefulShutdown.bind(this);
    process.once('SIGINT', shutdown);
    process.once('SIGTERM', shutdown);
  }

  async gracefulShutdown() {
    this.logger.warn('Received shutdown signal. Closing MongoDB connection...');
    try {
      await mongoose.connection.close(false);
      this.logger.info('MongoDB Atlas connection closed gracefully');
      process.exit(0);
    } catch (err) {
      this.logger.error('Error closing MongoDB connection: ' + (err && err.message ? err.message : err));
      process.exit(1);
    }
  }

  async handleConnectionFailure(error) {
    this.logger.error('All MongoDB Atlas connection attempts failed: ' + (error && error.message ? error.message : error));

    // Detailed help in development only
    if (process.env.NODE_ENV === 'development') {
      this.logger.info('MongoDB Troubleshooting Suggestions:');
      if ((error.message || '').toLowerCase().includes('authentication')) {
        this.logger.info(' - Authentication issue: check username/password, user privileges.');
      } else if ((error.message || '').toLowerCase().includes('getaddrinfo')) {
        this.logger.info(' - DNS/network issue: check internet, cluster hostname, whitelisted IP.');
      } else if ((error.message || '').toLowerCase().includes('querysrv')) {
        this.logger.info(' - SRV record issue: ensure mongodb+srv:// and DNS is resolving.');
      } else {
        this.logger.info(' - General: verify MONGODB_URI format, Atlas cluster status, network access.');
      }
    } else {
      this.logger.info('Set NODE_ENV=development for more detailed troubleshooting output.');
    }

    // Allow process to exit with non-zero code so orchestrators (k8s) can restart
    process.exit(1);
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Utility to get connection status snapshot
  getConnectionStatus() {
    let collections = [];
    try {
      collections = Object.keys(mongoose.connection.collections || {});
    } catch (err) {
      // ignore
    }
    return {
      isConnected: this.isConnected,
      readyState: mongoose.connection.readyState,
      host: mongoose.connection.host,
      name: mongoose.connection.name,
      port: mongoose.connection.port,
      collections,
      pid: process.pid
    };
  }
}

// Create and export singleton instance
const databaseManager = new DatabaseManager();
module.exports = databaseManager.connectDB.bind(databaseManager);
module.exports.DatabaseManager = databaseManager;
