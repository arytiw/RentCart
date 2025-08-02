import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { email: string } }
) {
  try {
    const email = decodeURIComponent(params.email);
    console.log("Fetching items for user email:", email);
    console.log("Email type:", typeof email);
    console.log("Email length:", email?.length);
    
    const response = await fetch(`http://localhost:9091/items/user/${encodeURIComponent(email)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    console.log("ItemService response status:", response.status);
    
    if (!response.ok) {
      if (response.status === 404) {
        console.log("No items found for user (404)");
        return NextResponse.json([]);
      }
      const errorText = await response.text();
      console.error("ItemService error:", response.status, errorText);
      return NextResponse.json(
        { error: `Failed to fetch user items: ${response.status}` },
        { status: response.status }
      );
    }
    
    const items = await response.json();
    console.log("Items fetched from ItemService:", items);
    
    return NextResponse.json(items);
  } catch (error: any) {
    console.error("Error fetching user items:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
