import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const orderId = params.orderId;
    const authToken = request.headers.get("Authorization");

    if (!authToken) {
      return NextResponse.json(
        { error: "Authorization token required" },
        { status: 401 }
      );
    }

    // Forward the request to the backend OrderService
    const backendUrl = process.env.ORDER_SERVICE_URL || "http://localhost:8083";
    const response = await fetch(`${backendUrl}/orders/${orderId}/receipt`, {
      method: "GET",
      headers: {
        "Authorization": authToken,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || "Failed to download receipt" },
        { status: response.status }
      );
    }

    // Get the receipt data as blob
    const receiptData = await response.blob();

    // Return the receipt as a downloadable file
    return new NextResponse(receiptData, {
      status: 200,
      headers: {
        "Content-Disposition": `attachment; filename="receipt_${orderId}.pdf"`,
        "Content-Type": "application/pdf",
      },
    });

  } catch (error) {
    console.error("Error downloading receipt:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
} 