import { NextRequest, NextResponse } from 'next/server';

const REVIEW_SERVICE_URL = 'http://localhost:9095';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authHeader = request.headers.get('authorization');

    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    // Validate required fields
    if (!body.itemId || !body.rating || !body.comment) {
      return NextResponse.json({ 
        error: 'Missing required fields: itemId, rating, and comment are required' 
      }, { status: 400 });
    }

    if (body.rating < 1 || body.rating > 5) {
      return NextResponse.json({ 
        error: 'Rating must be between 1 and 5' 
      }, { status: 400 });
    }

    // Check if user has already reviewed this item
    try {
      const checkResponse = await fetch(`${REVIEW_SERVICE_URL}/api/reviews/check/${body.itemId}/${body.userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.hasReviewed) {
          return NextResponse.json({ 
            error: 'You have already reviewed this item' 
          }, { status: 400 });
        }
      }
    } catch (error) {
      console.warn('Could not check for existing review:', error);
      // Continue with review submission even if check fails
    }

    console.log('Creating review:', body);

    const response = await fetch(`${REVIEW_SERVICE_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` };
      }
      console.error('ReviewService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to create review' },
        { status: response.status }
      );
    }

    const reviewData = await response.json();
    console.log('Review created successfully:', reviewData);
    return NextResponse.json(reviewData);

  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const itemId = searchParams.get('itemId');
    const userId = searchParams.get('userId');
    
    let url = `${REVIEW_SERVICE_URL}/api/reviews`;
    const params = new URLSearchParams();
    
    if (itemId) params.append('itemId', itemId);
    if (userId) params.append('userId', userId);
    
    if (params.toString()) {
      url += `?${params.toString()}`;
    }

    console.log('Fetching reviews from:', url);

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('ReviewService error:', errorData);
      return NextResponse.json(
        { error: errorData.error || errorData.message || 'Failed to fetch reviews' },
        { status: response.status }
      );
    }

    const reviews = await response.json();
    console.log('Reviews fetched successfully:', reviews.length);
    return NextResponse.json(reviews);

  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
