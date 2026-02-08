const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.connect('mongodb://localhost:27017/amourium')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Check UserBackend collection
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      isAdmin: Boolean,
      role: String
    }, { collection: 'userbackends' });
    
    const User = mongoose.model('UserBackend', userSchema);
    
    const admin = await User.findOne({ email: 'Amourium.monde@gmail.com' });
    if (admin) {
      console.log('Admin user found in UserBackend:', admin.email);
      console.log('Is admin:', admin.isAdmin);
      console.log('Password hash length:', admin.password.length);
      
      // Test password
      const isValid = await bcrypt.compare('password', admin.password);
      console.log('Password valid:', isValid);
      
      // Test with wrong password
      const isInvalid = await bcrypt.compare('wrong', admin.password);
      console.log('Wrong password valid:', isInvalid);
    } else {
      console.log('Admin user not found in UserBackend collection');
      
      // Check all users
      const allUsers = await User.find({});
      console.log('Total users in UserBackend:', allUsers.length);
      allUsers.forEach(user => {
        console.log(`- ${user.email} (admin: ${user.isAdmin})`);
      });
    }
    
    mongoose.connection.close();
  })
  .catch(console.error);
