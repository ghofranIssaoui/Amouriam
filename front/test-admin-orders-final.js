const testAdminOrders = async () => {
  try {
    console.log('Testing admin login with test admin user...');
    
    // Login as test admin
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testadmin@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (loginData.token) {
      console.log('\nTesting admin orders endpoint...');
      
      // Test admin orders endpoint
      const ordersResponse = await fetch('http://localhost:5000/api/orders/admin/all', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      const ordersData = await ordersResponse.json();
      console.log('Orders response status:', ordersResponse.status);
      console.log('Orders data:', ordersData);
      
      if (ordersResponse.ok) {
        console.log(`\n✅ Found ${ordersData.length} orders`);
        if (ordersData.length === 0) {
          console.log('📝 No orders found - this is normal for a new system');
        }
      } else {
        console.log('❌ Error fetching orders:', ordersData);
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testAdminOrders();
