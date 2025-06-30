"use client"

import { useState, useEffect } from "react"
import { AdminLogin } from "../../components/admin-login"
import { AdminDashboard } from "../../components/admin-dashboard"

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already authenticated
    const adminAuth = localStorage.getItem("admin-authenticated")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  const handleAdminLogin = () => {
    setIsAuthenticated(true)
    localStorage.setItem("admin-authenticated", "true")
  }

  const handleAdminLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem("admin-authenticated")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#fff2cc" }}>
        <div className="text-xl" style={{ color: "#294a46" }}>
          Loading...
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleAdminLogin} />
  }

  return <AdminDashboard onLogout={handleAdminLogout} />
}
