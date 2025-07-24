import axios from "axios";

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
    const response = await axios.post('http://localhost:8081/auth/validate', {}, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (response.status === 200) {
      const userData = response.data;
      return {
        id: userData.emailId, // Using emailId as ID for consistency
        email: userData.emailId,
        name: userData.firstName || userData.username,
        image: null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        emailVerified: null,
        favoriteIds: []
      };
    }
    return null;
  } catch (error: any) {
    console.error("Error getting current user:", error);
    return null;
  }
}

