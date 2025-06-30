import { NextResponse } from "next/server"
import { getAllRsvpResponses } from "../../../../lib/database"

export async function GET() {
  try {
    const responses = await getAllRsvpResponses()

    // Group responses by invitation
    const groupedResponses = responses.reduce((acc: any, row: any) => {
      const invitationId = row.id

      if (!acc[invitationId]) {
        acc[invitationId] = {
          invitation: {
            id: row.id,
            primaryGuestName: row.primary_guest_name,
            email: row.email,
            partySize: row.party_size,
            invitationType: row.invitation_type,
            rsvpStatus: row.rsvp_status,
          },
          guests: [],
        }
      }

      if (row.guest_name) {
        acc[invitationId].guests.push({
          name: row.guest_name,
          events: {
            bowling: row.bowling,
            beersAndCheers: row.beers_and_cheers,
            ceremony: row.ceremony,
            cocktailHour: row.cocktail_hour,
            reception: row.reception,
            afterPartyBrunch: row.after_party_brunch,
          },
          entreeSelection: {
            beef: row.entree_beef,
            fish: row.entree_fish,
            vegetarianVegan: row.entree_vegetarian_vegan,
            kidsChicken: row.entree_kids_chicken,
          },
          dietaryRestrictions: {
            vegetarian: row.vegetarian,
            vegan: row.vegan,
            glutenFree: row.gluten_free,
            dairyFree: row.dairy_free,
            nutAllergy: row.nut_allergy,
            shellfish: row.shellfish,
            kosher: row.kosher,
            halal: row.halal,
            other: row.other_dietary,
          },
        })
      }

      return acc
    }, {})

    return NextResponse.json(Object.values(groupedResponses))
  } catch (error) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Failed to fetch responses" }, { status: 500 })
  }
}
