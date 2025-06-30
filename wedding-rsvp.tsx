"use client"

import { useState } from "react"
import type { Invitation, Guest, RsvpSubmission } from "./types/rsvp"
import { mockInvitations } from "./data/invitations"
import { InvitationSearch } from "./components/invitation-search"
import { RsvpForm } from "./components/rsvp-form"
import { RsvpConfirmation } from "./components/rsvp-confirmation"

type AppState = "search" | "form" | "confirmation"

export default function WeddingRsvp() {
  const [currentState, setCurrentState] = useState<AppState>("search")
  const [selectedInvitation, setSelectedInvitation] = useState<Invitation | null>(null)
  const [submittedGuests, setSubmittedGuests] = useState<Guest[]>([])
  const [invitations, setInvitations] = useState(mockInvitations)
  const [isUpdate, setIsUpdate] = useState(false)

  const handleInvitationFound = (invitation: Invitation) => {
    setSelectedInvitation(invitation)
    setIsUpdate(invitation.submissions.length > 0)
    setCurrentState("form")
  }

  const handleRsvpSubmit = (invitation: Invitation, guests: Guest[]) => {
    // Create new submission
    const newSubmission: RsvpSubmission = {
      id: `sub-${Date.now()}`,
      submittedAt: new Date(),
      submissionNumber: invitation.submissions.length + 1,
      guests: guests,
    }

    // Update the invitation with new submission
    const updatedInvitation = {
      ...invitation,
      rsvpStatus: invitation.submissions.length > 0 ? ("updated" as const) : ("completed" as const),
      submissions: [...invitation.submissions, newSubmission],
      currentSubmission: newSubmission,
    }

    // Update invitations list
    setInvitations((prev) => prev.map((inv) => (inv.id === invitation.id ? updatedInvitation : inv)))

    setSelectedInvitation(updatedInvitation)
    setSubmittedGuests(guests)
    setCurrentState("confirmation")
  }

  const handleStartOver = () => {
    setSelectedInvitation(null)
    setSubmittedGuests([])
    setIsUpdate(false)
    setCurrentState("search")
  }

  const handleBackToSearch = () => {
    setCurrentState("search")
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#fff2cc", color: "#294a46" }}>
      <div className="container mx-auto">
        {currentState === "search" && (
          <div className="space-y-4">
            <InvitationSearch invitations={invitations} onInvitationFound={handleInvitationFound} />
            <div className="text-center">
              <a
                href="/admin"
                className="text-xs text-gray-400 hover:text-gray-600 underline"
                style={{ fontSize: "10px" }}
              >
                Admin
              </a>
            </div>
          </div>
        )}

        {currentState === "form" && selectedInvitation && (
          <RsvpForm invitation={selectedInvitation} onBack={handleBackToSearch} onSubmit={handleRsvpSubmit} />
        )}

        {currentState === "confirmation" && selectedInvitation && (
          <RsvpConfirmation
            invitation={selectedInvitation}
            guests={submittedGuests}
            onStartOver={handleStartOver}
            isUpdate={isUpdate}
          />
        )}
      </div>
    </div>
  )
}
