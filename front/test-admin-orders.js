const testAdminOrders = async () => {
  try {
    console.log('Testing admin login...');
    
    // First login as admin
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'Amourium.monde@gmail.com',
        password: 'password'
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
        console.log(`\nFound ${ordersData.length} orders`);
      } else {
        console.log('Error fetching orders:', ordersData);
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testAdminOrders();
