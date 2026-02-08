const testUsersOrdersEndpoint = async () => {
  try {
    console.log('Testing users endpoint via orders...');
    
    // Login as admin
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testadmin@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login successful:', loginData.user.isAdmin);
    
    if (loginData.token) {
      // Test users endpoint via orders
      const usersResponse = await fetch('http://localhost:5000/api/orders/users/all', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      console.log('Users response status:', usersResponse.status);
      const usersData = await usersResponse.json();
      console.log('Users data:', usersData);
      
      if (usersResponse.ok) {
        console.log(`✅ Found ${usersData.users.length} users`);
        usersData.users.forEach((user, index) => {
          console.log(`${index + 1}. ${user.name} (${user.email}) - ${user.isAdmin ? 'Admin' : 'User'}`);
        });
      } else {
        console.log('❌ Error fetching users:', usersData);
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testUsersOrdersEndpoint();
