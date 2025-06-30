"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Heart, Calendar, MapPin, Clock } from "lucide-react"

interface Guest {
  name: string
  attending_ceremony: boolean
  attending_cocktail_hour: boolean
  attending_reception: boolean
  attending_brunch: boolean
  attending_bowling: boolean
  attending_beers_cheers: boolean
  dietary_restrictions: string[]
  dietary_other: string
}

interface Invitation {
  id: number
  primary_guest_name: string
  party_size: number
  invitation_type: string
}

export default function WeddingRsvp() {
  const [step, setStep] = useState<"search" | "rsvp" | "confirmation">("search")
  const [searchName, setSearchName] = useState("")
  const [invitation, setInvitation] = useState<Invitation | null>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Sample invitations for demo
  const sampleInvitations: Invitation[] = [
    { id: 1, primary_guest_name: "John Smith", party_size: 2, invitation_type: "family" },
    { id: 2, primary_guest_name: "Sarah Johnson", party_size: 4, invitation_type: "standard" },
    { id: 3, primary_guest_name: "Michael Brown", party_size: 1, invitation_type: "bridal-party" },
    { id: 4, primary_guest_name: "Emily Davis", party_size: 3, invitation_type: "plus-one" },
  ]

  const searchInvitation = () => {
    setLoading(true)
    setError("")

    // Simulate API call
    setTimeout(() => {
      const found = sampleInvitations.find((inv) =>
        inv.primary_guest_name.toLowerCase().includes(searchName.toLowerCase()),
      )

      if (found) {
        setInvitation(found)
        // Initialize guests array
        const initialGuests: Guest[] = Array.from({ length: found.party_size }, (_, i) => ({
          name: i === 0 ? found.primary_guest_name : "",
          attending_ceremony: false,
          attending_cocktail_hour: false,
          attending_reception: false,
          attending_brunch: false,
          attending_bowling: false,
          attending_beers_cheers: false,
          dietary_restrictions: [],
          dietary_other: "",
        }))
        setGuests(initialGuests)
        setStep("rsvp")
      } else {
        setError("Invitation not found. Please check the spelling or contact the couple.")
      }
      setLoading(false)
    }, 1000)
  }

  const updateGuest = (index: number, field: keyof Guest, value: any) => {
    const updatedGuests = [...guests]
    if (field === "dietary_restrictions") {
      const restrictions = updatedGuests[index].dietary_restrictions
      if (restrictions.includes(value)) {
        updatedGuests[index].dietary_restrictions = restrictions.filter((r) => r !== value)
      } else {
        updatedGuests[index].dietary_restrictions = [...restrictions, value]
      }
    } else {
      updatedGuests[index] = { ...updatedGuests[index], [field]: value }
    }
    setGuests(updatedGuests)
  }

  const submitRsvp = () => {
    setLoading(true)

    // Simulate API submission
    setTimeout(() => {
      setStep("confirmation")
      setLoading(false)
    }, 1500)
  }

  const getEventsByType = (type: string) => {
    switch (type) {
      case "family":
        return ["ceremony", "cocktail_hour", "reception", "brunch", "bowling", "beers_cheers"]
      case "bridal-party":
        return ["ceremony", "cocktail_hour", "reception", "brunch", "bowling", "beers_cheers"]
      case "plus-one":
        return ["ceremony", "cocktail_hour", "reception", "brunch"]
      default:
        return ["ceremony", "cocktail_hour", "reception", "brunch"]
    }
  }

  const eventDetails = {
    bowling: { name: "Friday Bowling", date: "Friday, June 13th", time: "7:00 PM", location: "Lucky Strike Bowling" },
    beers_cheers: { name: "Beers & Cheers", date: "Friday, June 13th", time: "9:00 PM", location: "Local Brewery" },
    ceremony: { name: "Wedding Ceremony", date: "Saturday, June 14th", time: "4:00 PM", location: "Garden Venue" },
    cocktail_hour: { name: "Cocktail Hour", date: "Saturday, June 14th", time: "5:00 PM", location: "Garden Venue" },
    reception: { name: "Reception", date: "Saturday, June 14th", time: "6:00 PM", location: "Garden Venue" },
    brunch: { name: "Sunday Brunch", date: "Sunday, June 15th", time: "11:00 AM", location: "Brunch Café" },
  }

  if (step === "search") {
    return (
      <div className="embed-container p-4">
        <Card className="wedding-card max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-rose-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-rose-800">Lily & Terron's Wedding</CardTitle>
            <p className="text-rose-600">June 13-15, 2026</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="search">Find Your Invitation</Label>
              <Input
                id="search"
                placeholder="Enter your name as it appears on the invitation"
                value={searchName}
                onChange={(e) => setSearchName(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && searchInvitation()}
              />
            </div>
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <Button
              onClick={searchInvitation}
              disabled={!searchName.trim() || loading}
              className="w-full bg-rose-600 hover:bg-rose-700"
            >
              {loading ? "Searching..." : "Find My Invitation"}
            </Button>
            <div className="text-center text-sm text-gray-600">
              <p>Can't find your invitation?</p>
              <p>Contact us at: lilyandterron2026@gmail.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "rsvp" && invitation) {
    const availableEvents = getEventsByType(invitation.invitation_type)

    return (
      <div className="embed-container p-4">
        <Card className="wedding-card max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-xl text-rose-800">RSVP for {invitation.primary_guest_name}</CardTitle>
            <p className="text-rose-600">Party size: {invitation.party_size}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {guests.map((guest, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div>
                  <Label>Guest {index + 1} Name</Label>
                  <Input
                    value={guest.name}
                    onChange={(e) => updateGuest(index, "name", e.target.value)}
                    placeholder={index === 0 ? invitation.primary_guest_name : "Guest name"}
                  />
                </div>

                <div>
                  <Label className="text-base font-semibold">Event Attendance</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2">
                    {availableEvents.map((event) => {
                      const eventKey = `attending_${event}` as keyof Guest
                      const details = eventDetails[event as keyof typeof eventDetails]
                      return (
                        <div key={event} className="flex items-start space-x-2 p-3 border rounded">
                          <Checkbox
                            checked={guest[eventKey] as boolean}
                            onCheckedChange={(checked) => updateGuest(index, eventKey, checked)}
                          />
                          <div className="flex-1">
                            <div className="font-medium">{details.name}</div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Calendar className="h-3 w-3" />
                              {details.date}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <Clock className="h-3 w-3" />
                              {details.time}
                            </div>
                            <div className="text-sm text-gray-600 flex items-center gap-2">
                              <MapPin className="h-3 w-3" />
                              {details.location}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <Label className="text-base font-semibold">Dietary Restrictions</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    {[
                      "Vegetarian",
                      "Vegan",
                      "Gluten-Free",
                      "Dairy-Free",
                      "Nut Allergy",
                      "Shellfish Allergy",
                      "Kosher",
                      "Halal",
                    ].map((restriction) => (
                      <div key={restriction} className="flex items-center space-x-2">
                        <Checkbox
                          checked={guest.dietary_restrictions.includes(restriction)}
                          onCheckedChange={() => updateGuest(index, "dietary_restrictions", restriction)}
                        />
                        <Label className="text-sm">{restriction}</Label>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2">
                    <Label htmlFor={`other-${index}`}>Other dietary needs</Label>
                    <Textarea
                      id={`other-${index}`}
                      placeholder="Please specify any other dietary restrictions or allergies"
                      value={guest.dietary_other}
                      onChange={(e) => updateGuest(index, "dietary_other", e.target.value)}
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <Button variant="outline" onClick={() => setStep("search")} className="flex-1">
                Back
              </Button>
              <Button
                onClick={submitRsvp}
                disabled={loading || guests.some((g) => !g.name.trim())}
                className="flex-1 bg-rose-600 hover:bg-rose-700"
              >
                {loading ? "Submitting..." : "Submit RSVP"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (step === "confirmation") {
    return (
      <div className="embed-container p-4">
        <Card className="wedding-card max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Heart className="h-12 w-12 text-rose-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-rose-800">Thank You!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-rose-600">Your RSVP has been submitted successfully.</p>
            <p className="text-gray-600">We can't wait to celebrate with you!</p>
            <div className="space-y-2 text-sm text-gray-600">
              <p>Questions? Contact us:</p>
              <p>lilyandterron2026@gmail.com</p>
            </div>
            <Button
              onClick={() => {
                setStep("search")
                setSearchName("")
                setInvitation(null)
                setGuests([])
                setError("")
              }}
              variant="outline"
              className="w-full"
            >
              Submit Another RSVP
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
