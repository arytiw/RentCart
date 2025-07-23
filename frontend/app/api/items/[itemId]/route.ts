import { NextResponse } from "next/server";
import axios from "axios";

interface IParams {
  itemId?: string;
}

// Function to validate JWT token with AuthService
async function validateToken(token: string) {
  try {
    console.log("Validating token with AuthService:", token.substring(0, 20) + "...");
    
    const response = await axios.post('http://localhost:8081/auth/validate', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log("Token validation successful:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Token validation error:", error.response?.data || error.message);
    return null;
  }
}

export async function GET(
  request: Request, 
  { params }: { params: IParams }
) {
  try {
    const { itemId } = params;

    if (!itemId || typeof itemId !== 'string') {
      throw new Error('Invalid ID');
    }

    const response = await axios.get(`http://localhost:9091/items/${itemId}`);
    
    // Transform the item to match frontend format
    const item = response.data;
    const transformedItem = {
      id: item.id,
      title: item.title,
      description: item.description,
      imageSrc: item.images && item.images.length > 0 ? item.images[0] : '/images/placeholder.jpg',
      locationValue: item.location || '',
      category: item.category,
      itemCount: 1,
      price: item.price,
      userId: item.userId,
      createdAt: item.createdAt,
      type: item.type,
      available: item.available,
      rating: item.rating,
      securityDeposit: item.securityDeposit,
      usagePolicy: item.usagePolicy,
      features: item.features || []
    };

    return NextResponse.json(transformedItem);
  } catch (error: any) {
    console.error("Error fetching item:", error);
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to fetch item" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request, 
  { params }: { params: IParams }
) {
  try {
    const { itemId } = params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "No valid authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userData = await validateToken(token);
    if (!userData) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!itemId || typeof itemId !== 'string') {
      throw new Error('Invalid ID');
    }

    const body = await request.json();
    
          const response = await axios.put(`http://localhost:9091/items/${itemId}`, body, {
      headers: {
        'X-USER-ID': userData.emailId,
        'Content-Type': 'application/json'
      }
    });

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error updating item:", error);
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: "Not authorized to update this item" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update item" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request, 
  { params }: { params: IParams }
) {
  try {
    const { itemId } = params;
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: "No valid authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const userData = await validateToken(token);
    if (!userData) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    if (!itemId || typeof itemId !== 'string') {
      throw new Error('Invalid ID');
    }

            await axios.delete(`http://localhost:9091/items/${itemId}`, {
      headers: {
        'X-USER-ID': userData.emailId
      }
    });

    return NextResponse.json({ message: "Item deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting item:", error);
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }
    if (error.response?.status === 403) {
      return NextResponse.json(
        { error: "Not authorized to delete this item" },
        { status: 403 }
      );
    }
    return NextResponse.json(
      { error: "Failed to delete item" },
      { status: 500 }
    );
  }
} 