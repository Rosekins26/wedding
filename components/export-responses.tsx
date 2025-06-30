"use client"

import { Label } from "@/components/ui/label"

import { useState } from "react"
import type { Invitation, Guest } from "../types/rsvp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileText, Table } from "lucide-react"

interface ExportResponsesProps {
  invitations: Invitation[]
  allResponses: Array<{ invitation: Invitation; guests: Guest[] }>
}

export function ExportResponses({ invitations, allResponses }: ExportResponsesProps) {
  const [exportFormat, setExportFormat] = useState<"csv" | "json" | "pdf">("csv")
  const [isExporting, setIsExporting] = useState(false)

  const formatDietaryRestrictions = (restrictions: Guest["dietaryRestrictions"]) => {
    const selected = Object.entries(restrictions)
      .filter(([key, value]) => key !== "other" && value === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"))

    if (restrictions.other) {
      selected.push(restrictions.other)
    }

    return selected.length > 0 ? selected.join("; ") : "None"
  }

  const generateCSV = () => {
    const headers = [
      "Primary Guest",
      "Email",
      "Guest Name",
      "Saturday: Beers & Cheers",
      "Sunday: Ceremony",
      "Sunday: Cocktail Hour",
      "Sunday: Reception",
      "Sunday Reception Entrée Selection",
      "Dietary Restrictions",
    ]

    const rows = allResponses.flatMap(({ invitation, guests }) =>
      guests.map((guest) => {
        let entreeChoice = "N/A"
        if (guest.events.reception) {
          if (guest.entreeSelection?.beef) entreeChoice = "Beef"
          else if (guest.entreeSelection?.fish) entreeChoice = "Fish"
          else if (guest.entreeSelection?.vegetarianVegan) entreeChoice = "Vegetarian/Vegan"
          else if (guest.entreeSelection?.kidsChicken) entreeChoice = "Kid's Chicken"
          else entreeChoice = "No Selection"
        }

        return [
          invitation.primaryGuestName,
          invitation.email,
          guest.name,
          guest.events.beersAndCheers ? "Yes" : "No",
          guest.events.ceremony ? "Yes" : "No",
          guest.events.cocktailHour ? "Yes" : "No",
          guest.events.reception ? "Yes" : "No",
          entreeChoice,
          formatDietaryRestrictions(guest.dietaryRestrictions),
        ]
      }),
    )

    const csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(",")).join("\n")

    return csvContent
  }

  const generateJSON = () => {
    return JSON.stringify(allResponses, null, 2)
  }

  const generateSummaryReport = () => {
    const totalInvitations = invitations.length
    const completedRSVPs = allResponses.length
    const totalGuests = allResponses.reduce((sum, { guests }) => sum + guests.length, 0)

    const eventCounts = {
      beersAndCheers: 0,
      ceremony: 0,
      cocktailHour: 0,
      reception: 0,
    }

    const entreeCounts = {
      beef: 0,
      fish: 0,
      vegetarianVegan: 0,
      kidsChicken: 0,
    }

    const dietaryCounts = {
      vegetarian: 0,
      vegan: 0,
      glutenFree: 0,
      dairyFree: 0,
      nutAllergy: 0,
      shellfish: 0,
      kosher: 0,
      halal: 0,
      other: 0,
    }

    allResponses.forEach(({ guests }) => {
      guests.forEach((guest) => {
        Object.entries(guest.events).forEach(([event, attending]) => {
          if (attending) {
            eventCounts[event as keyof typeof eventCounts]++
          }
        })

        // Count entrée selections
        if (guest.events.reception) {
          Object.entries(guest.entreeSelection).forEach(([entree, selected]) => {
            if (selected) {
              entreeCounts[entree as keyof typeof entreeCounts]++
            }
          })
        }

        Object.entries(guest.dietaryRestrictions).forEach(([restriction, value]) => {
          if (restriction === "other" && value) {
            dietaryCounts.other++
          } else if (value === true) {
            dietaryCounts[restriction as keyof typeof dietaryCounts]++
          }
        })
      })
    })

    return {
      summary: {
        totalInvitations,
        completedRSVPs,
        responseRate: `${((completedRSVPs / totalInvitations) * 100).toFixed(1)}%`,
        totalGuests,
      },
      eventAttendance: eventCounts,
      entreeSelections: entreeCounts,
      dietaryRestrictions: dietaryCounts,
      responses: allResponses,
    }
  }

  const handleExport = async () => {
    setIsExporting(true)

    // Simulate export processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    let content: string
    let filename: string
    let mimeType: string

    switch (exportFormat) {
      case "csv":
        content = generateCSV()
        filename = `lily-terron-wedding-rsvp-${new Date().toISOString().split("T")[0]}.csv`
        mimeType = "text/csv"
        break
      case "json":
        content = generateJSON()
        filename = `lily-terron-wedding-rsvp-${new Date().toISOString().split("T")[0]}.json`
        mimeType = "application/json"
        break
      case "pdf":
        content = JSON.stringify(generateSummaryReport(), null, 2)
        filename = `lily-terron-wedding-summary-${new Date().toISOString().split("T")[0]}.json`
        mimeType = "application/json"
        break
      default:
        content = generateCSV()
        filename = "lily-terron-wedding-rsvp.csv"
        mimeType = "text/csv"
    }

    // Create and download file
    const blob = new Blob([content], { type: mimeType })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    setIsExporting(false)
  }

  const summaryData = generateSummaryReport()

  return (
    <div className="space-y-6">
      <Card style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: "#294a46" }}>
            <Table className="w-5 h-5" />
            Wedding Weekend RSVP Summary
          </CardTitle>
          <CardDescription>Overview of all wedding weekend RSVP responses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{summaryData.summary.totalInvitations}</div>
              <div className="text-sm text-gray-600">Total Invitations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{summaryData.summary.completedRSVPs}</div>
              <div className="text-sm text-gray-600">Completed RSVPs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{summaryData.summary.responseRate}</div>
              <div className="text-sm text-gray-600">Response Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">{summaryData.summary.totalGuests}</div>
              <div className="text-sm text-gray-600">Total Guests</div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium mb-3">Event Attendance</h4>
              <div className="space-y-2">
                <div className="font-medium text-blue-700">Saturday:</div>
                <div className="ml-4 flex justify-between">
                  <span>Beers & Cheers</span>
                  <span className="font-medium">{summaryData.eventAttendance.beersAndCheers}</span>
                </div>
                <div className="font-medium text-blue-700 mt-2">Sunday:</div>
                <div className="ml-4 flex justify-between">
                  <span>Ceremony</span>
                  <span className="font-medium">{summaryData.eventAttendance.ceremony}</span>
                </div>
                <div className="ml-4 flex justify-between">
                  <span>Cocktail Hour</span>
                  <span className="font-medium">{summaryData.eventAttendance.cocktailHour}</span>
                </div>
                <div className="ml-4 flex justify-between">
                  <span>Reception</span>
                  <span className="font-medium">{summaryData.eventAttendance.reception}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Sunday Reception Entrées</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Beef Entrée</span>
                  <span className="font-medium">{summaryData.entreeSelections.beef}</span>
                </div>
                <div className="flex justify-between">
                  <span>Fish Entrée</span>
                  <span className="font-medium">{summaryData.entreeSelections.fish}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vegetarian/Vegan</span>
                  <span className="font-medium">{summaryData.entreeSelections.vegetarianVegan}</span>
                </div>
                <div className="flex justify-between">
                  <span>Kid's Chicken</span>
                  <span className="font-medium">{summaryData.entreeSelections.kidsChicken}</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-3">Dietary Restrictions</h4>
              <div className="space-y-2">
                {Object.entries(summaryData.dietaryRestrictions)
                  .filter(([_, count]) => count > 0)
                  .map(([restriction, count]) => (
                    <div key={restriction} className="flex justify-between">
                      <span className="capitalize">{restriction.replace(/([A-Z])/g, " $1")}</span>
                      <span className="font-medium">{count}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: "#294a46" }}>
            <Download className="w-5 h-5" />
            Export Responses
          </CardTitle>
          <CardDescription>Download RSVP data in various formats</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="export-format">Export Format</Label>
            <Select value={exportFormat} onValueChange={(value: "csv" | "json" | "pdf") => setExportFormat(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV (Spreadsheet)</SelectItem>
                <SelectItem value="json">JSON (Raw Data)</SelectItem>
                <SelectItem value="pdf">Summary Report (JSON)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="text-sm text-gray-600">
            {exportFormat === "csv" && "Export as CSV file for use in Excel or Google Sheets"}
            {exportFormat === "json" && "Export raw data in JSON format for developers"}
            {exportFormat === "pdf" && "Export summary report with statistics and full data"}
          </div>

          <Button onClick={handleExport} disabled={isExporting} className="w-full">
            {isExporting ? (
              "Exporting..."
            ) : (
              <>
                <FileText className="w-4 h-4 mr-2" />
                Export {exportFormat.toUpperCase()}
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
