"use client"

import { useState } from "react"
import type { Invitation, Guest } from "../types/rsvp"
import { mockInvitations } from "../data/invitations"
import { ExportResponses } from "./export-responses"
import { AddInvitation } from "./add-invitation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Settings, Users, Plus, Mail, Phone, MapPin, LogOut, Search, Trash2 } from "lucide-react"

interface AdminDashboardProps {
  onLogout: () => void
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [invitations, setInvitations] = useState<Invitation[]>(mockInvitations)
  const [showAddInvitation, setShowAddInvitation] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedInvitations, setSelectedInvitations] = useState<string[]>([])

  // Mock completed responses - in a real app, this would come from a database
  const [completedResponses] = useState<Array<{ invitation: Invitation; guests: Guest[] }>>([
    {
      invitation: invitations[0],
      guests: [
        {
          name: "John Smith",
          events: {
            bowling: false,
            beersAndCheers: true,
            ceremony: true,
            cocktailHour: true,
            reception: true,
            afterPartyBrunch: true,
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
        {
          name: "Jane Smith",
          events: {
            bowling: false,
            beersAndCheers: true,
            ceremony: true,
            cocktailHour: true,
            reception: true,
            afterPartyBrunch: true,
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
      ],
    },
  ])

  const handleAddInvitation = (newInvitation: Invitation) => {
    setInvitations((prev) => [...prev, newInvitation])
    setShowAddInvitation(false)
  }

  const handleDeleteInvitations = () => {
    setInvitations((prev) => prev.filter((inv) => !selectedInvitations.includes(inv.id)))
    setSelectedInvitations([])
  }

  const handleSelectInvitation = (invitationId: string, checked: boolean) => {
    if (checked) {
      setSelectedInvitations((prev) => [...prev, invitationId])
    } else {
      setSelectedInvitations((prev) => prev.filter((id) => id !== invitationId))
    }
  }

  const getStatusBadge = (invitation: Invitation) => {
    const hasResponse = completedResponses.some((r) => r.invitation.id === invitation.id)
    return hasResponse ? (
      <Badge variant="default" className="bg-green-100 text-green-800">
        Completed
      </Badge>
    ) : (
      <Badge variant="secondary">Pending</Badge>
    )
  }

  const filteredInvitations = invitations.filter(
    (invitation) =>
      invitation.primaryGuestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invitation.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const stats = {
    totalInvitations: invitations.length,
    completedRSVPs: completedResponses.length,
    pendingRSVPs: invitations.length - completedResponses.length,
    totalGuests: completedResponses.reduce((sum, { guests }) => sum + guests.length, 0),
  }

  if (showAddInvitation) {
    return <AddInvitation onAddInvitation={handleAddInvitation} onCancel={() => setShowAddInvitation(false)} />
  }

  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#fff2cc" }}>
      <div className="w-full max-w-6xl mx-auto">
        <Card className="mb-6" style={{ backgroundColor: "white", color: "#294a46" }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2" style={{ color: "#294a46" }}>
                  <Settings className="w-5 h-5" />
                  Wedding RSVP Admin Dashboard
                </CardTitle>
                <CardDescription>Manage and monitor wedding RSVP responses</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setShowAddInvitation(true)} className="bg-[#56b6b2] hover:bg-[#4a9d99]">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Invitation
                </Button>
                <Button variant="outline" onClick={onLogout}>
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card style={{ backgroundColor: "white" }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-blue-600">{stats.totalInvitations}</div>
              <div className="text-sm text-gray-600">Total Invitations</div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: "white" }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-green-600">{stats.completedRSVPs}</div>
              <div className="text-sm text-gray-600">Completed RSVPs</div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: "white" }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-orange-600">{stats.pendingRSVPs}</div>
              <div className="text-sm text-gray-600">Pending RSVPs</div>
            </CardContent>
          </Card>
          <Card style={{ backgroundColor: "white" }}>
            <CardContent className="pt-6 text-center">
              <div className="text-2xl font-bold text-purple-600">{stats.totalGuests}</div>
              <div className="text-sm text-gray-600">Total Guests</div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="invitations">Invitations</TabsTrigger>
            <TabsTrigger value="export">Export Data</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <ExportResponses invitations={invitations} allResponses={completedResponses} />
          </TabsContent>

          <TabsContent value="invitations">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2" style={{ color: "#294a46" }}>
                      <Users className="w-5 h-5" />
                      All Invitations ({filteredInvitations.length})
                    </CardTitle>
                    <CardDescription>View and manage all wedding invitations</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {selectedInvitations.length > 0 && (
                      <Button variant="destructive" size="sm" onClick={handleDeleteInvitations}>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Selected ({selectedInvitations.length})
                      </Button>
                    )}
                    <Button
                      onClick={() => setShowAddInvitation(true)}
                      size="sm"
                      className="bg-[#56b6b2] hover:bg-[#4a9d99]"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add New
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <Label htmlFor="search">Search Invitations</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search by name or email..."
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  {filteredInvitations.map((invitation) => (
                    <div
                      key={invitation.id}
                      className="p-4 border rounded-lg"
                      style={{ backgroundColor: "#f9f9f9", color: "#294a46" }}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          <input
                            type="checkbox"
                            checked={selectedInvitations.includes(invitation.id)}
                            onChange={(e) => handleSelectInvitation(invitation.id, e.target.checked)}
                            className="mt-1"
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-lg">{invitation.primaryGuestName}</h4>
                              {getStatusBadge(invitation)}
                              <Badge variant="outline" className="capitalize">
                                {invitation.invitationType.replace("-", " ")}
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 text-sm">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4 text-gray-500" />
                                  <span>{invitation.email}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-500" />
                                  <span>Party size: {invitation.partySize}</span>
                                </div>
                                {(invitation as any).metadata?.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4 text-gray-500" />
                                    <span>{(invitation as any).metadata.phone}</span>
                                  </div>
                                )}
                              </div>

                              <div className="space-y-1">
                                {(invitation as any).metadata?.tableAssignment && (
                                  <div>
                                    <span className="font-medium">Table: </span>
                                    <span>{(invitation as any).metadata.tableAssignment}</span>
                                  </div>
                                )}
                                {(invitation as any).metadata?.rsvpDeadline && (
                                  <div>
                                    <span className="font-medium">RSVP by: </span>
                                    <span>
                                      {new Date((invitation as any).metadata.rsvpDeadline).toLocaleDateString()}
                                    </span>
                                  </div>
                                )}
                                {invitation.submissions.length > 0 && (
                                  <div>
                                    <span className="font-medium">Submissions: </span>
                                    <span>{invitation.submissions.length}</span>
                                  </div>
                                )}
                              </div>
                            </div>

                            {(invitation as any).metadata?.address && (
                              <div className="mt-2 flex items-start gap-2 text-sm">
                                <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                                <span>{(invitation as any).metadata.address}</span>
                              </div>
                            )}

                            {(invitation as any).metadata?.specialNotes && (
                              <div className="mt-2 p-2 bg-yellow-50 rounded text-sm">
                                <span className="font-medium">Notes: </span>
                                <span>{(invitation as any).metadata.specialNotes}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="export">
            <ExportResponses invitations={invitations} allResponses={completedResponses} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
