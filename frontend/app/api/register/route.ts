import { NextResponse } from "next/server";
import { buildUrl, apiClient, API_CONFIG } from "@/app/config/api";

export async function POST(
  request: Request, 
) {
  try {
    const body = await request.json();
    const { 
      email,
      name,
      password,
      firstName,
      lastName,
      phoneNumber,
      gender,
      dateOfBirth
    } = body;

    // Register user through AuthService
    const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.REGISTER);
    
    const userData = {
      emailId: email,
      username: name,
      password: password,
      firstName: firstName || name,
      lastName: lastName || '',
      phoneNumber: phoneNumber || '',
      gender: gender || '',
      dateOfBirth: dateOfBirth || ''
    };

    const response = await apiClient.post(url, userData);

    return NextResponse.json({ 
      success: true, 
      message: 'User registered successfully',
      user: {
        id: email,
        email: email,
        name: name
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
