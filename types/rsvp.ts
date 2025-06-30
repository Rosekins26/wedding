export interface Guest {
  name: string
  events: {
    bowling: boolean
    beersAndCheers: boolean
    ceremony: boolean
    cocktailHour: boolean
    reception: boolean
    afterPartyBrunch: boolean
  }
  entreeSelection: {
    beef: boolean
    fish: boolean
    vegetarianVegan: boolean
    kidsChicken: boolean
  }
  dietaryRestrictions: {
    vegetarian: boolean
    vegan: boolean
    glutenFree: boolean
    dairyFree: boolean
    nutAllergy: boolean
    shellfish: boolean
    kosher: boolean
    halal: boolean
    other: string
  }
}

export interface RsvpSubmission {
  id: string
  submittedAt: Date
  guests: Guest[]
  submissionNumber: number
}

export type InvitationType = "standard" | "family" | "bridal-party" | "plus-one"

export interface Invitation {
  id: string
  primaryGuestName: string
  email: string
  partySize: number
  rsvpStatus: "pending" | "completed" | "updated"
  submissions: RsvpSubmission[]
  currentSubmission?: RsvpSubmission
  invitationType: InvitationType
  metadata?: {
    phone?: string
    address?: string
    specialNotes?: string
    tableAssignment?: string
    invitationSentDate?: Date
    rsvpDeadline?: Date
    createdAt?: Date
  }
}

export interface WeddingEvents {
  bowling: string
  beersAndCheers: string
  ceremony: string
  cocktailHour: string
  reception: string
  afterPartyBrunch: string
}

export interface EventAccess {
  bowling: boolean
  beersAndCheers: boolean
  ceremony: boolean
  cocktailHour: boolean
  reception: boolean
  afterPartyBrunch: boolean
}

// Define which events each invitation type can access
export const INVITATION_TYPE_ACCESS: Record<InvitationType, EventAccess> = {
  standard: {
    bowling: false,
    beersAndCheers: true,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    afterPartyBrunch: false,
  },
  family: {
    bowling: false,
    beersAndCheers: true,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    afterPartyBrunch: true,
  },
  "bridal-party": {
    bowling: true,
    beersAndCheers: true,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    afterPartyBrunch: false,
  },
  "plus-one": {
    bowling: false,
    beersAndCheers: true,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    afterPartyBrunch: false,
  },
}
