const testProductCreation = async () => {
  try {
    console.log('Testing product creation...');
    
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
    
    if (loginData.token) {
      console.log('Admin login successful');
      
      // Test product creation
      const productResponse = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${loginData.token}`
        },
        body: JSON.stringify({
          name: 'Test Product',
          price: 29.99,
          description: 'This is a test product created from admin panel',
          category: 'Test Category',
          image: '/products/test.jpg'
        })
      });
      
      console.log('Product creation status:', productResponse.status);
      const productData = await productResponse.json();
      console.log('Product creation response:', productData);
      
      if (productResponse.ok) {
        console.log('✅ Product created successfully!');
      } else {
        console.log('❌ Product creation failed:', productData);
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testProductCreation();
