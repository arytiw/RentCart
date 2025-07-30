import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // This would typically fetch from the ItemService backend
    // For now, return mock data for development
    const mockListings = [
      {
        id: 'listing1',
        title: 'Professional DSLR Camera',
        description: 'High-quality DSLR camera perfect for photography projects.',
        imageSrc: '/images/camera.jpg',
        locationValue: 'New York, NY',
        category: 'Electronics',
        itemCount: 1,
        price: 50,
        userId: 'user1',
        createdAt: new Date().toISOString(),
        type: 'RENT',
        available: true,
        rating: 4.5,
        securityDeposit: 100,
        usagePolicy: 'Handle with care',
        features: ['Full Frame', '24MP', 'WiFi Enabled']
      },
      {
        id: 'listing2',
        title: 'Mountain Bike',
        description: 'Perfect mountain bike for weekend adventures.',
        imageSrc: '/images/bike.jpg',
        locationValue: 'San Francisco, CA',
        category: 'Sports',
        itemCount: 1,
        price: 30,
        userId: 'user2',
        createdAt: new Date().toISOString(),
        type: 'RENT',
        available: true,
        rating: 4.8,
        securityDeposit: 200,
        usagePolicy: 'Must wear helmet',
        features: ['21 Speed', 'Lightweight', 'All Terrain']
      },
      {
        id: 'listing3',
        title: 'Power Drill Set',
        description: 'Complete power drill set with various bits.',
        imageSrc: '/images/drill.jpg',
        locationValue: 'Chicago, IL',
        category: 'Tools',
        itemCount: 1,
        price: 25,
        userId: 'user3',
        createdAt: new Date().toISOString(),
        type: 'RENT',
        available: true,
        rating: 4.2,
        securityDeposit: 50,
        usagePolicy: 'Return clean and charged',
        features: ['Cordless', 'Multiple Bits', 'LED Light']
      }
    ];

    return NextResponse.json(mockListings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}
