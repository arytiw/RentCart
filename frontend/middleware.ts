// Middleware for protected routes
export function middleware(request: any) {
  // For now, just pass through - authentication is handled at the component level
  return;
}

export const config = {
  matcher: ["/bookings", "/reservations", "/properties", "/rental-bookings"],
};
