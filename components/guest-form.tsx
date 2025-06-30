"use client"

import type { Guest, WeddingEvents, Invitation } from "../types/rsvp"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Crown, Heart, Users, UserPlus } from "lucide-react"

interface GuestFormProps {
  guest: Guest
  guestIndex: number
  events: WeddingEvents
  invitation: Invitation
  onGuestChange: (index: number, guest: Guest) => void
}

const INVITATION_TYPE_ACCESS = {
  standard: {
    bowling: false,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    beersAndCheers: true,
    afterPartyBrunch: false,
  },
  "plus-one": {
    bowling: false,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    beersAndCheers: true,
    afterPartyBrunch: false,
  },
  family: {
    bowling: false,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    beersAndCheers: true,
    afterPartyBrunch: true,
  },
  "bridal-party": {
    bowling: true,
    ceremony: true,
    cocktailHour: true,
    reception: true,
    beersAndCheers: true,
    afterPartyBrunch: false,
  },
}

export function GuestForm({ guest, guestIndex, events, invitation, onGuestChange }: GuestFormProps) {
  const updateGuest = (updates: Partial<Guest>) => {
    onGuestChange(guestIndex, { ...guest, ...updates })
  }

  const updateEvent = (eventKey: keyof Guest["events"], checked: boolean) => {
    updateGuest({
      events: {
        ...guest.events,
        [eventKey]: checked,
      },
    })
  }

  const updateDietaryRestriction = (key: string, value: boolean | string) => {
    updateGuest({
      dietaryRestrictions: {
        ...guest.dietaryRestrictions,
        [key]: value,
      },
    })
  }

  const updateEntreeSelection = (selection: "beef" | "fish" | "vegetarianVegan" | "kidsChicken") => {
    updateGuest({
      entreeSelection: {
        beef: selection === "beef",
        fish: selection === "fish",
        vegetarianVegan: selection === "vegetarianVegan",
        kidsChicken: selection === "kidsChicken",
      },
    })
  }

  // Get event access based on invitation type
  const eventAccess = INVITATION_TYPE_ACCESS[invitation.invitationType]

  // Remove day prefixes from event names for display
  const getEventDisplayName = (eventKey: string, eventName: string) => {
    if (eventKey === "bowling") {
      return eventName.replace("Friday: ", "")
    }
    if (eventKey === "beersAndCheers") {
      return eventName.replace("Saturday: ", "")
    }
    if (eventKey === "afterPartyBrunch") {
      return eventName.replace("Monday: ", "")
    }
    return eventName.replace("Sunday: ", "")
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
    <Card className="mb-4" style={{ backgroundColor: "white", color: "#294a46" }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-bold" style={{ color: "#294a46" }}>
            Guest {guestIndex + 1}
          </CardTitle>
          <Badge className={`flex items-center gap-1 ${getInvitationTypeBadgeColor()}`}>
            {getInvitationTypeIcon()}
            {getInvitationTypeLabel()}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`name-${guestIndex}`} className="text-lg font-medium">
            Full Name *
          </Label>
          <Input
            id={`name-${guestIndex}`}
            value={guest.name}
            onChange={(e) => updateGuest({ name: e.target.value })}
            placeholder="Enter full name"
            required
            className="text-lg"
          />
        </div>

        <div>
          <Label className="text-lg font-medium">Event Attendance *</Label>

          {/* Friday Events Section - Bridal Party Only */}
          {eventAccess.bowling && (
            <div className="mt-3 p-4 border rounded-lg" style={{ backgroundColor: "#8b5cf6", borderColor: "#7c3aed" }}>
              <h4 className="font-semibold text-base mb-3 text-white">Friday Events</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`bowling-${guestIndex}`}
                    checked={guest.events.bowling}
                    onCheckedChange={(checked) => updateEvent("bowling", checked as boolean)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#8b5cf6]"
                  />
                  <Label htmlFor={`bowling-${guestIndex}`} className="text-base font-normal cursor-pointer text-white">
                    {getEventDisplayName("bowling", events.bowling)}
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Saturday Events Section */}
          {eventAccess.beersAndCheers && (
            <div className="mt-3 p-4 border rounded-lg" style={{ backgroundColor: "#56b6b2", borderColor: "#4a9d99" }}>
              <h4 className="font-semibold text-base mb-3 text-white">Saturday Events</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`beersAndCheers-${guestIndex}`}
                    checked={guest.events.beersAndCheers}
                    onCheckedChange={(checked) => updateEvent("beersAndCheers", checked as boolean)}
                  />
                  <Label
                    htmlFor={`beersAndCheers-${guestIndex}`}
                    className="text-base font-normal cursor-pointer text-white"
                  >
                    {getEventDisplayName("beersAndCheers", events.beersAndCheers)}
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Sunday Events Section */}
          <div className="mt-3 p-4 border rounded-lg" style={{ backgroundColor: "#294a46", borderColor: "#1f3530" }}>
            <h4 className="font-semibold text-base mb-3 text-white">Sunday Events</h4>
            <div className="space-y-2">
              {eventAccess.ceremony && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`ceremony-${guestIndex}`}
                    checked={guest.events.ceremony}
                    onCheckedChange={(checked) => updateEvent("ceremony", checked as boolean)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#294a46]"
                  />
                  <Label htmlFor={`ceremony-${guestIndex}`} className="text-base font-normal cursor-pointer text-white">
                    {getEventDisplayName("ceremony", events.ceremony)}
                  </Label>
                </div>
              )}
              {eventAccess.cocktailHour && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`cocktailHour-${guestIndex}`}
                    checked={guest.events.cocktailHour}
                    onCheckedChange={(checked) => updateEvent("cocktailHour", checked as boolean)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#294a46]"
                  />
                  <Label
                    htmlFor={`cocktailHour-${guestIndex}`}
                    className="text-base font-normal cursor-pointer text-white"
                  >
                    {getEventDisplayName("cocktailHour", events.cocktailHour)}
                  </Label>
                </div>
              )}
              {eventAccess.reception && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`reception-${guestIndex}`}
                    checked={guest.events.reception}
                    onCheckedChange={(checked) => updateEvent("reception", checked as boolean)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#294a46]"
                  />
                  <Label
                    htmlFor={`reception-${guestIndex}`}
                    className="text-base font-normal cursor-pointer text-white"
                  >
                    {getEventDisplayName("reception", events.reception)}
                  </Label>
                </div>
              )}
            </div>
          </div>

          {/* Monday Events Section - Family Only */}
          {eventAccess.afterPartyBrunch && (
            <div className="mt-3 p-4 border rounded-lg" style={{ backgroundColor: "#f59e0b", borderColor: "#d97706" }}>
              <h4 className="font-semibold text-base mb-3 text-white">Monday Events</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`afterPartyBrunch-${guestIndex}`}
                    checked={guest.events.afterPartyBrunch}
                    onCheckedChange={(checked) => updateEvent("afterPartyBrunch", checked as boolean)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#f59e0b]"
                  />
                  <Label
                    htmlFor={`afterPartyBrunch-${guestIndex}`}
                    className="text-base font-normal cursor-pointer text-white"
                  >
                    {getEventDisplayName("afterPartyBrunch", events.afterPartyBrunch)}
                  </Label>
                </div>
              </div>
            </div>
          )}

          {/* Special Access Message */}
          {invitation.invitationType === "bridal-party" && (
            <div className="mt-2 p-3 bg-purple-50 rounded-lg border border-purple-200">
              <p className="text-sm text-purple-800">
                ✨ As a bridal party member, you have exclusive access to Friday bowling and all weekend events!
              </p>
            </div>
          )}

          {invitation.invitationType === "family" && (
            <div className="mt-2 p-3 bg-pink-50 rounded-lg border border-pink-200">
              <p className="text-sm text-pink-800">
                ✨ As a family member, you have access to all weekend events plus Monday's after party brunch!
              </p>
            </div>
          )}

          {(invitation.invitationType === "standard" || invitation.invitationType === "plus-one") && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                ✨ You have access to all the main wedding weekend events from Saturday through Sunday!
              </p>
            </div>
          )}
        </div>

        <div>
          <Label className="text-lg font-medium">Plated Dinner Entrée Selection</Label>
          <p className="text-sm text-gray-600 mb-3">
            Please select your entrée preference for Sunday's reception dinner
          </p>

          <div className="mt-3 p-4 border rounded-lg" style={{ backgroundColor: "#294a46", borderColor: "#1f3530" }}>
            <h4 className="font-semibold text-base mb-3 text-white">Sunday Reception Dinner Entrée</h4>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`beef-${guestIndex}`}
                  name={`entree-${guestIndex}`}
                  checked={guest.entreeSelection.beef}
                  onChange={() => updateEntreeSelection("beef")}
                  className="w-4 h-4"
                />
                <Label htmlFor={`beef-${guestIndex}`} className="text-base font-normal cursor-pointer text-white">
                  Beef Entrée
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`fish-${guestIndex}`}
                  name={`entree-${guestIndex}`}
                  checked={guest.entreeSelection.fish}
                  onChange={() => updateEntreeSelection("fish")}
                  className="w-4 h-4"
                />
                <Label htmlFor={`fish-${guestIndex}`} className="text-base font-normal cursor-pointer text-white">
                  Fish Entrée
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`vegetarianVegan-${guestIndex}`}
                  name={`entree-${guestIndex}`}
                  checked={guest.entreeSelection.vegetarianVegan}
                  onChange={() => updateEntreeSelection("vegetarianVegan")}
                  className="w-4 h-4"
                />
                <Label
                  htmlFor={`vegetarianVegan-${guestIndex}`}
                  className="text-base font-normal cursor-pointer text-white"
                >
                  Vegetarian/Vegan Entrée
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id={`kidsChicken-${guestIndex}`}
                  name={`entree-${guestIndex}`}
                  checked={guest.entreeSelection.kidsChicken}
                  onChange={() => updateEntreeSelection("kidsChicken")}
                  className="w-4 h-4"
                />
                <Label
                  htmlFor={`kidsChicken-${guestIndex}`}
                  className="text-base font-normal cursor-pointer text-white"
                >
                  Kid's Only - Chicken Entrée
                </Label>
              </div>
            </div>
          </div>
        </div>

        <div>
          <Label className="text-lg font-medium">Dietary Restrictions</Label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
            {[
              { key: "vegetarian", label: "Vegetarian" },
              { key: "vegan", label: "Vegan" },
              { key: "glutenFree", label: "Gluten Free" },
              { key: "dairyFree", label: "Dairy Free" },
              { key: "nutAllergy", label: "Nut Allergy" },
              { key: "shellfish", label: "Shellfish Allergy" },
              { key: "kosher", label: "Kosher" },
              { key: "halal", label: "Halal" },
            ].map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={`${key}-${guestIndex}`}
                  checked={guest.dietaryRestrictions[key as keyof typeof guest.dietaryRestrictions]}
                  onCheckedChange={(checked) => updateDietaryRestriction(key, checked as boolean)}
                />
                <Label htmlFor={`${key}-${guestIndex}`} className="text-base font-normal cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-3">
            <Label htmlFor={`other-dietary-${guestIndex}`} className="text-base font-medium">
              Other dietary restrictions
            </Label>
            <Input
              id={`other-dietary-${guestIndex}`}
              value={guest.dietaryRestrictions.other}
              onChange={(e) => updateDietaryRestriction("other", e.target.value)}
              placeholder="Please specify any other dietary needs..."
              className="mt-1 text-base"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
