const testAuthTest = async () => {
  try {
    console.log('Testing auth test route...');
    
    // Login first
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
      // Test the test endpoint
      const testResponse = await fetch('http://localhost:5000/api/auth/test', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${loginData.token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Test route response status:', testResponse.status);
      const testText = await testResponse.text();
      console.log('Test route response:', testText);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testAuthTest();
