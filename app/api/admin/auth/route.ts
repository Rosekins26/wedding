import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json()

    // Check against environment variable with multiple fallbacks
    const correctPassword = process.env.ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "Rosekins2026"

    // Debug logging (remove in production)
    console.log("Environment check:", {
      hasAdminPassword: !!process.env.ADMIN_PASSWORD,
      hasPublicAdminPassword: !!process.env.NEXT_PUBLIC_ADMIN_PASSWORD,
      nodeEnv: process.env.NODE_ENV,
    })

    if (password === correctPassword) {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }
  } catch (error) {
    console.error("Auth error:", error)
    return NextResponse.json({ error: "Invalid request" }, { status: 400 })
  }
}
