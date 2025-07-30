import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes that require authentication
const protectedRoutes = ['/bookings', '/reservations', '/properties', '/favorites', '/dashboard']

export function middleware(request: NextRequest) {
  // For now, we'll allow all requests to pass through
  // In a production environment, you would check for authentication tokens
  // or session cookies here and redirect to login if not authenticated
  
  const { pathname } = request.nextUrl
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute) {
    // Here you would typically check for authentication
    // For now, we'll let the client-side handle authentication redirects
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/bookings/:path*", "/reservations/:path*", "/properties/:path*", "/favorites/:path*", "/dashboard/:path*"],
}
