import { NextRequest, NextResponse } from 'next/server';

const REVIEW_SERVICE_URL = 'http://localhost:9095';

export async function GET(
  request: NextRequest,
  { params }: { params: { itemId: string; userId: string } }
) {
  try {
    const { itemId, userId } = params;
    
    if (!itemId || !userId) {
      return NextResponse.json(
        { error: 'Item ID and User ID are required' },
        { status: 400 }
      );
    }

    console.log('Checking review for item:', itemId, 'user:', userId);

    const response = await fetch(`${REVIEW_SERVICE_URL}/api/reviews/check/${itemId}/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ReviewService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to check review' },
        { status: response.status }
      );
    }

    const checkData = await response.json();
    console.log('Review check result:', checkData);
    return NextResponse.json(checkData);

  } catch (error) {
    console.error('Error checking review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 