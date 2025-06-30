"use client"

import { useState } from "react"
import { Eye, Download, Users, Calendar, Utensils } from "lucide-react"

// Sample RSVP data
const sampleRSVPs = [
  {
    invitation: {
      id: "inv-1",
      primaryGuestName: "John Smith",
      email: "john.smith@email.com",
      partySize: 2,
      invitationType: "family",
      rsvpStatus: "completed",
    },
    guests: [
      {
        name: "John Smith",
        events: {
          bowling: true,
          beersAndCheers: true,
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
      {
        name: "Jane Smith",
        events: {
          bowling: true,
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
          glutenFree: false,
          dairyFree: true,
          nutAllergy: false,
          shellfish: false,
          kosher: false,
          halal: false,
          other: "",
        },
      },
    ],
  },
  {
    invitation: {
      id: "inv-2",
      primaryGuestName: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      partySize: 4,
      invitationType: "standard",
      rsvpStatus: "completed",
    },
    guests: [
      {
        name: "Sarah Johnson",
        events: {
          bowling: false,
          beersAndCheers: false,
          ceremony: true,
          cocktailHour: true,
          reception: true,
          afterPartyBrunch: true,
        },
        entreeSelection: {
          beef: false,
          fish: false,
          vegetarianVegan: true,
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
    ],
  },
]

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [responses, setResponses] = useState(sampleRSVPs)
  const [selectedTab, setSelectedTab] = useState<"overview" | "responses" | "export">("overview")

  const handleLogin = () => {
    if (password === "Rosekins2026") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password")
    }
  }

  const exportToCSV = () => {
    const csvData = []
    csvData.push([
      "Primary Guest",
      "Email",
      "Guest Name",
      "Bowling",
      "Beers & Cheers",
      "Ceremony",
      "Cocktail Hour",
      "Reception",
      "Brunch",
      "Beef",
      "Fish",
      "Vegetarian/Vegan",
      "Kids Chicken",
      "Dietary Restrictions",
    ])

    responses.forEach((response) => {
      response.guests.forEach((guest) => {
        const dietaryRestrictions = Object.entries(guest.dietaryRestrictions)
          .filter(([key, value]) => value === true || (key === "other" && value))
          .map(([key, value]) => (key === "other" ? value : key))
          .join(", ")

        csvData.push([
          response.invitation.primaryGuestName,
          response.invitation.email,
          guest.name,
          guest.events.bowling ? "Yes" : "No",
          guest.events.beersAndCheers ? "Yes" : "No",
          guest.events.ceremony ? "Yes" : "No",
          guest.events.cocktailHour ? "Yes" : "No",
          guest.events.reception ? "Yes" : "No",
          guest.events.afterPartyBrunch ? "Yes" : "No",
          guest.entreeSelection.beef ? "Yes" : "No",
          guest.entreeSelection.fish ? "Yes" : "No",
          guest.entreeSelection.vegetarianVegan ? "Yes" : "No",
          guest.entreeSelection.kidsChicken ? "Yes" : "No",
          dietaryRestrictions,
        ])
      })
    })

    const csvContent = csvData.map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "wedding-rsvp-responses.csv"
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  const totalGuests = responses.reduce((sum, response) => sum + response.guests.length, 0)
  const totalInvitations = responses.length
  const eventCounts = {
    bowling: responses.reduce((sum, response) => sum + response.guests.filter((g) => g.events.bowling).length, 0),
    beersAndCheers: responses.reduce(
      (sum, response) => sum + response.guests.filter((g) => g.events.beersAndCheers).length,
      0,
    ),
    ceremony: responses.reduce((sum, response) => sum + response.guests.filter((g) => g.events.ceremony).length, 0),
    cocktailHour: responses.reduce(
      (sum, response) => sum + response.guests.filter((g) => g.events.cocktailHour).length,
      0,
    ),
    reception: responses.reduce((sum, response) => sum + response.guests.filter((g) => g.events.reception).length, 0),
    afterPartyBrunch: responses.reduce(
      (sum, response) => sum + response.guests.filter((g) => g.events.afterPartyBrunch).length,
      0,
    ),
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Wedding RSVP Admin</h1>
            <button onClick={() => setIsAuthenticated(false)} className="text-gray-600 hover:text-gray-900">
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <nav className="flex space-x-8">
            {[
              { key: "overview", label: "Overview", icon: Eye },
              { key: "responses", label: "Responses", icon: Users },
              { key: "export", label: "Export", icon: Download },
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSelectedTab(key as any)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                  selectedTab === key ? "bg-blue-100 text-blue-700" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </div>

        {selectedTab === "overview" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-blue-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Guests</p>
                    <p className="text-2xl font-bold text-gray-900">{totalGuests}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Calendar className="w-8 h-8 text-green-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Invitations</p>
                    <p className="text-2xl font-bold text-gray-900">{totalInvitations}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center">
                  <Utensils className="w-8 h-8 text-purple-500" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Reception</p>
                    <p className="text-2xl font-bold text-gray-900">{eventCounts.reception}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Event Attendance</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(eventCounts).map(([event, count]) => (
                    <div key={event} className="text-center p-4 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-600 capitalize">{event.replace(/([A-Z])/g, " $1").trim()}</p>
                      <p className="text-xl font-bold text-gray-900">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {selectedTab === "responses" && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">RSVP Responses</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Primary Guest
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Party Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response) => (
                    <tr key={response.invitation.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {response.invitation.primaryGuestName}
                          </div>
                          <div className="text-sm text-gray-500">{response.invitation.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {response.invitation.partySize}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {response.invitation.invitationType.replace("-", " ")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          {response.invitation.rsvpStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {selectedTab === "export" && (
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
            <p className="text-gray-600 mb-6">
              Export all RSVP responses to a CSV file for further analysis or planning.
            </p>
            <button
              onClick={exportToCSV}
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export to CSV</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
