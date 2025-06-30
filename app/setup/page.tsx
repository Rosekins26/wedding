import { DatabaseSetup } from "../../components/database-setup"

export default function SetupPage() {
  return (
    <div className="min-h-screen py-8 px-4" style={{ backgroundColor: "#fff2cc" }}>
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4" style={{ color: "#294a46" }}>
            Wedding RSVP Database Setup
          </h1>
          <p className="text-lg" style={{ color: "#294a46" }}>
            Initialize your database for the wedding RSVP system
          </p>
        </div>

        <DatabaseSetup />

        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            After setup is complete, you can access the{" "}
            <a href="/admin" className="underline hover:text-blue-600">
              admin dashboard
            </a>{" "}
            or{" "}
            <a href="/" className="underline hover:text-blue-600">
              guest RSVP form
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
