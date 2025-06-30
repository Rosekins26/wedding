"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Heart, Search, Users, Calendar, Utensils } from "lucide-react"

interface Guest {
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

interface Invitation {
  id: string
  primaryGuestName: string
  email: string
  partySize: number
  invitationType: string
}

// Sample data - replace with your actual guest list
const sampleInvitations: Invitation[] = [
  {
    id: "1",
    primaryGuestName: "John Smith",
    email: "john.smith@email.com",
    partySize: 2,
    invitationType: "family",
  },
  {
    id: "2",
    primaryGuestName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    partySize: 4,
    invitationType: "standard",
  },
  {
    id: "3",
    primaryGuestName: "Michael Brown",
    email: "michael.brown@email.com",
    partySize: 1,
    invitationType: "bridal-party",
  },
  {
    id: "4",
    primaryGuestName: "Emily Davis",
    email: "emily.davis@email.com",
    partySize: 3,
    invitationType: "plus-one",
  },
]

export default function WeddingRSVP() {
  const [searchName, setSearchName] = useState("")
  const [currentInvitation, setCurrentInvitation] = useState<Invitation | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async () => {
    setIsSearching(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const invitation = sampleInvitations.find((inv) =>
      inv.primaryGuestName.toLowerCase().includes(searchName.toLowerCase()),
    )

    if (invitation) {
      setCurrentInvitation(invitation)
      // Initialize guests array
      const initialGuests: Guest[] = Array.from({ length: invitation.partySize }, (_, i) => ({
        name: i === 0 ? invitation.primaryGuestName : "",
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
      setGuests(initialGuests)
    } else {
      alert("Invitation not found. Please check the name and try again.")
    }

    setIsSearching(false)
  }

  const updateGuest = (index: number, field: string, value: any) => {
    const updatedGuests = [...guests]
    const keys = field.split(".")
    let current = updatedGuests[index] as any

    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]]
    }
    current[keys[keys.length - 1]] = value

    setGuests(updatedGuests)
  }

  const handleSubmit = async () => {
    // Validate that all guests have names
    const invalidGuests = guests.filter((guest) => !guest.name.trim())
    if (invalidGuests.length > 0) {
      alert("Please enter names for all guests.")
      return
    }

    // Simulate API submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Store in localStorage for demo purposes
    const rsvpData = {
      invitation: currentInvitation,
      guests: guests,
      submittedAt: new Date().toISOString(),
    }

    const existingRSVPs = JSON.parse(localStorage.getItem("weddingRSVPs") || "[]")
    existingRSVPs.push(rsvpData)
    localStorage.setItem("weddingRSVPs", JSON.stringify(existingRSVPs))

    setIsSubmitted(true)
  }

  const resetForm = () => {
    setSearchName("")
    setCurrentInvitation(null)
    setGuests([])
    setIsSubmitted(false)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <Heart className="h-16 w-16 text-rose-500" />
              </div>
              <CardTitle className="text-3xl text-rose-800">Thank You!</CardTitle>
              <CardDescription className="text-lg">Your RSVP has been submitted successfully.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6">
                We're so excited to celebrate with you! You'll receive a confirmation email shortly.
              </p>
              <Button onClick={resetForm} className="bg-rose-600 hover:bg-rose-700">
                Submit Another RSVP
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="h-12 w-12 text-rose-500" />
          </div>
          <h1 className="text-4xl font-bold text-rose-800 mb-2">Lily & Terron</h1>
          <p className="text-xl text-rose-600">Wedding RSVP</p>
          <p className="text-gray-600 mt-2">Please respond by [Date]</p>
        </div>

        {!currentInvitation ? (
          /* Search Form */
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Find Your Invitation
              </CardTitle>
              <CardDescription>Enter the name as it appears on your invitation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="search">Guest Name</Label>
                <Input
                  id="search"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="Enter your name..."
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>
              <Button
                onClick={handleSearch}
                disabled={!searchName.trim() || isSearching}
                className="w-full bg-rose-600 hover:bg-rose-700"
              >
                {isSearching ? "Searching..." : "Find My Invitation"}
              </Button>
            </CardContent>
          </Card>
        ) : (
          /* RSVP Form */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Welcome, {currentInvitation.primaryGuestName}!
                </CardTitle>
                <CardDescription>
                  You're invited for {currentInvitation.partySize} guest{currentInvitation.partySize > 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
            </Card>

            {guests.map((guest, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle>Guest {index + 1}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Guest Name */}
                  <div>
                    <Label htmlFor={`name-${index}`}>Full Name *</Label>
                    <Input
                      id={`name-${index}`}
                      value={guest.name}
                      onChange={(e) => updateGuest(index, "name", e.target.value)}
                      placeholder="Enter full name"
                    />
                  </div>

                  {/* Events */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Calendar className="h-4 w-4" />
                      Which events will you attend?
                    </Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {[
                        { key: "bowling", label: "Friday Night Bowling" },
                        { key: "beersAndCheers", label: "Saturday Beers & Cheers" },
                        { key: "ceremony", label: "Saturday Ceremony" },
                        { key: "cocktailHour", label: "Saturday Cocktail Hour" },
                        { key: "reception", label: "Saturday Reception" },
                        { key: "afterPartyBrunch", label: "Sunday After Party Brunch" },
                      ].map((event) => (
                        <div key={event.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${index}-${event.key}`}
                            checked={guest.events[event.key as keyof typeof guest.events]}
                            onCheckedChange={(checked) => updateGuest(index, `events.${event.key}`, checked)}
                          />
                          <Label htmlFor={`${index}-${event.key}`} className="text-sm">
                            {event.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Entrée Selection */}
                  <div>
                    <Label className="flex items-center gap-2 mb-3">
                      <Utensils className="h-4 w-4" />
                      Entrée Selection (choose one)
                    </Label>
                    <RadioGroup
                      value={
                        guest.entreeSelection.beef
                          ? "beef"
                          : guest.entreeSelection.fish
                            ? "fish"
                            : guest.entreeSelection.vegetarianVegan
                              ? "vegetarianVegan"
                              : guest.entreeSelection.kidsChicken
                                ? "kidsChicken"
                                : ""
                      }
                      onValueChange={(value) => {
                        const newSelection = {
                          beef: value === "beef",
                          fish: value === "fish",
                          vegetarianVegan: value === "vegetarianVegan",
                          kidsChicken: value === "kidsChicken",
                        }
                        updateGuest(index, "entreeSelection", newSelection)
                      }}
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="beef" id={`${index}-beef`} />
                        <Label htmlFor={`${index}-beef`}>Beef Tenderloin</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="fish" id={`${index}-fish`} />
                        <Label htmlFor={`${index}-fish`}>Pan-Seared Salmon</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="vegetarianVegan" id={`${index}-veg`} />
                        <Label htmlFor={`${index}-veg`}>Vegetarian/Vegan Option</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="kidsChicken" id={`${index}-kids`} />
                        <Label htmlFor={`${index}-kids`}>Kid's Chicken Tenders</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Dietary Restrictions */}
                  <div>
                    <Label className="mb-3 block">Dietary Restrictions</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                      {[
                        { key: "vegetarian", label: "Vegetarian" },
                        { key: "vegan", label: "Vegan" },
                        { key: "glutenFree", label: "Gluten Free" },
                        { key: "dairyFree", label: "Dairy Free" },
                        { key: "nutAllergy", label: "Nut Allergy" },
                        { key: "shellfish", label: "Shellfish Allergy" },
                        { key: "kosher", label: "Kosher" },
                        { key: "halal", label: "Halal" },
                      ].map((restriction) => (
                        <div key={restriction.key} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${index}-${restriction.key}`}
                            checked={
                              guest.dietaryRestrictions[
                                restriction.key as keyof typeof guest.dietaryRestrictions
                              ] as boolean
                            }
                            onCheckedChange={(checked) =>
                              updateGuest(index, `dietaryRestrictions.${restriction.key}`, checked)
                            }
                          />
                          <Label htmlFor={`${index}-${restriction.key}`} className="text-sm">
                            {restriction.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                    <div>
                      <Label htmlFor={`other-${index}`}>Other dietary restrictions</Label>
                      <Textarea
                        id={`other-${index}`}
                        value={guest.dietaryRestrictions.other}
                        onChange={(e) => updateGuest(index, "dietaryRestrictions.other", e.target.value)}
                        placeholder="Please specify any other dietary restrictions..."
                        rows={2}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {/* Submit Button */}
            <div className="flex gap-4 justify-center">
              <Button onClick={() => setCurrentInvitation(null)} variant="outline">
                Back to Search
              </Button>
              <Button onClick={handleSubmit} className="bg-rose-600 hover:bg-rose-700">
                Submit RSVP
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
