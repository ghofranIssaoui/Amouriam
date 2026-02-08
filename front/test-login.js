const { NextResponse } = require('next/server');

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    
    // Simple test login
    if (email === 'admin@amourium.com' && password === 'password') {
      return NextResponse.json({
        message: 'Login successful',
        user: {
          id: '1',
          email: 'admin@amourium.com',
          name: 'Admin User',
          isAdmin: true
        },
        token: 'test-token'
      });
    }
    
    return NextResponse.json(
      { message: 'Invalid credentials' },
      { status: 401 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
