import axios from "axios";

export default async function getCurrentUser() {
  try {
    // Get token from localStorage (client-side) or headers (server-side)
    let token = null;
    
    if (typeof window !== 'undefined') {
      // Client-side
      token = localStorage.getItem('authToken');
    } else {
      // Server-side - we'll need to pass token through headers
      // For now, return null as server-side auth needs different handling
      return null;
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

