import { NextResponse } from 'next/server';

export async function GET() {
  // TODO: Replace with real backend integration
  // For now, return a mock array of favorite listings
  return NextResponse.json([
    {
      id: 'mock1',
      title: 'Mock Favorite Item',
      description: 'A sample favorite item for demo purposes.',
      imageSrc: '/images/placeholder.jpg',
      locationValue: 'Demo City',
      category: 'Electronics',
      itemCount: 1,
      price: 100,
      userId: 'mockuser',
      createdAt: new Date().toISOString(),
      type: 'RENT',
      available: true,
      rating: 4.5,
      securityDeposit: 0,
      usagePolicy: '',
      features: []
    }
  ]);
} 