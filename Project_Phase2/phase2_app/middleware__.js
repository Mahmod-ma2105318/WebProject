import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

export async function middleware(request) {
    const { pathname } = request.nextUrl;

    if (pathname.startsWith("/Admin") || pathname.startsWith("/student") || pathname.startsWith("/Instructor")) {
        const token = request.cookies.get("auth-token")?.value;
        if (!token) {
            return NextResponse.redirect(new URL("/", request.url));
        }
        try {
            await jwtVerify(token, JWT_SECRET);
            return NextResponse.next();
        } catch (err) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/Admin/:path*", "/student/:path*", "/Instructor/:path*"]
};
