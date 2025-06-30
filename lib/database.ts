// Database connection utility
// Choose one based on your database provider

// Option 1: Supabase
// import { createClient } from "@supabase/supabase-js"

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// export const supabase = createClient(supabaseUrl, supabaseKey)

// Option 2: Vercel Postgres
// import { sql } from "@vercel/postgres"

// export { sql }

// Option 3: PlanetScale (MySQL)
// import { connect } from "@planetscale/database"

// export const db = connect({
//   url: process.env.DATABASE_URL,
// })

// Option 4: Neon (PostgreSQL)
import { neon } from "@neondatabase/serverless"

// Use the existing POSTGRES_URL instead of DATABASE_URL
export const sql = neon(process.env.POSTGRES_URL!)

// Database operations
export async function getInvitations() {
  try {
    const result = await sql`SELECT * FROM invitations ORDER BY created_at DESC`
    return result
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

export async function getInvitationByName(name: string) {
  try {
    const result = await sql`
      SELECT * FROM invitations 
      WHERE LOWER(primary_guest_name) LIKE LOWER(${"%" + name + "%"})
      LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

export async function createInvitation(invitation: any) {
  try {
    const result = await sql`
      INSERT INTO invitations (
        id, primary_guest_name, email, party_size, invitation_type,
        phone, address, special_notes, table_assignment,
        invitation_sent_date, rsvp_deadline, created_at
      ) VALUES (
        ${invitation.id}, ${invitation.primaryGuestName}, ${invitation.email},
        ${invitation.partySize}, ${invitation.invitationType},
        ${invitation.metadata?.phone || null}, ${invitation.metadata?.address || null},
        ${invitation.metadata?.specialNotes || null}, ${invitation.metadata?.tableAssignment || null},
        ${invitation.metadata?.invitationSentDate || null}, ${invitation.metadata?.rsvpDeadline || null},
        NOW()
      )
      RETURNING *
    `
    return result[0]
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

export async function createRsvpSubmission(invitationId: string, guests: any[]) {
  try {
    // Create submission record
    const submissionResult = await sql`
      INSERT INTO rsvp_submissions (id, invitation_id, submission_number, submitted_at, is_current)
      VALUES (
        ${`sub-${Date.now()}`}, ${invitationId}, 
        (SELECT COALESCE(MAX(submission_number), 0) + 1 FROM rsvp_submissions WHERE invitation_id = ${invitationId}),
        NOW(), true
      )
      RETURNING *
    `

    const submission = submissionResult[0]

    // Mark previous submissions as not current
    await sql`
      UPDATE rsvp_submissions 
      SET is_current = false 
      WHERE invitation_id = ${invitationId} AND id != ${submission.id}
    `

    // Insert guests with updated entrée columns
    for (const guest of guests) {
      await sql`
        INSERT INTO guests (
          id, submission_id, name,
          bowling, beers_and_cheers, ceremony, cocktail_hour, reception, after_party_brunch,
          entree_beef, entree_fish, entree_vegetarian_vegan, entree_kids_chicken,
          vegetarian, vegan, gluten_free, dairy_free, nut_allergy, shellfish, kosher, halal, other_dietary
        ) VALUES (
          ${`guest-${Date.now()}-${Math.random()}`}, ${submission.id}, ${guest.name},
          ${guest.events.bowling}, ${guest.events.beersAndCheers}, ${guest.events.ceremony},
          ${guest.events.cocktailHour}, ${guest.events.reception}, ${guest.events.afterPartyBrunch},
          ${guest.entreeSelection?.beef || false}, ${guest.entreeSelection?.fish || false}, 
          ${guest.entreeSelection?.vegetarianVegan || false}, ${guest.entreeSelection?.kidsChicken || false},
          ${guest.dietaryRestrictions.vegetarian}, ${guest.dietaryRestrictions.vegan},
          ${guest.dietaryRestrictions.glutenFree}, ${guest.dietaryRestrictions.dairyFree},
          ${guest.dietaryRestrictions.nutAllergy}, ${guest.dietaryRestrictions.shellfish},
          ${guest.dietaryRestrictions.kosher}, ${guest.dietaryRestrictions.halal},
          ${guest.dietaryRestrictions.other || null}
        )
      `
    }

    // Update invitation status
    await sql`
      UPDATE invitations 
      SET rsvp_status = 'completed', updated_at = NOW()
      WHERE id = ${invitationId}
    `

    return submission
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}

export async function getAllRsvpResponses() {
  try {
    const result = await sql`
      SELECT 
        i.*,
        s.id as submission_id, s.submission_number, s.submitted_at,
        g.name as guest_name,
        g.bowling, g.beers_and_cheers, g.ceremony, g.cocktail_hour, g.reception, g.after_party_brunch,
        g.entree_beef, g.entree_fish, g.entree_vegetarian_vegan, g.entree_kids_chicken,
        g.vegetarian, g.vegan, g.gluten_free, g.dairy_free, g.nut_allergy, g.shellfish, g.kosher, g.halal, g.other_dietary
      FROM invitations i
      LEFT JOIN rsvp_submissions s ON i.id = s.invitation_id AND s.is_current = true
      LEFT JOIN guests g ON s.id = g.submission_id
      ORDER BY i.primary_guest_name, g.name
    `
    return result
  } catch (error) {
    console.error("Database error:", error)
    throw error
  }
}
