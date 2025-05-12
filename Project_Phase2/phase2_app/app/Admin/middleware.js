// middleware.js (at project root)
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";  // using jose for JWT verification in Edge runtime

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Apply auth check to protected routes (e.g., any path under /Admin)
  if (pathname.startsWith("/Admin")) {
    const token = request.cookies.get("auth-token")?.value;
    if (!token) {
      // No JWT cookie present, redirect to login
      return NextResponse.redirect(new URL("/login", request.url));
    }
    try {
      // Verify the JWT (will throw if invalid or expired)
      await jwtVerify(token, JWT_SECRET);
      // Token is valid – allow request to proceed
      return NextResponse.next();
    } catch (err) {
      // Token verification failed
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  // For non-protected routes, proceed normally
  return NextResponse.next();
}

// Optionally, limit middleware to specific paths using matcher
export const config = {
  matcher: ["/Admin/:path*"]
};
