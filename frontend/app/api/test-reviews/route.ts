import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET() {
  try {
    // Test the review service
    const response = await axios.get('http://localhost:9095/api/reviews/greet');
    
    return NextResponse.json({
      success: true,
      message: 'Review service is connected',
      data: response.data
    });
  } catch (error) {
    console.error('Error connecting to review service:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to connect to review service',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 