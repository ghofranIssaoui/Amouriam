const testMessageSubmission = async () => {
  try {
    console.log('Testing message submission...');
    
    // Test message submission
    const messageResponse = await fetch('http://localhost:5000/api/messages/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        subject: 'Test Message Subject',
        message: 'This is a test message from the contact form.'
      })
    });
    
    console.log('Message submission status:', messageResponse.status);
    const messageData = await messageResponse.json();
    console.log('Message submission response:', messageData);
    
    if (messageResponse.ok) {
      console.log('✅ Message submitted successfully!');
      
      // Now test fetching messages as admin
      console.log('\nTesting admin message fetch...');
      
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
        // Fetch messages
        const messagesResponse = await fetch('http://localhost:5000/api/messages/all', {
          headers: {
            'Authorization': `Bearer ${loginData.token}`
          }
        });
        
        console.log('Messages fetch status:', messagesResponse.status);
        const messagesData = await messagesResponse.json();
        console.log('Messages data:', messagesData);
        
        if (messagesResponse.ok) {
          console.log(`✅ Found ${messagesData.messages.length} messages`);
          const latestMessage = messagesData.messages[0];
          console.log('Latest message:', {
            name: latestMessage.name,
            email: latestMessage.email,
            subject: latestMessage.subject,
            status: latestMessage.status
          });
        }
      }
    } else {
      console.log('❌ Message submission failed:', messageData);
    }
  } catch (error) {
    console.error('Test failed:', error);
  }
};

testMessageSubmission();
