const mongoose = require('mongoose');
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/amourium';

// User schema matching your backend model
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, select: false },
  isAdmin: { type: Boolean, default: false },
  role: { type: String, enum: ['ADMIN', 'USER'], default: 'USER' },
  addresses: [{ type: mongoose.Schema.Types.Mixed }],
  orders: [{ type: mongoose.Schema.Types.Mixed }],
  wishlist: [{ type: mongoose.Schema.Types.Mixed }]
}, { timestamps: true });

// Use the same collection name as your backend User model
const User = mongoose.model('UserBackend', userSchema);

async function fetchUsers() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Fetch all users (without passwords)
    const users = await User.find({}).select('-password');
    console.log(`\n📊 Total users found: ${users.length}`);
    
    if (users.length === 0) {
      console.log('❌ No users found in the database');
    } else {
      users.forEach((user, index) => {
        console.log(`\n👤 User ${index + 1}:`);
        console.log(`   ID: ${user._id.toString()}`);
        console.log(`   Name: ${user.name}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Role: ${user.role}`);
        console.log(`   IsAdmin: ${user.isAdmin}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Updated: ${user.updatedAt}`);
      });
    }

    await mongoose.disconnect();
    console.log('\n✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    await mongoose.disconnect();
  }
}

fetchUsers();
