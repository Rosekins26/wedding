"use client"

import { useState } from "react"
import type { Invitation, InvitationType } from "../types/rsvp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Plus, Save, X, Info } from "lucide-react"
import { format } from "date-fns"

interface AddInvitationProps {
  onAddInvitation: (invitation: Invitation) => void
  onCancel: () => void
}

interface NewInvitationForm {
  primaryGuestName: string
  email: string
  partySize: number
  phone: string
  address: string
  specialNotes: string
  invitationType: InvitationType
  tableAssignment: string
  invitationSentDate: Date | undefined
  rsvpDeadline: Date | undefined
}

export function AddInvitation({ onAddInvitation, onCancel }: AddInvitationProps) {
  const [formData, setFormData] = useState<NewInvitationForm>({
    primaryGuestName: "",
    email: "",
    partySize: 1,
    phone: "",
    address: "",
    specialNotes: "",
    invitationType: "standard",
    tableAssignment: "",
    invitationSentDate: undefined,
    rsvpDeadline: undefined,
  })

  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = (): boolean => {
    const newErrors: string[] = []

    if (!formData.primaryGuestName.trim()) {
      newErrors.push("Primary guest name is required")
    }

    if (!formData.email.trim()) {
      newErrors.push("Email address is required")
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.push("Please enter a valid email address")
    }

    if (formData.partySize < 1 || formData.partySize > 20) {
      newErrors.push("Party size must be between 1 and 20")
    }

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

    // Create new invitation
    const newInvitation: Invitation = {
      id: `inv-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      primaryGuestName: formData.primaryGuestName.trim(),
      email: formData.email.trim().toLowerCase(),
      partySize: formData.partySize,
      rsvpStatus: "pending",
      submissions: [],
      invitationType: formData.invitationType,
      metadata: {
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        specialNotes: formData.specialNotes.trim(),
        tableAssignment: formData.tableAssignment.trim(),
        invitationSentDate: formData.invitationSentDate,
        rsvpDeadline: formData.rsvpDeadline,
        createdAt: new Date(),
      },
    }

    onAddInvitation(newInvitation)
    setIsSubmitting(false)
  }

  const updateField = (field: keyof NewInvitationForm, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const getInvitationTypeDescription = (type: InvitationType) => {
    switch (type) {
      case "standard":
        return "Regular wedding guests - Access to Saturday Beers & Cheers and all Sunday events"
      case "family":
        return "Family members - Access to all events including Monday's after party brunch"
      case "bridal-party":
        return "Bridal party members - Access to all events including Friday bowling"
      case "plus-one":
        return "Guest with plus one(s) - Access to Saturday Beers & Cheers and all Sunday events"
      default:
        return ""
    }
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <Card style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl font-bold flex items-center gap-2" style={{ color: "#294a46" }}>
                <Plus className="w-6 h-6" />
                Add New Invitation
              </CardTitle>
              <CardDescription>Create a new wedding invitation for guests</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {errors.length > 0 && (
            <div className="p-4 border border-red-200 rounded-lg" style={{ backgroundColor: "#ffe6e6" }}>
              <p className="font-medium mb-2" style={{ color: "#294a46" }}>
                Please fix the following errors:
              </p>
              <ul className="list-disc list-inside space-y-1">
                {errors.map((error, index) => (
                  <li key={index} className="text-sm" style={{ color: "#294a46" }}>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Required Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#294a46" }}>
              Required Information
            </h3>

            <div>
              <Label htmlFor="primaryGuestName" className="text-base font-medium">
                Primary Guest Name *
              </Label>
              <Input
                id="primaryGuestName"
                value={formData.primaryGuestName}
                onChange={(e) => updateField("primaryGuestName", e.target.value)}
                placeholder="e.g., Mr. & Mrs. Smith, John Smith, The Johnson Family"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">Enter the name exactly as it should appear on the invitation</p>
            </div>

            <div>
              <Label htmlFor="email" className="text-base font-medium">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                placeholder="guest@email.com"
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">Used for RSVP confirmations and updates</p>
            </div>

            <div>
              <Label htmlFor="partySize" className="text-base font-medium">
                Party Size *
              </Label>
              <Input
                id="partySize"
                type="number"
                min="1"
                max="20"
                value={formData.partySize}
                onChange={(e) => updateField("partySize", Number.parseInt(e.target.value) || 1)}
                className="mt-1"
              />
              <p className="text-sm text-gray-600 mt-1">Total number of guests in this party</p>
            </div>

            <div>
              <Label htmlFor="invitationType" className="text-base font-medium">
                Invitation Type *
              </Label>
              <Select
                value={formData.invitationType}
                onValueChange={(value: InvitationType) => updateField("invitationType", value)}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard Guest</SelectItem>
                  <SelectItem value="family">Family Member</SelectItem>
                  <SelectItem value="bridal-party">Bridal Party</SelectItem>
                  <SelectItem value="plus-one">Plus One(s)</SelectItem>
                </SelectContent>
              </Select>
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-blue-600 mt-0.5" />
                  <p className="text-sm text-blue-800">{getInvitationTypeDescription(formData.invitationType)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Optional Fields */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: "#294a46" }}>
              Optional Information
            </h3>

            <div>
              <Label htmlFor="phone" className="text-base font-medium">
                Phone Number
              </Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                placeholder="(555) 123-4567"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="address" className="text-base font-medium">
                Mailing Address
              </Label>
              <Textarea
                id="address"
                value={formData.address}
                onChange={(e) => updateField("address", e.target.value)}
                placeholder="123 Main St, City, State 12345"
                className="mt-1"
                rows={3}
              />
              <p className="text-sm text-gray-600 mt-1">For physical invitations and thank you cards</p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label className="text-base font-medium">Invitation Sent Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1 justify-start text-left font-normal"
                      style={{ color: formData.invitationSentDate ? "#294a46" : "#9ca3af" }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.invitationSentDate ? (
                        format(formData.invitationSentDate, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.invitationSentDate}
                      onSelect={(date) => updateField("invitationSentDate", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label className="text-base font-medium">RSVP Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full mt-1 justify-start text-left font-normal"
                      style={{ color: formData.rsvpDeadline ? "#294a46" : "#9ca3af" }}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.rsvpDeadline ? format(formData.rsvpDeadline, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.rsvpDeadline}
                      onSelect={(date) => updateField("rsvpDeadline", date)}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label htmlFor="tableAssignment" className="text-base font-medium">
                Table Assignment
              </Label>
              <Input
                id="tableAssignment"
                value={formData.tableAssignment}
                onChange={(e) => updateField("tableAssignment", e.target.value)}
                placeholder="e.g., Table 5, Head Table, Family Table"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="specialNotes" className="text-base font-medium">
                Special Notes
              </Label>
              <Textarea
                id="specialNotes"
                value={formData.specialNotes}
                onChange={(e) => updateField("specialNotes", e.target.value)}
                placeholder="Any special considerations, dietary restrictions, accessibility needs, etc."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button onClick={handleSubmit} disabled={isSubmitting} className="flex-1">
              {isSubmitting ? (
                "Creating Invitation..."
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Create Invitation
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
