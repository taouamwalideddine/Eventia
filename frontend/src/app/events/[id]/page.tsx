'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface Event {
  id: string
  title: string
  description: string
  date: string
  time: string
  location: string
  capacity: number
  status: string
}

export default function EventDetailPage() {
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingQuantity, setBookingQuantity] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    if (params.id) {
      fetchEvent(params.id as string)
    }
  }, [params.id])

  const fetchEvent = async (eventId: string) => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (!response.ok) {
        throw new Error('Failed to fetch event details')
      }
      const data = await response.json()
      setEvent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!event) return

    setBookingLoading(true)
    setBookingError(null)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('/api/reservations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          eventId: event.id,
          quantity: bookingQuantity
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Booking failed')
      }

      router.push('/reservations')
    } catch (err) {
      setBookingError(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">
            {error || 'Event not found'}
          </div>
          <Link 
            href="/events"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Back to Events
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <Link 
          href="/events"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to Events
        </Link>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4">
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Date:</span>
                  <span className="ml-2">{new Date(event.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Time:</span>
                  <span className="ml-2">{event.time}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Location:</span>
                  <span className="ml-2">{event.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <span className="font-medium">Capacity:</span>
                  <span className="ml-2">{event.capacity} spots available</span>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-2">About this event</h3>
                <p className="text-gray-600">{event.description}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Spot</h3>
              
              {bookingError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                  {bookingError}
                </div>
              )}

              <div className="flex items-center space-x-4 mb-4">
                <label htmlFor="quantity" className="font-medium text-gray-700">
                  Number of spots:
                </label>
                <input
                  type="number"
                  id="quantity"
                  min="1"
                  max={Math.min(event.capacity, 10)}
                  value={bookingQuantity}
                  onChange={(e) => setBookingQuantity(parseInt(e.target.value) || 1)}
                  className="border border-gray-300 rounded px-3 py-2 w-24"
                />
              </div>

              <button
                onClick={handleBooking}
                disabled={bookingLoading}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {bookingLoading ? 'Booking...' : `Book ${bookingQuantity} spot${bookingQuantity > 1 ? 's' : ''}`}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
