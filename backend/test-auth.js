const testAuth = async () => {
  try {
    // Test registration
    console.log('Testing registration...');
    const registerResponse = await fetch('http://localhost:5002/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      })
    });
    const registerData = await registerResponse.json();
    console.log('Registration response:', registerData);

    if (registerData.success) {
      // Test login
      console.log('\nTesting login...');
      const loginResponse = await fetch('http://localhost:5002/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123'
        })
      });
      const loginData = await loginResponse.json();
      console.log('Login response:', loginData);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Run the test
testAuth();
