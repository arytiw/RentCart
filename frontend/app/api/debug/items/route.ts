import { NextRequest, NextResponse } from "next/server";
import { buildUrl, API_CONFIG } from '../../../config/api';

export async function GET(request: NextRequest) {
  try {
    console.log("Debug API: Testing ItemService connection...");
    
    const url = buildUrl('ITEM_SERVICE', API_CONFIG.ENDPOINTS.ITEMS);
    console.log("Debug API: URL:", url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log("Debug API: Response status:", response.status);
    console.log("Debug API: Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Debug API: Error response:", errorText);
      return NextResponse.json({
        error: `ItemService returned ${response.status}`,
        details: errorText,
        url: url
      }, { status: response.status });
    }
    
    const data = await response.json();
    console.log("Debug API: Success response:", data);
    
    return NextResponse.json({
      success: true,
      itemCount: Array.isArray(data) ? data.length : 0,
      items: data,
      url: url
    });
    
  } catch (error: any) {
    console.error("Debug API: Exception:", error);
    return NextResponse.json({
      error: "Failed to connect to ItemService",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  }
} 