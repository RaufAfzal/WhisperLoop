import { NextRequest, NextResponse } from 'next/server'
import { getToken } from "next-auth/jwt"

export { default } from "next-auth/middleware"

// Adjust the middleware function
export async function middleware(request: NextRequest) {
    const token = await getToken({ req: request })
    const url = request.nextUrl

    // Check if there's a token
    if (token) {
        // Redirect authenticated users away from auth pages
        if (url.pathname.startsWith('/sign-in') || url.pathname.startsWith('/sign-up')) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }
    } else {
        // If there's no token, check if the user is accessing a protected route
        if (url.pathname.startsWith('/dashboard')) {
            return NextResponse.redirect(new URL('/home', request.url))
        }
    }

    // If none of the above conditions are met, proceed to the requested page
    return NextResponse.next();
}

// Define the paths that this middleware applies to
export const config = {
    matcher: [
        '/sign-in',
        '/sign-up',
        '/dashboard/:path*',
        '/verify/:path*'
    ]
}
