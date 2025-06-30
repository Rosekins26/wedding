"use client"

import type React from "react"

import { useState } from "react"
import type { Invitation } from "../types/rsvp"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Search, RefreshCw } from "lucide-react"

interface InvitationSearchProps {
  invitations: Invitation[]
  onInvitationFound: (invitation: Invitation) => void
}

export function InvitationSearch({ invitations, onInvitationFound }: InvitationSearchProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [error, setError] = useState("")

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setError("Please enter a name to search")
      return
    }

    const found = invitations.find((invitation) =>
      invitation.primaryGuestName.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    if (found) {
      setError("")
      onInvitationFound(found)
    } else {
      setError("No invitation found. Please check the spelling or contact the couple.")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  const getStatusInfo = (invitation: Invitation) => {
    if (invitation.submissions.length === 0) {
      return { badge: <Badge variant="secondary">Not Responded</Badge>, message: "" }
    } else if (invitation.submissions.length === 1) {
      return {
        badge: (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Responded
          </Badge>
        ),
        message: `Last updated: ${invitation.currentSubmission?.submittedAt.toLocaleDateString()}`,
      }
    } else {
      return {
        badge: (
          <Badge variant="default" className="bg-blue-100 text-blue-800">
            Updated {invitation.submissions.length} times
          </Badge>
        ),
        message: `Last updated: ${invitation.currentSubmission?.submittedAt.toLocaleDateString()}`,
      }
    }
  }

  // Show preview of found invitation
  const previewInvitation = invitations.find(
    (invitation) => searchTerm && invitation.primaryGuestName.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <Card className="w-full max-w-md mx-auto" style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold" style={{ color: "#294a46" }}>
            Wedding RSVP
          </CardTitle>
          <CardDescription style={{ color: "#294a46", fontSize: "16px" }}>
            Please refer to the envelope to look up your RSVP. Enter your name as it appears.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="search" className="text-lg font-medium">
              Name on Invitation
            </Label>
            <Input
              id="search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your name as it appears"
              className="mt-1 text-lg"
            />
          </div>

          {error && (
            <div className="text-sm p-3 rounded-md" style={{ color: "#294a46", backgroundColor: "#ffe6e6" }}>
              {error}
            </div>
          )}

          <Button onClick={handleSearch} className="w-full text-lg font-medium">
            <Search className="w-4 h-4 mr-2" />
            Find My Invitation
          </Button>

          <div className="text-sm text-gray-500 text-center">
            Having trouble? Contact us at lilyandterron2026@gmail.com
          </div>
        </CardContent>
      </Card>

      {previewInvitation && (
        <Card className="w-full max-w-md mx-auto" style={{ backgroundColor: "#f8f9fa", color: "#294a46" }}>
          <CardHeader>
            <CardTitle className="text-lg">Found Invitation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{previewInvitation.primaryGuestName}</span>
                {getStatusInfo(previewInvitation).badge}
              </div>
              <div className="text-sm text-gray-600">Party size: {previewInvitation.partySize}</div>
              {getStatusInfo(previewInvitation).message && (
                <div className="text-sm text-gray-600">{getStatusInfo(previewInvitation).message}</div>
              )}
              {previewInvitation.submissions.length > 0 && (
                <div className="flex items-center gap-1 text-sm text-blue-600">
                  <RefreshCw className="w-3 h-3" />
                  You can update your RSVP anytime
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
