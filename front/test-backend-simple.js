// Simple test to isolate backend issue
console.log('🧪 Testing backend connection...');

// Test 1: Basic health check
fetch('http://localhost:5000/api/test')
  .then(response => response.json())
  .then(data => {
    console.log('✅ Backend health check:', data);
  })
  .catch(error => {
    console.error('❌ Backend health check failed:', error.message);
  });

// Test 2: Test orders endpoint with proper authentication
fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'test@test.com',
    password: 'password123'
  })
})
.then(response => response.json())
.then(data => {
  console.log('✅ Login successful, token:', data.token ? 'YES' : 'NO');
  
  // Test orders with real token
  return fetch('http://localhost:5000/api/orders', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${data.token}`
    }
  });
})
.then(response => response.json())
.then(data => {
  console.log('✅ Orders API response:', data);
  console.log('Orders count:', data.length || 0);
})
.catch(error => {
  console.error('❌ Orders API failed:', error.message);
});

console.log('🎯 Test completed!');
