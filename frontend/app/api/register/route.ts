import { NextResponse } from "next/server";
import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

export async function POST(
  request: Request, 
) {
  try {
    const body = await request.json();
    const { 
      username,
      firstName,
      lastName,
      emailId,
      password,
      phoneNumber,
      gender,
      dateOfBirth,
      address
    } = body;

    // Register user through AuthService
    const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.REGISTER);
    
    const userData = {
      username: username,
      firstName: firstName,
      lastName: lastName,
      emailId: emailId,
      password: password,
      phoneNumber: phoneNumber || '',
      gender: gender || '',
      dateOfBirth: dateOfBirth || '',
      address: address || null
    };

    const response = await apiClient.post(url, userData);

    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        username: username,
        emailId: emailId,
        firstName: firstName,
        lastName: lastName
      }
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return NextResponse.json(
      { error: 'Failed to register user' },
      { status: 500 }
    );
  }
}
