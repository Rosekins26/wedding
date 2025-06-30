"use client"

import { useState } from "react"
import type { Invitation, Guest, WeddingEvents } from "../types/rsvp"
import { GuestForm } from "./guest-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send, RefreshCw, Crown, Heart, Users, UserPlus } from "lucide-react"

interface RsvpFormProps {
  invitation: Invitation
  onBack: () => void
  onSubmit: (invitation: Invitation, guests: Guest[]) => void
}

const weddingEvents: WeddingEvents = {
  bowling: "Friday: Bowling, let the weekend begin as the couple rolls to forever",
  beersAndCheers: "Saturday: Beers and Cheers with Bride and Groom (12:00 PM - 3:00 PM)",
  ceremony: "Sunday: Wedding Ceremony (4:30 PM)",
  cocktailHour: "Sunday: Cocktail Hour (5:00 PM)",
  reception: "Sunday: Reception Dinner (6:00 PM - 10:00 PM)",
  afterPartyBrunch: "Monday: After party brunch to end the weekend!",
}

export function RsvpForm({ invitation, onBack, onSubmit }: RsvpFormProps) {
  const [guests, setGuests] = useState<Guest[]>(() => {
    // Pre-populate with existing data if available
    if (invitation.currentSubmission) {
      return invitation.currentSubmission.guests
    }

    return Array.from({ length: invitation.partySize }, () => ({
      name: "",
      events: {
        bowling: false,
        beersAndCheers: false,
        ceremony: false,
        cocktailHour: false,
        reception: false,
        afterPartyBrunch: false,
      },
      entreeSelection: {
        beef: false,
        fish: false,
        vegetarianVegan: false,
        kidsChicken: false,
      },
      dietaryRestrictions: {
        vegetarian: false,
        vegan: false,
        glutenFree: false,
        dairyFree: false,
        nutAllergy: false,
        shellfish: false,
        kosher: false,
        halal: false,
        other: "",
      },
    }))
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<string[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const isUpdate = invitation.submissions.length > 0
  const submissionCount = invitation.submissions.length

  const handleGuestChange = (index: number, updatedGuest: Guest) => {
    const newGuests = [...guests]
    newGuests[index] = updatedGuest
    setGuests(newGuests)
  }

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    guests.forEach((guest, index) => {
      if (!guest.name.trim()) {
        newErrors.push(`Guest ${index + 1}: Name is required`)
      }

      const hasSelectedEvent = Object.values(guest.events).some((selected) => selected)
      if (!hasSelectedEvent) {
        newErrors.push(`Guest ${index + 1}: Please select at least one event`)
      }

      // Check if attending Sunday reception and no entrée selected
      if (guest.events.reception) {
        const hasSelectedEntree = Object.values(guest.entreeSelection).some((selected) => selected)
        if (!hasSelectedEntree) {
          newErrors.push(`Guest ${index + 1}: Please select an entrée for Sunday reception dinner`)
        }
      }
    })

    setErrors(newErrors)
    return newErrors.length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    onSubmit(invitation, guests)
    setIsSubmitting(false)
  }

  const resetToOriginal = () => {
    if (invitation.currentSubmission) {
      setGuests(invitation.currentSubmission.guests)
    }
  }

  const getInvitationTypeIcon = () => {
    switch (invitation.invitationType) {
      case "bridal-party":
        return <Crown className="w-4 h-4" />
      case "family":
        return <Heart className="w-4 h-4" />
      case "plus-one":
        return <UserPlus className="w-4 h-4" />
      default:
        return <Users className="w-4 h-4" />
    }
  }

  const getInvitationTypeLabel = () => {
    switch (invitation.invitationType) {
      case "bridal-party":
        return "Bridal Party"
      case "family":
        return "Family"
      case "plus-one":
        return "Plus One(s)"
      default:
        return "Standard"
    }
  }

  const getInvitationTypeBadgeColor = () => {
    switch (invitation.invitationType) {
      case "bridal-party":
        return "bg-purple-100 text-purple-800"
      case "family":
        return "bg-pink-100 text-pink-800"
      case "plus-one":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="mb-6" style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Search
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl font-bold" style={{ color: "#294a46" }}>
                {isUpdate ? "Update" : "RSVP for"} {invitation.primaryGuestName}
              </CardTitle>
              <CardDescription className="text-lg">
                Party size: {invitation.partySize} {invitation.partySize === 1 ? "guest" : "guests"}
              </CardDescription>
            </div>
            <div className="text-right space-y-2">
              <Badge className={`flex items-center gap-1 ${getInvitationTypeBadgeColor()}`}>
                {getInvitationTypeIcon()}
                {getInvitationTypeLabel()}
              </Badge>
              {isUpdate ? (
                <Badge variant="default" className="bg-blue-100 text-blue-800 block">
                  <RefreshCw className="w-3 h-3 mr-1" />
                  Update #{submissionCount + 1}
                </Badge>
              ) : (
                <Badge variant="secondary" className="block">
                  New RSVP
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Wedding Weekend Schedule Info */}
      <Card className="mb-6" style={{ backgroundColor: "#f0f8ff", color: "#294a46" }}>
        <CardHeader>
          <CardTitle className="text-xl font-bold">Wedding Weekend Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              {invitation.invitationType === "bridal-party" && (
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-purple-700">Friday Events</h4>
                  <p className="text-base">• Bowling, let the weekend begin as the couple rolls to forever</p>
                  <p className="text-sm text-purple-600 mt-1">* Exclusive for bridal party</p>
                </div>
              )}

              <div>
                <h4 className="font-semibold text-lg mb-2">Saturday Events</h4>
                <p className="text-base">• Beers and Cheers with Bride and Groom (12:00 PM - 3:00 PM)</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="font-semibold text-lg mb-2">Sunday Events</h4>
                <div className="text-base space-y-1">
                  <p>• Wedding Ceremony (4:30 PM)</p>
                  <p>• Cocktail Hour (5:00 PM)</p>
                  <p>• Reception Dinner (6:00 PM - 10:00 PM)</p>
                </div>
              </div>

              {invitation.invitationType === "family" && (
                <div>
                  <h4 className="font-semibold text-lg mb-2 text-pink-700">Monday Events</h4>
                  <p className="text-base">• After party brunch to end the weekend!</p>
                  <p className="text-sm text-pink-600 mt-1">* Exclusive for family</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {isUpdate && (
        <Card className="mb-6" style={{ backgroundColor: "#e3f2fd", color: "#294a46" }}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">You previously submitted your RSVP</p>
                <p className="text-sm text-gray-600">
                  Last updated: {invitation.currentSubmission?.submittedAt.toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total submissions: {submissionCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {errors.length > 0 && (
        <Card className="mb-6 border-red-200" style={{ backgroundColor: "white" }}>
          <CardContent className="pt-6">
            <div style={{ color: "#294a46" }}>
              <p className="font-medium mb-2 text-lg">Please fix the following errors:</p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-base">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {guests.map((guest, index) => (
          <GuestForm
            key={index}
            guest={guest}
            guestIndex={index}
            events={weddingEvents}
            invitation={invitation}
            onGuestChange={handleGuestChange}
          />
        ))}
      </div>

      <Card className="mt-6">
        <CardContent className="pt-6">
          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full text-lg font-medium" size="lg">
            {isSubmitting ? (
              `${isUpdate ? "Updating" : "Submitting"} RSVP...`
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                {isUpdate ? "Update RSVP" : "Submit RSVP"}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
