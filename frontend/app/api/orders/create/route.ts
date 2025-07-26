import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

const ORDER_SERVICE_URL = 'http://localhost:9092';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');
    const userEmail = request.headers.get('x-user-email');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    if (!userEmail) {
      return NextResponse.json({ error: 'User email required' }, { status: 401 });
    }

    console.log('Creating order with data:', body);

    // Determine if this is a rental order
    const isRentalOrder = body.startDate && body.endDate;
    
    // Validate dates if this is a rental order
    if (isRentalOrder) {
      const startDate = new Date(body.startDate);
      const endDate = new Date(body.endDate);
      
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return NextResponse.json(
          { error: 'Invalid date format. Please use YYYY-MM-DD format.' },
          { status: 400 }
        );
      }
      
      if (startDate >= endDate) {
        return NextResponse.json(
          { error: 'End date must be after start date.' },
          { status: 400 }
        );
      }

      // Validate dailyRate for rental orders
      const dailyRate = Number(body.dailyRate) || Number(body.totalAmount);
      if (!dailyRate || dailyRate <= 0) {
        return NextResponse.json(
          { error: 'Daily rate must be greater than 0 for rental orders.' },
          { status: 400 }
        );
      }
    }
    
    const orderPayload = {
      itemIds: body.itemIds || [body.itemId], // Handle both itemId and itemIds
      address: body.address || 'Default Address',
      startDate: body.startDate,
      endDate: body.endDate,
      dailyRate: Number(body.dailyRate) || Number(body.totalAmount) || 0,
      securityDeposit: Number(body.securityDeposit) || 0,
      itemTitle: body.itemTitle,
      ownerEmail: body.ownerEmail,
      notes: body.notes
    };

    console.log('Original body:', body);
    console.log('Processed orderPayload:', orderPayload);
    console.log('dailyRate from body:', body.dailyRate, 'type:', typeof body.dailyRate);
    console.log('totalAmount from body:', body.totalAmount, 'type:', typeof body.totalAmount);
    console.log('securityDeposit from body:', body.securityDeposit, 'type:', typeof body.securityDeposit);
    console.log('final dailyRate:', orderPayload.dailyRate, 'type:', typeof orderPayload.dailyRate);
    console.log('final securityDeposit:', orderPayload.securityDeposit, 'type:', typeof orderPayload.securityDeposit);

    const endpoint = isRentalOrder ? '/orders/rental' : '/orders';
    const fullUrl = `${ORDER_SERVICE_URL}${endpoint}`;
    
    console.log('Sending request to:', fullUrl);
    console.log('Order payload:', orderPayload);
    console.log('Headers:', {
      'Authorization': authHeader ? 'Bearer [HIDDEN]' : 'None',
      'X-USER-EMAIL': userEmail,
      'Content-Type': 'application/json'
    });
    
    const response = await axios.post(fullUrl, orderPayload, {
      headers: {
        'Authorization': authHeader,
        'X-USER-EMAIL': userEmail,
        'Content-Type': 'application/json'
      },
      timeout: 10000 // 10 second timeout
    });

    console.log('Order created successfully:', response.data);
    return NextResponse.json(response.data);

  } catch (error: any) {
    console.error('Error creating order:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url
    });
    
    if (error.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { error: 'OrderService is not running. Please start the service.' },
        { status: 503 }
      );
    }
    
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: 'OrderService endpoint not found. Please check the service configuration.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { 
        error: error.response?.data?.error || error.message || 'Failed to create order',
        details: error.response?.data
      },
      { status: error.response?.status || 500 }
    );
  }
}
