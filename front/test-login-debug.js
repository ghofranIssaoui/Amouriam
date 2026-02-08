const testLogin = async () => {
  try {
    console.log('Testing admin login with detailed logging...');
    
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: 'Amourium.monde@gmail.com',
        password: 'password'
      })
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response text:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('Response JSON:', json);
    } catch (e) {
      console.log('Not valid JSON:', e.message);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testLogin();
