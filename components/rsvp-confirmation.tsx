"use client"

import type { Invitation, Guest } from "../types/rsvp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, Calendar, Users, Utensils } from "lucide-react"
import { EmailSender } from "./email-sender"

interface RsvpConfirmationProps {
  invitation: Invitation
  guests: Guest[]
  onStartOver: () => void
  isUpdate?: boolean
}

export function RsvpConfirmation({ invitation, guests, onStartOver, isUpdate = false }: RsvpConfirmationProps) {
  const getAttendingEvents = (guest: Guest) => {
    return Object.entries(guest.events)
      .filter(([_, attending]) => attending)
      .map(([event, _]) => event)
  }

  const totalAttendingByEvent = {
    bowling: guests.filter((g) => g.events.bowling).length,
    beersAndCheers: guests.filter((g) => g.events.beersAndCheers).length,
    ceremony: guests.filter((g) => g.events.ceremony).length,
    cocktailHour: guests.filter((g) => g.events.cocktailHour).length,
    reception: guests.filter((g) => g.events.reception).length,
    afterPartyBrunch: guests.filter((g) => g.events.afterPartyBrunch).length,
  }

  const getDietaryRestrictions = (restrictions: Guest["dietaryRestrictions"]) => {
    const selected = Object.entries(restrictions)
      .filter(([key, value]) => key !== "other" && value === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"))

    if (restrictions.other) {
      selected.push(restrictions.other)
    }

    return selected.length > 0 ? selected.join(", ") : "None specified"
  }

  const getEntreeSelection = (entree: Guest["entreeSelection"]) => {
    if (entree.beef) return "Beef Entrée"
    if (entree.fish) return "Fish Entrée"
    if (entree.vegetarianVegan) return "Vegetarian/Vegan Entrée"
    if (entree.kidsChicken) return "Kid's Only - Chicken Entrée"
    return "No selection"
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card className="mb-6" style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <CardTitle className="text-3xl font-bold" style={{ color: "#294a46" }}>
            RSVP {isUpdate ? "Updated" : "Submitted"} Successfully!
          </CardTitle>
          <CardDescription className="text-lg">
            {isUpdate ? "Your RSVP has been updated. Thank you!" : "Thank you for responding to our wedding invitation"}
          </CardDescription>
        </CardHeader>
      </Card>

      <Card className="mb-6" style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold" style={{ color: "#294a46" }}>
            <Users className="w-5 h-5" />
            Party Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-lg">
              <p>
                <strong>Primary Guest:</strong> {invitation.primaryGuestName}
              </p>
              <p>
                <strong>Party Size:</strong> {guests.length} {guests.length === 1 ? "guest" : "guests"}
              </p>
            </div>

            <div>
              <h4 className="font-medium mb-2 flex items-center gap-2 text-lg">
                <Calendar className="w-4 h-4" />
                Event Attendance Summary
              </h4>
              <div className="grid grid-cols-1 gap-2 text-base">
                {totalAttendingByEvent.bowling > 0 && (
                  <>
                    <div className="font-medium text-purple-700">Friday Events:</div>
                    <div className="ml-4">Bowling: {totalAttendingByEvent.bowling} attending</div>
                  </>
                )}

                {totalAttendingByEvent.beersAndCheers > 0 && (
                  <>
                    <div className="font-medium text-blue-700 mt-2">Saturday Events:</div>
                    <div className="ml-4">Beers & Cheers: {totalAttendingByEvent.beersAndCheers} attending</div>
                  </>
                )}

                <div className="font-medium text-blue-700 mt-2">Sunday Events:</div>
                <div className="ml-4">Ceremony: {totalAttendingByEvent.ceremony} attending</div>
                <div className="ml-4">Cocktail Hour: {totalAttendingByEvent.cocktailHour} attending</div>
                <div className="ml-4">Reception: {totalAttendingByEvent.reception} attending</div>

                {totalAttendingByEvent.afterPartyBrunch > 0 && (
                  <>
                    <div className="font-medium text-pink-700 mt-2">Monday Events:</div>
                    <div className="ml-4">After Party Brunch: {totalAttendingByEvent.afterPartyBrunch} attending</div>
                  </>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6" style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl font-bold" style={{ color: "#294a46" }}>
            <Utensils className="w-5 h-5" />
            Guest Details
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {guests.map((guest, index) => (
              <div key={index} className="border-l-4 border-blue-200 pl-4">
                <h4 className="font-medium text-lg">{guest.name}</h4>
                <p className="text-base text-gray-600">
                  Attending: {getAttendingEvents(guest).join(", ") || "No events selected"}
                </p>
                {guest.events.reception && (
                  <p className="text-base text-gray-600">
                    Sunday Reception Entrée: {getEntreeSelection(guest.entreeSelection)}
                  </p>
                )}
                <p className="text-base text-gray-600">
                  Dietary restrictions: {getDietaryRestrictions(guest.dietaryRestrictions)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <EmailSender invitation={invitation} guests={guests} isUpdate={isUpdate} />

      <Card style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardContent className="pt-6 text-center">
          <p className="text-gray-600 mb-4 text-lg">
            {isUpdate
              ? "Your updated RSVP has been saved."
              : "We're so excited to celebrate with you over the wedding weekend! You should receive a confirmation email shortly."}
          </p>
          <div className="space-y-2">
            <Button onClick={onStartOver} variant="outline" className="text-lg font-medium">
              Submit Another RSVP
            </Button>
            {isUpdate && (
              <p className="text-sm text-gray-500">
                Remember: You can always search for your name again to make further updates
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
