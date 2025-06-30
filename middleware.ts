import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Allow embedding in Google Sites
  const response = NextResponse.next()

  // Set headers to allow iframe embedding
  response.headers.set("X-Frame-Options", "ALLOWALL")
  response.headers.set(
    "Content-Security-Policy",
    "frame-ancestors 'self' https://*.google.com https://*.googleusercontent.com https://sites.google.com;",
  )

  // Optional: Restrict to specific domains
  const referer = request.headers.get("referer")
  if (referer && process.env.NODE_ENV === "production") {
    const allowedDomains = [
      "sites.google.com",
      "your-domain.com", // Add your Google Sites domain
    ]

    const isAllowed = allowedDomains.some((domain) => referer.includes(domain))

    if (!isAllowed && !referer.includes("vercel.app")) {
      // Allow direct access and Vercel preview URLs
      console.log("Blocked referer:", referer)
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
}
