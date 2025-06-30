import { type NextRequest, NextResponse } from "next/server"
import { getInvitations, createInvitation } from "../../../lib/database"

export async function GET() {
  try {
    const invitations = await getInvitations()
    return NextResponse.json(invitations)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch invitations" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const invitation = await request.json()
    const newInvitation = await createInvitation(invitation)
    return NextResponse.json(newInvitation)
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to create invitation" }, { status: 500 })
  }
}
