import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// Routes that require authentication
const PROTECTED_ROUTES = [
  "/dashboard",
]

// Routes that should redirect to dashboard if already logged in
const AUTH_ROUTES = [
  "/auth/signin",
]

// Lightweight gate that must not pull Node-only modules into the Edge bundle.
// Actual authorization is enforced by the page-level useSession() guard and
// by every authenticated API route via NextAuth.
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Allow signout route without any restrictions
  if (pathname === "/auth/signout" || pathname.startsWith("/auth/signout")) {
    return NextResponse.next()
  }
  
  // Allow /dashboard/create without authentication (free event creation)
  if (pathname.startsWith("/dashboard/create")) {
    return NextResponse.next()
  }
  
  // A valid NextAuth session always carries the session token cookie.
  const sessionCookie = request.cookies.get("authjs.session-token")?.value
    || request.cookies.get("__Secure-authjs.session-token")?.value
  
  // Check if accessing protected route
  const isProtectedRoute = PROTECTED_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route + '/')
  )
  
  // Check if accessing auth route
  const isAuthRoute = AUTH_ROUTES.some(route => pathname.startsWith(route))
  
  if (isProtectedRoute && !sessionCookie) {
    // Redirect to sign in if not authenticated
    return NextResponse.redirect(new URL("/auth/signin", request.url))
  }
  
  if (isAuthRoute && sessionCookie) {
    // Redirect to dashboard if already authenticated
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }
  
  return NextResponse.next()
}

// Configure which paths middleware should run on
export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*"],
}
