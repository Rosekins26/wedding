"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Download, Users, Calendar, Utensils, AlertCircle } from "lucide-react"

interface RSVPData {
  invitation: {
    id: string
    primaryGuestName: string
    email: string
    partySize: number
    invitationType: string
  }
  guests: Array<{
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
  }>
  submittedAt: string
}

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [rsvpData, setRsvpData] = useState<RSVPData[]>([])
  const [stats, setStats] = useState({
    totalRSVPs: 0,
    totalGuests: 0,
    eventCounts: {
      bowling: 0,
      beersAndCheers: 0,
      ceremony: 0,
      cocktailHour: 0,
      reception: 0,
      afterPartyBrunch: 0,
    },
    entreeCounts: {
      beef: 0,
      fish: 0,
      vegetarianVegan: 0,
      kidsChicken: 0,
    },
  })

  useEffect(() => {
    if (isAuthenticated) {
      loadRSVPData()
    }
  }, [isAuthenticated])

  const handleLogin = () => {
    if (password === "Rosekins2026") {
      setIsAuthenticated(true)
    } else {
      alert("Incorrect password")
    }
  }

  const loadRSVPData = () => {
    const data = JSON.parse(localStorage.getItem("weddingRSVPs") || "[]") as RSVPData[]
    setRsvpData(data)

    // Calculate statistics
    const totalRSVPs = data.length
    const totalGuests = data.reduce((sum, rsvp) => sum + rsvp.guests.length, 0)

    const eventCounts = {
      bowling: 0,
      beersAndCheers: 0,
      ceremony: 0,
      cocktailHour: 0,
      reception: 0,
      afterPartyBrunch: 0,
    }

    const entreeCounts = {
      beef: 0,
      fish: 0,
      vegetarianVegan: 0,
      kidsChicken: 0,
    }

    data.forEach((rsvp) => {
      rsvp.guests.forEach((guest) => {
        // Count events
        Object.keys(eventCounts).forEach((event) => {
          if (guest.events[event as keyof typeof guest.events]) {
            eventCounts[event as keyof typeof eventCounts]++
          }
        })

        // Count entrees
        Object.keys(entreeCounts).forEach((entree) => {
          if (guest.entreeSelection[entree as keyof typeof guest.entreeSelection]) {
            entreeCounts[entree as keyof typeof entreeCounts]++
          }
        })
      })
    })

    setStats({
      totalRSVPs,
      totalGuests,
      eventCounts,
      entreeCounts,
    })
  }

  const exportToCSV = () => {
    const csvData = []
    csvData.push([
      "RSVP Date",
      "Primary Guest",
      "Email",
      "Party Size",
      "Invitation Type",
      "Guest Name",
      "Bowling",
      "Beers & Cheers",
      "Ceremony",
      "Cocktail Hour",
      "Reception",
      "After Party Brunch",
      "Beef",
      "Fish",
      "Vegetarian/Vegan",
      "Kids Chicken",
      "Dietary Restrictions",
    ])

    rsvpData.forEach((rsvp) => {
      rsvp.guests.forEach((guest) => {
        const dietaryRestrictions = [
          guest.dietaryRestrictions.vegetarian && "Vegetarian",
          guest.dietaryRestrictions.vegan && "Vegan",
          guest.dietaryRestrictions.glutenFree && "Gluten Free",
          guest.dietaryRestrictions.dairyFree && "Dairy Free",
          guest.dietaryRestrictions.nutAllergy && "Nut Allergy",
          guest.dietaryRestrictions.shellfish && "Shellfish Allergy",
          guest.dietaryRestrictions.kosher && "Kosher",
          guest.dietaryRestrictions.halal && "Halal",
          guest.dietaryRestrictions.other && guest.dietaryRestrictions.other,
        ]
          .filter(Boolean)
          .join("; ")

        csvData.push([
          new Date(rsvp.submittedAt).toLocaleDateString(),
          rsvp.invitation.primaryGuestName,
          rsvp.invitation.email,
          rsvp.invitation.partySize.toString(),
          rsvp.invitation.invitationType,
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
    a.download = `wedding-rsvp-responses-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
            <CardDescription>Enter the admin password to access the dashboard</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleLogin()}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-rose-600 hover:bg-rose-700">
              Login
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 to-pink-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-rose-800">Wedding RSVP Dashboard</h1>
            <p className="text-rose-600">Lily & Terron's Wedding</p>
          </div>
          <Button onClick={exportToCSV} className="bg-rose-600 hover:bg-rose-700">
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-rose-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total RSVPs</p>
                  <p className="text-2xl font-bold">{stats.totalRSVPs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Guests</p>
                  <p className="text-2xl font-bold">{stats.totalGuests}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Ceremony</p>
                  <p className="text-2xl font-bold">{stats.eventCounts.ceremony}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Utensils className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Reception</p>
                  <p className="text-2xl font-bold">{stats.eventCounts.reception}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="responses" className="space-y-4">
          <TabsList>
            <TabsTrigger value="responses">RSVP Responses</TabsTrigger>
            <TabsTrigger value="events">Event Attendance</TabsTrigger>
            <TabsTrigger value="entrees">Entrée Selections</TabsTrigger>
          </TabsList>

          <TabsContent value="responses">
            <Card>
              <CardHeader>
                <CardTitle>RSVP Responses</CardTitle>
                <CardDescription>All submitted RSVP responses</CardDescription>
              </CardHeader>
              <CardContent>
                {rsvpData.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No RSVP responses yet</p>
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Primary Guest</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Party Size</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Guests</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rsvpData.map((rsvp, index) => (
                        <TableRow key={index}>
                          <TableCell>{new Date(rsvp.submittedAt).toLocaleDateString()}</TableCell>
                          <TableCell className="font-medium">{rsvp.invitation.primaryGuestName}</TableCell>
                          <TableCell>{rsvp.invitation.email}</TableCell>
                          <TableCell>{rsvp.invitation.partySize}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{rsvp.invitation.invitationType}</Badge>
                          </TableCell>
                          <TableCell>{rsvp.guests.map((guest) => guest.name).join(", ")}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="events">
            <Card>
              <CardHeader>
                <CardTitle>Event Attendance</CardTitle>
                <CardDescription>Number of guests attending each event</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.entries(stats.eventCounts).map(([event, count]) => (
                    <div key={event} className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium capitalize mb-2">{event.replace(/([A-Z])/g, " $1").trim()}</h3>
                      <p className="text-2xl font-bold text-rose-600">{count}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="entrees">
            <Card>
              <CardHeader>
                <CardTitle>Entrée Selections</CardTitle>
                <CardDescription>Number of guests selecting each entrée</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Beef Tenderloin</h3>
                    <p className="text-2xl font-bold text-red-600">{stats.entreeCounts.beef}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Pan-Seared Salmon</h3>
                    <p className="text-2xl font-bold text-blue-600">{stats.entreeCounts.fish}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Vegetarian/Vegan</h3>
                    <p className="text-2xl font-bold text-green-600">{stats.entreeCounts.vegetarianVegan}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium mb-2">Kids Chicken</h3>
                    <p className="text-2xl font-bold text-yellow-600">{stats.entreeCounts.kidsChicken}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
