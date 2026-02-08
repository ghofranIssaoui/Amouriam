const testAuthRoutes = async () => {
  try {
    console.log('Testing auth routes...');
    
    // Test login first
    const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'testadmin@example.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    console.log('Login status:', loginResponse.status);
    console.log('Login data:', loginData);
    
    if (loginData.token) {
      // Test the /all endpoint
      console.log('\nTesting /api/auth/all endpoint...');
      
      const allResponse = await fetch('http://localhost:5000/api/auth/all', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('All users response status:', allResponse.status);
      console.log('All users response headers:', Object.fromEntries(allResponse.headers.entries()));
      
      const text = await allResponse.text();
      console.log('All users response text:', text.substring(0, 200));
      
      if (allResponse.ok) {
        try {
          const json = JSON.parse(text);
          console.log('All users parsed JSON:', json);
        } catch (e) {
          console.log('Failed to parse JSON:', e.message);
        }
      }
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testAuthRoutes();
