'use client'

import { useState, useEffect } from 'react'
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

interface Reservation {
  id: string
  eventId: string
  event: Event
  user: {
    name: string
    email: string
  }
  status: string
  quantity: number
  createdAt: string
}

export default function AdminDashboard() {
  const [events, setEvents] = useState<Event[]>([])
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) {
        throw new Error('Not authenticated')
      }

      const [eventsRes, reservationsRes] = await Promise.all([
        fetch('/api/events', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        fetch('/api/reservations', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ])

      if (!eventsRes.ok || !reservationsRes.ok) {
        throw new Error('Failed to fetch admin data')
      }

      const eventsData = await eventsRes.json()
      const reservationsData = await reservationsRes.json()
      
      setEvents(eventsData)
      setReservations(reservationsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${reservationId}/confirm`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        // Refresh reservations list
        fetchData()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm reservation')
    }
  }

  const handleRefuseReservation = async (reservationId: string) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`/api/reservations/${reservationId}/refuse`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (response.ok) {
        // Refresh reservations list
        fetchData()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refuse reservation')
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
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <Link 
            href="/"
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
          >
            Logout
          </Link>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Events Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Events Management</h2>
            <Link 
              href="/admin/events/new"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 mb-4 text-center"
            >
              Create New Event
            </Link>
            
            <div className="space-y-4">
              {events.slice(0, 5).map((event) => (
                <div key={event.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <div className="text-sm text-gray-600">
                        {new Date(event.date).toLocaleDateString()} • {event.time}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                        event.status === 'PUBLISHED' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {events.length > 5 && (
              <Link 
                href="/admin/events"
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 text-center"
              >
                View All Events
              </Link>
            )}
          </div>

          {/* Reservations Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Reservations Management</h2>
            
            <div className="space-y-4">
              {reservations.slice(0, 5).map((reservation) => (
                <div key={reservation.id} className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{reservation.event.title}</h3>
                      <div className="text-sm text-gray-600">
                        <div>{reservation.user.name} • {reservation.user.email}</div>
                        <div>Quantity: {reservation.quantity} spots</div>
                        <div>Booked: {new Date(reservation.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2">
                      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                        {reservation.status}
                      </span>
                      
                      {reservation.status === 'PENDING' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleConfirmReservation(reservation.id)}
                            className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => handleRefuseReservation(reservation.id)}
                            className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700"
                          >
                            Refuse
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {reservations.length > 5 && (
              <Link 
                href="/admin/reservations"
                className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 text-center"
              >
                View All Reservations
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
