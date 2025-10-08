// models/User.js (replace file)

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const organizationSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  registrationNumber: { type: String, trim: true },
  // if you need a `type` field for organization type, name it orgType to avoid Mongoose 'type' clashes
  orgType: { type: String, trim: true }
}, { _id: false });

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    lowercase: true,
    minlength: [3, 'Username must be at least 3 characters'],
    maxlength: [30, 'Username cannot exceed 30 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required'],
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'institution', 'employer', 'learner'], // fixed typo 'institution'
    default: 'learner'
  },
  organization: {
    type: organizationSchema,
    default: {}
  },
  walletAddress: {
    type: String,
    trim: true
  },
  did: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  twoFactorEnabled: {
    type: Boolean,
    default: false
  },
  twoFactorSecret: {
    type: String,
    select: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

// Get public profile
userSchema.methods.getPublicProfile = function() {
  return {
    id: this._id,
    username: this.username,
    email: this.email,
    fullName: this.fullName,
    role: this.role,
    organization: this.organization,
    walletAddress: this.walletAddress,
    did: this.did,
    isActive: this.isActive,
    createdAt: this.createdAt
  };
};

// Static method to find by credentials (normalize input)
userSchema.statics.findByCredentials = async function(identifier, password) {
  const lookup = String(identifier || '').trim().toLowerCase();
  const user = await this.findOne({
    $or: [{ username: lookup }, { email: lookup }]
  }).select('+password');

  if (!user) {
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account is deactivated');
  }

  const isPasswordMatch = await user.comparePassword(password);
  
  if (!isPasswordMatch) {
    throw new Error('Invalid credentials');
  }

  return user;
};

// Indexes (unique indexes already declared via schema unique: true)
userSchema.index({ username: 1 }, { unique: true });
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ role: 1 });
userSchema.index({ walletAddress: 1 });

module.exports = mongoose.model('User', userSchema);
