import type { Invitation } from "../types/rsvp"

// Mock data - in a real app, this would come from a database
export const mockInvitations: Invitation[] = [
  {
    id: "1",
    primaryGuestName: "John Smith",
    email: "john.smith@email.com",
    partySize: 2,
    rsvpStatus: "completed",
    invitationType: "family",
    submissions: [
      {
        id: "sub-1",
        submittedAt: new Date("2024-01-15T10:30:00"),
        submissionNumber: 1,
        guests: [
          {
            name: "John Smith",
            events: {
              bowling: false,
              beersAndCheers: false,
              ceremony: true,
              cocktailHour: true,
              reception: true,
              afterPartyBrunch: true,
            },
            entreeSelection: {
              beef: true,
              fish: false,
              vegetarianVegan: false,
              kidsChicken: false,
            },
            dietaryRestrictions: {
              vegetarian: true,
              vegan: false,
              glutenFree: false,
              dairyFree: false,
              nutAllergy: false,
              shellfish: false,
              kosher: false,
              halal: false,
              other: "",
            },
          },
          {
            name: "Jane Smith",
            events: {
              bowling: false,
              beersAndCheers: true,
              ceremony: true,
              cocktailHour: true,
              reception: true,
              afterPartyBrunch: true,
            },
            entreeSelection: {
              beef: false,
              fish: true,
              vegetarianVegan: false,
              kidsChicken: false,
            },
            dietaryRestrictions: {
              vegetarian: false,
              vegan: false,
              glutenFree: true,
              dairyFree: false,
              nutAllergy: false,
              shellfish: false,
              kosher: false,
              halal: false,
              other: "",
            },
          },
        ],
      },
    ],
  },
  {
    id: "2",
    primaryGuestName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    partySize: 4,
    rsvpStatus: "pending",
    invitationType: "standard",
    submissions: [],
  },
  {
    id: "3",
    primaryGuestName: "Michael Brown",
    email: "michael.brown@email.com",
    partySize: 1,
    rsvpStatus: "pending",
    invitationType: "bridal-party",
    submissions: [],
  },
  {
    id: "4",
    primaryGuestName: "Emily Davis",
    email: "emily.davis@email.com",
    partySize: 3,
    rsvpStatus: "pending",
    invitationType: "standard",
    submissions: [],
  },
]

// Set current submission for invitations that have submissions
mockInvitations.forEach((invitation) => {
  if (invitation.submissions.length > 0) {
    invitation.currentSubmission = invitation.submissions[invitation.submissions.length - 1]
  }
})
