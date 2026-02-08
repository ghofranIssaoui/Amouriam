// app/api/orders/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Handle GET request to fetch orders
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  
  if (!token) {
    return NextResponse.json(
      { message: 'Authentification requise' },
      { status: 401 }
    );
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    
    // Try both endpoints for compatibility
    let response;
    try {
      response = await fetch(`${apiUrl}/api/orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });
    } catch (error) {
      console.log('First endpoint failed, trying /my-orders...');
      response = await fetch(`${apiUrl}/api/my-orders`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        cache: 'no-store',
      });
    }

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('Failed to fetch orders:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      
      return NextResponse.json(
        { 
          message: data.message || 'Échec de la récupération des commandes',
          details: data.details
        },
        { status: response.status }
      );
    }

    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error: any) {
    console.error('Error in orders API route:', error);
    return NextResponse.json(
      { 
        message: 'Erreur interne du serveur',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}

// Handle POST request to create a new order
export async function POST(request: NextRequest) {
  try {
    const orderData = await request.json();
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.split(' ')[1];
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const response = await fetch(`${apiUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(orderData),
    });

    const data = await response.json().catch(() => ({}));
    
    if (!response.ok) {
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
        data
      });
      return NextResponse.json(
        { 
          message: data.message || 'Failed to create order',
          details: data.details
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Order creation error:', error);
    return NextResponse.json(
      { 
        message: 'Internal server error',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    );
  }
}