"use client"

import { useState } from "react"
import type { Invitation, Guest } from "../types/rsvp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Send } from "lucide-react"

interface EmailSenderProps {
  invitation: Invitation
  guests: Guest[]
  isUpdate?: boolean
}

export function EmailSender({ invitation, guests, isUpdate = false }: EmailSenderProps) {
  const [email, setEmail] = useState(invitation.email)
  const [isCustomEmail, setIsCustomEmail] = useState(false)
  const [customEmail, setCustomEmail] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sent, setSent] = useState(false)

  const formatDietaryRestrictions = (restrictions: Guest["dietaryRestrictions"]) => {
    const selected = Object.entries(restrictions)
      .filter(([key, value]) => key !== "other" && value === true)
      .map(([key]) => key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1"))

    if (restrictions.other) {
      selected.push(restrictions.other)
    }

    return selected.length > 0 ? selected.join(", ") : "None specified"
  }

  const eventNames = {
    beersAndCheers: "Saturday: Beers and Cheers with Bride and Groom",
    ceremony: "Sunday: Wedding Ceremony",
    cocktailHour: "Sunday: Cocktail Hour",
    reception: "Sunday: Reception Dinner",
  }

  const generateEmailContent = () => {
    let content = `Dear ${invitation.primaryGuestName},\n\n`

    if (isUpdate) {
      content += `Thank you for updating your RSVP! Here's your latest response:\n\n`
      content += `This is submission #${invitation.submissions.length + 1} for your party.\n\n`
    } else {
      content += `Thank you for your RSVP! Here's a summary of your response:\n\n`
    }

    content += `Party Size: ${guests.length} ${guests.length === 1 ? "guest" : "guests"}\n\n`

    content += `WEDDING WEEKEND SCHEDULE:\n`
    content += `Saturday: Beers and Cheers with Bride and Groom (12:00 PM - 3:00 PM)\n`
    content += `Sunday: Wedding Ceremony (4:30 PM), Cocktail Hour (5:00 PM), Reception (6:00 PM - 10:00 PM)\n\n`

    guests.forEach((guest, index) => {
      content += `Guest ${index + 1}: ${guest.name}\n`

      const attendingEvents = Object.entries(guest.events)
        .filter(([_, attending]) => attending)
        .map(([event, _]) => eventNames[event as keyof typeof eventNames])

      content += `  Attending: ${attendingEvents.length > 0 ? attendingEvents.join(", ") : "No events selected"}\n`

      // Add entrée selection if attending Sunday reception
      if (guest.events.reception) {
        let entreeChoice = "No selection"
        if (guest.entreeSelection.beef) entreeChoice = "Beef Entrée"
        else if (guest.entreeSelection.fish) entreeChoice = "Fish Entrée"
        else if (guest.entreeSelection.vegetarianVegan) entreeChoice = "Vegetarian/Vegan Entrée"
        else if (guest.entreeSelection.kidsChicken) entreeChoice = "Kid's Only - Chicken Entrée"

        content += `  Sunday Reception Entrée: ${entreeChoice}\n`
      }

      content += `  Dietary Restrictions: ${formatDietaryRestrictions(guest.dietaryRestrictions)}\n\n`
    })

    if (isUpdate) {
      content += `Remember: You can update your RSVP anytime by searching for your name again.\n\n`
    }

    content += `We're so excited to celebrate with you over the wedding weekend!\n\n`
    content += `Best regards,\nLily & Terron`

    return content
  }

  const handleSendEmail = async () => {
    setIsSending(true)

    // Simulate email sending
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setSent(true)
    setIsSending(false)
  }

  if (sent) {
    return (
      <Card className="border-green-200" style={{ backgroundColor: "white" }}>
        <CardContent className="pt-6 text-center">
          <Mail className="w-12 h-12 text-green-500 mx-auto mb-4" />
          <p className="font-medium" style={{ color: "#294a46" }}>
            {isUpdate ? "Update confirmation" : "Confirmation"} email sent successfully!
          </p>
          <p className="text-sm text-gray-600 mt-2">
            RSVP {isUpdate ? "update" : "confirmation"} has been sent to {isCustomEmail ? customEmail : email}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ backgroundColor: "white", color: "#294a46" }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          Send RSVP {isUpdate ? "Update" : "Confirmation"}
        </CardTitle>
        <CardDescription>Send a copy of the {isUpdate ? "updated" : ""} RSVP details to the guest</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Send to email address</Label>
          <div className="flex items-center space-x-2 mt-1">
            <Button variant={!isCustomEmail ? "default" : "outline"} size="sm" onClick={() => setIsCustomEmail(false)}>
              Use invitation email
            </Button>
            <Button variant={isCustomEmail ? "default" : "outline"} size="sm" onClick={() => setIsCustomEmail(true)}>
              Custom email
            </Button>
          </div>

          {isCustomEmail ? (
            <Input
              value={customEmail}
              onChange={(e) => setCustomEmail(e.target.value)}
              placeholder="Enter email address"
              type="email"
              className="mt-2"
            />
          ) : (
            <Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2" type="email" />
          )}
        </div>

        <div>
          <Label>Email Preview</Label>
          <Textarea value={generateEmailContent()} readOnly className="mt-1 min-h-[200px] text-sm" />
        </div>

        <Button
          onClick={handleSendEmail}
          disabled={isSending || (!isCustomEmail && !email) || (isCustomEmail && !customEmail)}
          className="w-full"
        >
          {isSending ? (
            "Sending..."
          ) : (
            <>
              <Send className="w-4 h-4 mr-2" />
              Send {isUpdate ? "Update" : "Confirmation"} Email
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
