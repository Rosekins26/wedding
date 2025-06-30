"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle, Database, Play, Loader2 } from "lucide-react"

export function DatabaseSetup() {
  const [adminPassword, setAdminPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [currentStep, setCurrentStep] = useState("")

  const runSetupStep = async (action: string, stepName: string) => {
    setCurrentStep(stepName)
    setIsLoading(true)

    try {
      const response = await fetch("/api/admin/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action, adminPassword }),
      })

      const result = await response.json()

      setResults((prev) => [
        ...prev,
        {
          step: stepName,
          success: result.success,
          message: result.message,
          error: result.error,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])

      return result.success
    } catch (error) {
      setResults((prev) => [
        ...prev,
        {
          step: stepName,
          success: false,
          message: "",
          error: error.message,
          timestamp: new Date().toLocaleTimeString(),
        },
      ])
      return false
    } finally {
      setIsLoading(false)
      setCurrentStep("")
    }
  }

  const runFullSetup = async () => {
    if (!adminPassword.trim()) {
      alert("Please enter the admin password")
      return
    }

    setResults([])

    // Step 1: Check connection
    const connectionSuccess = await runSetupStep("check-connection", "Database Connection")
    if (!connectionSuccess) return

    // Step 2: Initialize tables
    const initSuccess = await runSetupStep("initialize", "Create Tables")
    if (!initSuccess) return

    // Step 3: Seed sample data
    await runSetupStep("seed", "Seed Sample Data")
  }

  const runSingleStep = async (action: string, stepName: string) => {
    if (!adminPassword.trim()) {
      alert("Please enter the admin password")
      return
    }

    await runSetupStep(action, stepName)
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <Card style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Database Setup
          </CardTitle>
          <CardDescription>Initialize your wedding RSVP database with tables and sample data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="adminPassword">Admin Password</Label>
            <Input
              id="adminPassword"
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              placeholder="Enter admin password"
              className="mt-1"
            />
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold">Setup Options:</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button onClick={() => runFullSetup()} disabled={isLoading} className="w-full">
                {isLoading && currentStep ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {currentStep}...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Full Setup
                  </>
                )}
              </Button>

              <Button
                onClick={() => runSingleStep("check-connection", "Database Connection")}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Test Connection
              </Button>

              <Button
                onClick={() => runSingleStep("initialize", "Create Tables")}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Create Tables
              </Button>

              <Button
                onClick={() => runSingleStep("seed", "Seed Sample Data")}
                disabled={isLoading}
                variant="outline"
                className="w-full"
              >
                Add Sample Data
              </Button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="space-y-3">
              <h3 className="font-semibold">Setup Results:</h3>
              {results.map((result, index) => (
                <Alert key={index} className={result.success ? "border-green-200" : "border-red-200"}>
                  <div className="flex items-center gap-2">
                    {result.success ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-red-600" />
                    )}
                    <span className="font-medium">{result.step}</span>
                    <span className="text-sm text-gray-500">({result.timestamp})</span>
                  </div>
                  <AlertDescription className="mt-2">{result.success ? result.message : result.error}</AlertDescription>
                </Alert>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-600 space-y-2">
            <p>
              <strong>Full Setup</strong> will:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Test your database connection</li>
              <li>Create all necessary tables (invitations, rsvp_submissions, guests)</li>
              <li>Add sample invitation data for testing</li>
              <li>Create database indexes for performance</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
