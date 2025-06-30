import { type NextRequest, NextResponse } from "next/server"
import { initializeDatabase, seedSampleData, checkDatabaseConnection } from "../../../../lib/database-setup"

export async function POST(request: NextRequest) {
  try {
    const { action, adminPassword } = await request.json()

    // Verify admin password
    const correctPassword = process.env.ADMIN_PASSWORD || "Rosekins2026"
    if (adminPassword !== correctPassword) {
      return NextResponse.json({ error: "Invalid admin password" }, { status: 401 })
    }

    let result

    switch (action) {
      case "check-connection":
        result = await checkDatabaseConnection()
        break
      case "initialize":
        result = await initializeDatabase()
        break
      case "seed":
        result = await seedSampleData()
        break
      case "full-setup":
        // Run all setup steps
        const connectionResult = await checkDatabaseConnection()
        if (!connectionResult.success) {
          return NextResponse.json(connectionResult, { status: 500 })
        }

        const initResult = await initializeDatabase()
        if (!initResult.success) {
          return NextResponse.json(initResult, { status: 500 })
        }

        const seedResult = await seedSampleData()
        result = {
          success: true,
          message: "Database fully initialized with sample data",
          details: {
            connection: connectionResult,
            initialization: initResult,
            seeding: seedResult,
          },
        }
        break
      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Setup API Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Setup failed",
        details: error.message,
      },
      { status: 500 },
    )
  }
}
