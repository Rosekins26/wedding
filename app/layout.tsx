import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display } from "next/font/google"
import "./globals.css"

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
})

export const metadata: Metadata = {
  title: "Wedding RSVP",
  description: "Wedding RSVP System",
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={playfairDisplay.className}>{children}</body>
    </html>
  )
}
