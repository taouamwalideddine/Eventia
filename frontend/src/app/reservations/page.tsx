'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface Reservation {
  id: string
  eventId: string
  event: {
    id: string
    title: string
    date: string
    time: string
    location: string
  }
  status: string
  quantity: number
  createdAt: string
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReservations()
  }, [])

  const fetchReservations = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/reservations/my', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch reservations')
      }
      
      const data = await response.json()
      setReservations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = async (reservationId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${reservationId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (!response.ok) {
        throw new Error('Failed to cancel reservation')
      }

      // Refresh reservations list
      fetchReservations()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel reservation')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800'
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800'
      case 'REFUSED':
        return 'bg-red-100 text-red-800'
      case 'CANCELED':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your reservations...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-600 text-xl mb-4">Error: {error}</div>
          <button 
            onClick={fetchReservations}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Reservations</h1>
          <Link 
            href="/events"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Browse Events
          </Link>
        </div>

        {reservations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">You don't have any reservations yet.</p>
            <Link 
              href="/events"
              className="inline-block mt-4 text-blue-600 hover:text-blue-800 font-medium"
            >
              Browse available events
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reservations.map((reservation) => (
              <div key={reservation.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">
                        {reservation.event.title}
                      </h3>
                      <div className="mt-2 space-y-1 text-sm text-gray-600">
                        <div>Date: {new Date(reservation.event.date).toLocaleDateString()}</div>
                        <div>Time: {reservation.event.time}</div>
                        <div>Location: {reservation.event.location}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-600">
                        <div>Quantity: {reservation.quantity} spot{reservation.quantity > 1 ? 's' : ''}</div>
                        <div>Booked on: {new Date(reservation.createdAt).toLocaleDateString()}</div>
                      </div>
                      
                      <div className="flex space-x-3">
                        {reservation.status === 'CONFIRMED' && (
                          <a
                            href={`/pdf/ticket/${reservation.id}`}
                            target="_blank"
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
                          >
                            Download Ticket
                          </a>
                        )}
                        
                        {reservation.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(reservation.id)}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
