const testProductsFetch = async () => {
  try {
    console.log('Testing products fetch...');
    
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
      
      // Test products fetch
      const productsResponse = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${loginData.token}`
        }
      });
      
      console.log('Products fetch status:', productsResponse.status);
      const productsData = await productsResponse.json();
      console.log('Products data:', productsData);
      
      if (productsResponse.ok) {
        console.log(`✅ Found ${productsData.length} products`);
        productsData.forEach((product, index) => {
          console.log(`${index + 1}. ${product.name} - ${product.price} Dt - ${product.type}`);
        });
      } else {
        console.log('❌ Error fetching products:', productsData);
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testProductsFetch();
