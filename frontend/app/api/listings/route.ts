import { NextResponse } from "next/server";
import axios from "axios";

import prisma from "@/app/libs/prismadb";

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
    if (!userData) {
      console.error("Token validation failed");
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    console.log("User data from token:", userData);

    const body = await request.json();
    const {
      title,
      description,
      imageSrc,
      category,
      itemCount,
      location,
      price,
    } = body;

    console.log("Request body:", { title, description, imageSrc, category, itemCount, location, price });

    // Validate required fields
    if (!title || !description || !imageSrc || !category || !itemCount || !location || !price) {
      console.error("Missing required fields:", { title, description, imageSrc, category, itemCount, location, price });
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create or find user in the database
    let user = await prisma.user.findUnique({
      where: {
        email: userData.emailId || userData.email
      }
    });

    if (!user) {
      console.log("Creating new user in database:", userData.emailId || userData.email);
      // Create a new user if they don't exist in the database
      user = await prisma.user.create({
        data: {
          email: userData.emailId || userData.email,
          name: userData.firstName || userData.username || userData.emailId,
          image: userData.image || null,
        }
      });
    } else {
      console.log("Found existing user:", user.email);
    }

    const listing = await prisma.listing.create({
      data: {
        title,
        description,
        imageSrc,
        category,
        itemCount,
        locationValue: location.value,
        price: parseInt(price, 10),
        userId: user.id,
      },
    });

    console.log("Listing created successfully:", listing);
    return NextResponse.json(listing);
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}
