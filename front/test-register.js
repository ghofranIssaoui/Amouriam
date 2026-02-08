const testRegister = async () => {
  try {
    console.log('Testing user registration...');
    
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'testadmin@example.com',
        password: 'password123'
      })
    });
    
    console.log('Response status:', response.status);
    
    const text = await response.text();
    console.log('Response text:', text);
    
    if (response.ok) {
      const json = JSON.parse(text);
      console.log('Registration successful!');
      console.log('User:', json.user);
      console.log('Token:', json.token ? 'Received' : 'Not received');
      
      // Now test login with the new user
      console.log('\nTesting login with new user...');
      const loginResponse = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: 'testadmin@example.com',
          password: 'password123'
        })
      });
      
      console.log('Login response status:', loginResponse.status);
      const loginText = await loginResponse.text();
      console.log('Login response text:', loginText);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testRegister();
