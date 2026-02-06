import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to Eventia
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professional Event Booking Platform
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Link 
              href="/events" 
              className="bg-blue-600 text-white p-6 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-2">Browse Events</h2>
              <p>View available events and book your spot</p>
            </Link>
            
            <Link 
              href="/auth/login" 
              className="bg-green-600 text-white p-6 rounded-lg hover:bg-green-700 transition-colors"
            >
              <h2 className="text-2xl font-semibold mb-2">Sign In</h2>
              <p>Access your account and manage bookings</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
