const testOrderUpdate = async () => {
  try {
    console.log('Testing order status update...');
    
    // First login as admin
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
      // Get an order to update
      const ordersResponse = await fetch('http://localhost:5000/api/orders/admin/all', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      const orders = await ordersResponse.json();
      if (orders.length > 0) {
        const firstOrder = orders[0];
        console.log('Testing update on order:', firstOrder._id);
        console.log('Current status:', firstOrder.status);
        
        // Test updating the order status
        const updateResponse = await fetch(`http://localhost:5000/api/orders/${firstOrder._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${loginData.token}`
          },
          body: JSON.stringify({ 
            status: 'delivered' 
          })
        });
        
        console.log('Update response status:', updateResponse.status);
        const updateText = await updateResponse.text();
        console.log('Update response:', updateText);
      } else {
        console.log('No orders found to test with');
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testOrderUpdate();
