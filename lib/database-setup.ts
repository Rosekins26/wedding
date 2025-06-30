import { sql } from "./database"

// Database initialization functions
export async function initializeDatabase() {
  try {
    console.log("🚀 Initializing database tables...")

    // Create invitations table
    await sql`
      CREATE TABLE IF NOT EXISTS invitations (
        id VARCHAR(255) PRIMARY KEY,
        primary_guest_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        party_size INTEGER NOT NULL,
        rsvp_status VARCHAR(50) DEFAULT 'pending',
        invitation_type VARCHAR(50) NOT NULL,
        phone VARCHAR(50),
        address TEXT,
        special_notes TEXT,
        table_assignment VARCHAR(100),
        invitation_sent_date DATE,
        rsvp_deadline DATE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `

    // Create rsvp_submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS rsvp_submissions (
        id VARCHAR(255) PRIMARY KEY,
        invitation_id VARCHAR(255) REFERENCES invitations(id),
        submission_number INTEGER NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_current BOOLEAN DEFAULT true
      )
    `

    // Create guests table with updated entrée columns
    await sql`
      CREATE TABLE IF NOT EXISTS guests (
        id VARCHAR(255) PRIMARY KEY,
        submission_id VARCHAR(255) REFERENCES rsvp_submissions(id),
        name VARCHAR(255) NOT NULL,
        bowling BOOLEAN DEFAULT false,
        beers_and_cheers BOOLEAN DEFAULT false,
        ceremony BOOLEAN DEFAULT false,
        cocktail_hour BOOLEAN DEFAULT false,
        reception BOOLEAN DEFAULT false,
        after_party_brunch BOOLEAN DEFAULT false,
        entree_beef BOOLEAN DEFAULT false,
        entree_fish BOOLEAN DEFAULT false,
        entree_vegetarian_vegan BOOLEAN DEFAULT false,
        entree_kids_chicken BOOLEAN DEFAULT false,
        vegetarian BOOLEAN DEFAULT false,
        vegan BOOLEAN DEFAULT false,
        gluten_free BOOLEAN DEFAULT false,
        dairy_free BOOLEAN DEFAULT false,
        nut_allergy BOOLEAN DEFAULT false,
        shellfish BOOLEAN DEFAULT false,
        kosher BOOLEAN DEFAULT false,
        halal BOOLEAN DEFAULT false,
        other_dietary TEXT
      )
    `

    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_invitations_email ON invitations(email)`
    await sql`CREATE INDEX IF NOT EXISTS idx_invitations_name ON invitations(primary_guest_name)`
    await sql`CREATE INDEX IF NOT EXISTS idx_submissions_invitation ON rsvp_submissions(invitation_id)`
    await sql`CREATE INDEX IF NOT EXISTS idx_guests_submission ON guests(submission_id)`

    console.log("✅ Database tables created successfully!")
    return { success: true, message: "Database initialized successfully" }
  } catch (error) {
    console.error("❌ Database initialization error:", error)
    return { success: false, error: error.message }
  }
}

export async function seedSampleData() {
  try {
    console.log("🌱 Seeding sample invitation data...")

    // Check if data already exists
    const existingInvitations = await sql`SELECT COUNT(*) as count FROM invitations`
    if (existingInvitations[0].count > 0) {
      console.log("📋 Sample data already exists, skipping seed...")
      return { success: true, message: "Sample data already exists" }
    }

    // Insert sample invitations
    const sampleInvitations = [
      {
        id: "1",
        primary_guest_name: "John Smith",
        email: "john.smith@email.com",
        party_size: 2,
        invitation_type: "family",
      },
      {
        id: "2",
        primary_guest_name: "Sarah Johnson",
        email: "sarah.johnson@email.com",
        party_size: 4,
        invitation_type: "standard",
      },
      {
        id: "3",
        primary_guest_name: "Michael Brown",
        email: "michael.brown@email.com",
        party_size: 1,
        invitation_type: "bridal-party",
      },
      {
        id: "4",
        primary_guest_name: "Emily Davis",
        email: "emily.davis@email.com",
        party_size: 3,
        invitation_type: "plus-one",
      },
    ]

    for (const invitation of sampleInvitations) {
      await sql`
        INSERT INTO invitations (id, primary_guest_name, email, party_size, invitation_type, created_at)
        VALUES (${invitation.id}, ${invitation.primary_guest_name}, ${invitation.email}, 
                ${invitation.party_size}, ${invitation.invitation_type}, NOW())
        ON CONFLICT (id) DO NOTHING
      `
    }

    console.log("✅ Sample data seeded successfully!")
    return { success: true, message: "Sample data seeded successfully" }
  } catch (error) {
    console.error("❌ Sample data seeding error:", error)
    return { success: false, error: error.message }
  }
}

export async function checkDatabaseConnection() {
  try {
    console.log("🔍 Checking database connection...")
    const result = await sql`SELECT NOW() as current_time`
    console.log("✅ Database connection successful!", result[0])
    return { success: true, message: "Database connection successful" }
  } catch (error) {
    console.error("❌ Database connection error:", error)
    return { success: false, error: error.message }
  }
}
