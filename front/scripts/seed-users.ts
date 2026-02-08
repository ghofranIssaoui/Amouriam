import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User';

// Direct MongoDB connection for seeding
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amourium';

async function seedUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create demo users
    const users = [
      {
        name: 'Admin Amourium',
        email: 'Amourium.monde@gmail.com',
        password: 'password',
        isAdmin: true
      },
      {
        name: 'Admin User',
        email: 'admin@amourium.com',
        password: 'password',
        isAdmin: true
      },
      {
        name: 'Demo User',
        email: 'user@example.com',
        password: 'password',
        isAdmin: false
      },
      {
        name: 'Ghofran',
        email: 'ghofran@gmail.com',
        password: 'password',
        isAdmin: false
      }
    ];

    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = new User({
        ...userData,
        password: hashedPassword,
        addresses: [],
        orders: [],
        wishlist: []
      });
      await user.save();
      console.log(`Created user: ${userData.email}`);
    }

    console.log('Users seeded successfully!');
    await mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('Error seeding users:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

seedUsers();
