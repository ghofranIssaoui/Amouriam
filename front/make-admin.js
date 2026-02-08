const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/amourium')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Update the test user to be admin
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      password: String,
      isAdmin: Boolean,
      role: String
    }, { collection: 'userbackends' });
    
    const User = mongoose.model('UserBackend', userSchema);
    
    const result = await User.updateOne(
      { email: 'testadmin@example.com' },
      { isAdmin: true, role: 'ADMIN' }
    );
    
    console.log('Update result:', result);
    
    // Verify the update
    const admin = await User.findOne({ email: 'testadmin@example.com' });
    console.log('User is now admin:', admin.isAdmin);
    
    mongoose.connection.close();
  })
  .catch(console.error);
