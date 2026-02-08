const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Direct MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amourium';

// Simple user schema for seeding
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
  addresses: [],
  orders: [],
  wishlist: []
}, { timestamps: true });

const User = mongoose.model('UserBackend', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: 'Amourium.monde@gmail.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
      await mongoose.disconnect();
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash('password', 10);
    const admin = new User({
      name: 'Admin Amourium',
      email: 'Amourium.monde@gmail.com',
      password: hashedPassword,
      isAdmin: true,
      role: 'ADMIN'
    });

    await admin.save();
    console.log('Admin user created successfully!');
    console.log('Email: Amourium.monde@gmail.com');
    console.log('Password: password');

    await mongoose.disconnect();
  } catch (error) {
    console.error('Error creating admin:', error);
    await mongoose.disconnect();
  }
}

createAdmin();
