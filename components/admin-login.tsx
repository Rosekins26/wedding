"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Shield, Eye, EyeOff } from "lucide-react"

interface AdminLoginProps {
  onLogin: () => void
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      })

      if (response.ok) {
        onLogin()
      } else {
        setError("Invalid admin password. Please try again.")
      }
    } catch (error) {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff2cc" }}>
      <Card className="w-full max-w-md mx-4" style={{ backgroundColor: "white", color: "#294a46" }}>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 rounded-full" style={{ backgroundColor: "#fff2cc" }}>
              <Shield className="w-8 h-8" style={{ color: "#294a46" }} />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold" style={{ color: "#294a46" }}>
            Admin Access
          </CardTitle>
          <CardDescription className="text-lg">
            Enter the admin password to access the wedding RSVP management dashboard
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="password" className="text-base font-medium">
                Admin Password
              </Label>
              <div className="relative mt-1">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="pr-10 text-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-md" style={{ backgroundColor: "#ffe6e6", color: "#294a46" }}>
                <p className="text-sm">{error}</p>
              </div>
            )}

            <Button type="submit" disabled={isLoading || !password.trim()} className="w-full text-lg font-medium">
              {isLoading ? "Verifying..." : "Access Admin Dashboard"}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              <a href="/" className="underline hover:text-blue-600">
                ← Back to Guest RSVP
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
