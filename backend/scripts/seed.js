/**
 * Database Seeding Script
 * Creates demo users for testing
 */

require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const User = require('../models/User');

const demoUsers = [
  {
    username: 'admin',
    password: 'admin123',
    email: 'admin@credsone.com',
    fullName: 'Admin User',
    role: 'admin',
    organization: 'CredsOne',
    isActive: true
  },
  {
    username: 'issuer1',
    password: 'issuer123',
    email: 'issuer1@ncvet.org',
    fullName: 'Issuer One',
    role: 'issuer',
    organization: 'NCVET',
    isActive: true
  },
  {
    username: 'verifier1',
    password: 'verifier123',
    email: 'verifier1@tcs.com',
    fullName: 'Verifier One',
    role: 'verifier',
    organization: 'TCS',
    isActive: true
  },
  {
    username: 'learner1',
    password: 'learner123',
    email: 'learner@example.com',
    fullName: 'Learner One',
    role: 'learner',
    isActive: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing users (optional - be careful in production!)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');

    // Create demo users
    for (const userData of demoUsers) {
      const user = new User(userData);
      await user.save();
      console.log(`✅ Created ${user.role}: ${user.username}`);
    }

    console.log('\n🎉 Database seeded successfully!');
    console.log('\nDemo Users:');
    console.log('─'.repeat(50));
    demoUsers.forEach(user => {
      console.log(`${user.role.padEnd(10)} | ${user.username.padEnd(15)} | ${user.password}`);
    });
    console.log('─'.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
