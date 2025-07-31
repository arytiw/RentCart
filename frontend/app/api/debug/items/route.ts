import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log("Testing ItemService connection...");
    
    // Test 1: Check if ItemService is reachable
    const testResponse = await fetch('http://localhost:9091/items', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store'
    });
    
    console.log("ItemService test response status:", testResponse.status);
    
    if (!testResponse.ok) {
      const errorText = await testResponse.text();
      console.error("ItemService test failed:", errorText);
      return NextResponse.json({
        error: "ItemService not reachable",
        status: testResponse.status,
        details: errorText
      }, { status: 500 });
    }
    
    const items = await testResponse.json();
    console.log("All items from ItemService:", items);
    
    // Test 2: Check if we can create a test item
    const testItem = {
      title: "Test Item",
      description: "This is a test item for debugging",
      price: 100,
      category: "Electronics",
      location: "Mumbai",
      images: [],
      features: [],
      usagePolicy: "",
      securityDeposit: 0,
      type: "RENT",
      quantity: 1,
      available: true
    };
    
    const createResponse = await fetch('http://localhost:9091/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': 'test@example.com'
      },
      body: JSON.stringify(testItem)
    });
    
    console.log("Create test item response status:", createResponse.status);
    
    if (createResponse.ok) {
      const createdItem = await createResponse.json();
      console.log("Test item created:", createdItem);
      
      // Test 3: Check if we can fetch items by user
      const userItemsResponse = await fetch('http://localhost:9091/items/user/test@example.com', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      console.log("User items response status:", userItemsResponse.status);
      
      if (userItemsResponse.ok) {
        const userItems = await userItemsResponse.json();
        console.log("User items:", userItems);
      }
    }
    
    return NextResponse.json({
      success: true,
      message: "ItemService is working",
      allItems: items,
      testItemCreated: createResponse.ok
    });
    
  } catch (error: any) {
    console.error("Debug test failed:", error);
    return NextResponse.json({
      error: "Debug test failed",
      details: error.message
    }, { status: 500 });
  }
} 