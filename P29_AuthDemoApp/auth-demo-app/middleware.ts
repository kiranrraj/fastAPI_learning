// File: middleware.ts

import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Public routes that do NOT require authentication
const publicRoutes = ["/gbeex/auth/login", "/gbeex/error"];

/**
 * Middleware runs before every request and determines:
 * - If user has a valid token, allow access.
 * - If route is public, allow access.
 * - Otherwise, redirect to login or error page.
 */
export async function middleware(req: NextRequest) {
    // Extracts the path part of the URL from the incoming request.
    const { pathname } = req.nextUrl;

    // Allow access to public routes without token
    if (publicRoutes.includes(pathname)) {
        console.log(`[Middleware] Public access allowed: ${pathname}`);
        return NextResponse.next();
    }

    try {
        // Try to extract JWT from the request
        const token = await getToken({
            req,
            secret: process.env.NEXTAUTH_SECRET,
        });

        if (!token) {
            // No token means unauthorized, redirect to login
            console.warn(`[Middleware] No token, redirecting: ${pathname}`);
            // Constructs a full absolute URL for redirection to the login page. #Absolute path is must
            const loginUrl = new URL("/gbeex/auth/login", req.url);
            return NextResponse.redirect(loginUrl);
        }

        // Token is valid then allow access to protected route
        console.log(`[Middleware] Authenticated user accessing: ${pathname}`);
        return NextResponse.next();
    } catch (error) {
        // If error, redirect to error page
        console.error("[Middleware] Error occurred:", error);
        const errorUrl = new URL("/gbeex/error", req.url);
        return NextResponse.redirect(errorUrl);
    }
}

// apply middleware only to protected routes under /gbeex
export const config = {
    matcher: ["/gbeex/:path*"], // Only run middleware on these routes
};
