import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const ORDER_SERVICE_URL = process.env.ORDER_SERVICE_URL || "http://localhost:8083";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const authToken = request.headers.get("Authorization");
    const userEmail = request.headers.get("x-user-email");

    if (!authToken) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "User email required" },
        { status: 401 }
      );
    }

    // Forward the request to the backend OrderService
    const response = await fetch(`${ORDER_SERVICE_URL}/orders/${orderId}`, {
      method: "GET",
      headers: {
        "Authorization": authToken,
        "X-USER-EMAIL": userEmail,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to fetch order" },
        { status: response.status }
      );
    }

    const orderData = await response.json();
    return NextResponse.json(orderData);

  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 