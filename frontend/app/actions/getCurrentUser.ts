import { buildUrl, apiClient, API_CONFIG } from '../config/api';

export default async function getCurrentUser(tokenArg?: string) {
  try {
    // Use provided token or get from localStorage (client-side)
    let token = tokenArg || null;
    if (!token && typeof window !== 'undefined') {
      token = localStorage.getItem('authToken');
    }
    if (!token) {
      return null;
    }
    
    // Validate token with AuthService
    const url = buildUrl('AUTH_SERVICE', API_CONFIG.ENDPOINTS.VALIDATE_TOKEN);
    const userData = await apiClient.post(url, {}, {
      'Authorization': `Bearer ${token}`
    });
    
    return {
      id: userData.emailId, // Using emailId as ID for consistency
      email: userData.emailId,
      emailId: userData.emailId, // ensure emailId is present
      username: userData.username, // Include username
      firstName: userData.firstName, // Include firstName
      lastName: userData.lastName, // Include lastName
      phoneNumber: userData.phoneNumber, // Include phoneNumber
      gender: userData.gender, // Include gender
      dateOfBirth: userData.dateOfBirth, // Include dateOfBirth
      name: userData.firstName || userData.username,
      image: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      emailVerified: null,
      favoriteIds: [],
      hashedPassword: null // Add this line to satisfy SafeUser type
    };
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return null;
  }
}

