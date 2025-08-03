import { NextResponse } from "next/server";
import { buildUrl, apiClient, API_CONFIG } from "../../config/api";

// Function to validate JWT token with AuthService
async function validateToken(token: string) {
  try {
    console.log("Validating token with AuthService:", token.substring(0, 20) + "...");
    
    const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.VALIDATE_TOKEN);
    const userData = await apiClient.post(url, {}, {
      'Authorization': `Bearer ${token}`
    });
    
    console.log("Token validation successful:", userData);
    return userData;
  } catch (error: any) {
    console.error("Token validation error:", error);
    return null;
  }
}

export async function POST(request: Request) {
  try {
    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    console.log("Auth header received:", authHeader ? authHeader.substring(0, 20) + "..." : "None");
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error("Invalid authorization header:", authHeader);
      return NextResponse.json(
        { error: "No valid authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    console.log("Extracted token:", token.substring(0, 20) + "...");
    
    // Validate the token with AuthService
    const userData = await validateToken(token);
    let finalUserData;
    
    if (!userData) {
      console.error("Token validation failed");
      
      // Try to extract user email from the token itself or request headers
      const userEmail = request.headers.get('x-user-email');
      if (userEmail) {
        console.log("Using user email from request header:", userEmail);
        finalUserData = {
          emailId: userEmail,
          username: userEmail.split('@')[0],
          firstName: userEmail.split('@')[0],
          lastName: "User"
        };
      } else {
        console.error("No user email found in headers, cannot create item");
        return NextResponse.json(
          { error: "User authentication failed. Please login again." },
          { status: 401 }
        );
      }
    } else {
      finalUserData = userData;
      console.log("Using validated user data:", finalUserData);
    }

    console.log("User data from token:", finalUserData);
    console.log("User email being used for item creation:", finalUserData.emailId);

    const body = await request.json();
    const {
      title,
      description,
      price,
      category,
      location,
      images,
      features,
      usagePolicy,
      securityDeposit,
      type = "RENT", // Default to RENT
      quantity = 1 // Default quantity is 1
    } = body;

    console.log("Request body:", { title, description, price, category, location, images, features, usagePolicy, securityDeposit, type, quantity });

    // Validate required fields
    if (!title || !description || !price || !category || !location) {
      console.error("Missing required fields:", { title, description, price, category, location });
      return NextResponse.json(
        { error: "Missing required fields: title, description, price, category, location" },
        { status: 400 }
      );
    }

    // Create item payload for ItemService
    const itemPayload = {
      title,
      description,
      price: parseFloat(price),
      category,
      location,
      images: images || [],
      features: features || [],
      usagePolicy: usagePolicy || "",
      securityDeposit: securityDeposit ? parseFloat(securityDeposit) : 0.0,
      type: type.toUpperCase(),
      quantity: parseInt(quantity) || 1,
      available: true
    };

    console.log("Sending item payload to ItemService:", itemPayload);

    // Send to ItemService
    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
    const createdItem = await apiClient.post(url, itemPayload, {
      'X-USER-ID': finalUserData.emailId,
      'Content-Type': 'application/json'
    });

    console.log("Item created successfully:", createdItem);
    return NextResponse.json(createdItem);
  } catch (error: any) {
    console.error("Error creating item:", error);
    return NextResponse.json(
      { error: "Failed to create item" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const category = searchParams.get('category');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');
    const location = searchParams.get('location');
    const query = searchParams.get('query');

          let url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);

    // Build query parameters
    const params = new URLSearchParams();
    if (type) params.append('type', type);
    if (category) params.append('category', category);
    if (minPrice) params.append('minPrice', minPrice);
    if (maxPrice) params.append('maxPrice', maxPrice);
    if (location) params.append('location', location);
    if (query) params.append('query', query);

    if (params.toString()) {
      url += '?' + params.toString();
    }

    console.log("Fetching items from:", url);

    const items = await apiClient.get(url);
    
    // Add cache-busting headers to prevent caching
    const response = NextResponse.json(items);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;
  } catch (error: any) {
    console.error("Error fetching items:", error);
    return NextResponse.json(
      { error: "Failed to fetch items" },
      { status: 500 }
    );
  }
} 