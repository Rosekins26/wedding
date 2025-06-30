"use client"

import { useState } from "react"
import { Search, Heart, Calendar, MapPin } from "lucide-react"

// Sample invitation data
const sampleInvitations = [
  {
    id: "inv-1",
    primaryGuestName: "John Smith",
    email: "john.smith@email.com",
    partySize: 2,
    invitationType: "family",
  },
  {
    id: "inv-2",
    primaryGuestName: "Sarah Johnson",
    email: "sarah.johnson@email.com",
    partySize: 4,
    invitationType: "standard",
  },
  {
    id: "inv-3",
    primaryGuestName: "Michael Brown",
    email: "michael.brown@email.com",
    partySize: 1,
    invitationType: "bridal-party",
  },
  {
    id: "inv-4",
    primaryGuestName: "Emily Davis",
    email: "emily.davis@email.com",
    partySize: 3,
    invitationType: "plus-one",
  },
]

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

export default function WeddingRSVP() {
  const [searchName, setSearchName] = useState("")
  const [foundInvitation, setFoundInvitation] = useState<any>(null)
  const [guests, setGuests] = useState<Guest[]>([])
  const [currentStep, setCurrentStep] = useState<"search" | "rsvp" | "confirmation">("search")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSearch = () => {
    const invitation = sampleInvitations.find((inv) =>
      inv.primaryGuestName.toLowerCase().includes(searchName.toLowerCase()),
    )

    if (invitation) {
      setFoundInvitation(invitation)
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
      setCurrentStep("rsvp")
    } else {
      alert("Invitation not found. Please check the spelling or contact the couple.")
    }
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
    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setCurrentStep("confirmation")
    setIsSubmitting(false)
  }

  const getEventsByType = (type: string) => {
    const baseEvents = ["ceremony", "cocktailHour", "reception"]

    switch (type) {
      case "family":
        return [...baseEvents, "bowling", "beersAndCheers", "afterPartyBrunch"]
      case "bridal-party":
        return ["bowling", "beersAndCheers", ...baseEvents, "afterPartyBrunch"]
      case "plus-one":
        return baseEvents
      default:
        return [...baseEvents, "afterPartyBrunch"]
    }
  }

  const eventLabels = {
    bowling: "Friday Night Bowling (Dec 27)",
    beersAndCheers: "Saturday Beers & Cheers (Dec 28)",
    ceremony: "Saturday Wedding Ceremony (Dec 28)",
    cocktailHour: "Saturday Cocktail Hour (Dec 28)",
    reception: "Saturday Reception (Dec 28)",
    afterPartyBrunch: "Sunday After-Party Brunch (Dec 29)",
  }

  if (currentStep === "search") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <Heart className="w-16 h-16 text-rose-500 mx-auto mb-4" />
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Lily & Terron</h1>
            <p className="text-xl text-gray-600 mb-6">December 28, 2026</p>
            <div className="flex items-center justify-center gap-4 text-gray-600 mb-8">
              <div className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                <span>Dec 27-29, 2026</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>Chicago, IL</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Find Your Invitation</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter the primary guest name as it appears on your invitation:
                </label>
                <input
                  type="text"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  placeholder="e.g., John Smith"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                  onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                />
              </div>

              <button
                onClick={handleSearch}
                disabled={!searchName.trim()}
                className="w-full bg-rose-500 text-white py-3 px-6 rounded-lg hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
              >
                <Search className="w-5 h-5" />
                Find My Invitation
              </button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Sample names to try:</strong> John Smith, Sarah Johnson, Michael Brown, Emily Davis
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "rsvp") {
    const availableEvents = getEventsByType(foundInvitation.invitationType)

    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <Heart className="w-12 h-12 text-rose-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">RSVP for {foundInvitation.primaryGuestName}</h1>
            <p className="text-gray-600">
              Party size: {foundInvitation.partySize} guest{foundInvitation.partySize > 1 ? "s" : ""}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="space-y-8">
              {guests.map((guest, index) => (
                <div key={index} className="border-b border-gray-200 pb-8 last:border-b-0">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    Guest {index + 1} {index === 0 && "(Primary Guest)"}
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                      <input
                        type="text"
                        value={guest.name}
                        onChange={(e) => updateGuest(index, "name", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        required
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">Event Attendance</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {availableEvents.map((event) => (
                        <label
                          key={event}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={guest.events[event as keyof typeof guest.events]}
                            onChange={(e) => updateGuest(index, `events.${event}`, e.target.checked)}
                            className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                          />
                          <span className="text-sm text-gray-700">
                            {eventLabels[event as keyof typeof eventLabels]}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">Entrée Selection</h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      {[
                        { key: "beef", label: "Beef Tenderloin" },
                        { key: "fish", label: "Grilled Salmon" },
                        { key: "vegetarianVegan", label: "Vegetarian/Vegan Option" },
                        { key: "kidsChicken", label: "Kid's Chicken Tenders" },
                      ].map((entree) => (
                        <label
                          key={entree.key}
                          className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={guest.entreeSelection[entree.key as keyof typeof guest.entreeSelection]}
                            onChange={(e) => updateGuest(index, `entreeSelection.${entree.key}`, e.target.checked)}
                            className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                          />
                          <span className="text-sm text-gray-700">{entree.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="mt-6">
                    <h4 className="text-lg font-medium text-gray-800 mb-3">Dietary Restrictions</h4>
                    <div className="grid md:grid-cols-3 gap-3">
                      {[
                        { key: "vegetarian", label: "Vegetarian" },
                        { key: "vegan", label: "Vegan" },
                        { key: "glutenFree", label: "Gluten-Free" },
                        { key: "dairyFree", label: "Dairy-Free" },
                        { key: "nutAllergy", label: "Nut Allergy" },
                        { key: "shellfish", label: "Shellfish Allergy" },
                        { key: "kosher", label: "Kosher" },
                        { key: "halal", label: "Halal" },
                      ].map((restriction) => (
                        <label key={restriction.key} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            checked={
                              guest.dietaryRestrictions[restriction.key as keyof typeof guest.dietaryRestrictions]
                            }
                            onChange={(e) =>
                              updateGuest(index, `dietaryRestrictions.${restriction.key}`, e.target.checked)
                            }
                            className="w-4 h-4 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                          />
                          <span className="text-sm text-gray-700">{restriction.label}</span>
                        </label>
                      ))}
                    </div>

                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Other dietary restrictions or allergies:
                      </label>
                      <input
                        type="text"
                        value={guest.dietaryRestrictions.other}
                        onChange={(e) => updateGuest(index, "dietaryRestrictions.other", e.target.value)}
                        placeholder="Please specify..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-4">
              <button
                onClick={() => setCurrentStep("search")}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Search
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting || guests.some((g) => !g.name.trim())}
                className="flex-1 bg-rose-500 text-white py-3 px-6 rounded-lg hover:bg-rose-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? "Submitting..." : "Submit RSVP"}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (currentStep === "confirmation") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">RSVP Submitted!</h1>
            <p className="text-gray-600">Thank you for your response.</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">What's Next?</h2>
            <div className="space-y-4 text-gray-600">
              <p>• You'll receive a confirmation email shortly</p>
              <p>• Watch for updates about venue details and timing</p>
              <p>• Contact us if you need to make changes to your RSVP</p>
            </div>

            <div className="mt-8 p-4 bg-rose-50 rounded-lg">
              <h3 className="font-semibold text-rose-800 mb-2">Contact Information</h3>
              <p className="text-rose-700">
                Email: lilyandterron2026@gmail.com
                <br />
                Phone: (555) 123-4567
              </p>
            </div>

            <button
              onClick={() => {
                setCurrentStep("search")
                setSearchName("")
                setFoundInvitation(null)
                setGuests([])
              }}
              className="w-full mt-6 bg-rose-500 text-white py-3 px-6 rounded-lg hover:bg-rose-600 transition-colors"
            >
              Submit Another RSVP
            </button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
