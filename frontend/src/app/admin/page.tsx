'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonButton } from '@/components/ui/NeonButton'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface Event {
  id: string
  title: string
  description: string
  date: string
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
  const { user, logout } = useAuth()

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [eventsData, reservationsData] = await Promise.all([
        apiClient.get('/events/all', localStorage.getItem('token') || undefined),
        apiClient.get('/reservations', localStorage.getItem('token') || undefined)
      ])

      setEvents(eventsData)
      setReservations(reservationsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Calculate Stats
  const upcomingEvents = events.filter(e => new Date(e.date) > new Date()).length
  const totalCapacity = events.reduce((acc, e) => acc + e.capacity, 0)
  const confirmedQuantity = reservations
    .filter(r => r.status === 'CONFIRMED')
    .reduce((acc, r) => acc + r.quantity, 0)

  const occupancyRate = totalCapacity > 0 ? (confirmedQuantity / totalCapacity) * 100 : 0

  const statusCounts = {
    PENDING: reservations.filter(r => r.status === 'PENDING').length,
    CONFIRMED: reservations.filter(r => r.status === 'CONFIRMED').length,
    REFUSED: reservations.filter(r => r.status === 'REFUSED').length,
    CANCELED: reservations.filter(r => r.status === 'CANCELED').length,
  }

  const handleConfirmReservation = async (reservationId: string) => {
    try {
      await apiClient.patch(`/reservations/${reservationId}/confirm`, {}, localStorage.getItem('token') || undefined)
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to confirm reservation')
    }
  }

  const handleRefuseReservation = async (reservationId: string) => {
    try {
      await apiClient.patch(`/reservations/${reservationId}/refuse`, {}, localStorage.getItem('token') || undefined)
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refuse reservation')
    }
  }

  const handlePublishEvent = async (eventId: string) => {
    try {
      await apiClient.patch(`/events/${eventId}/publish`, {}, localStorage.getItem('token') || undefined)
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish event')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to PERMANENTLY delete this event? This action cannot be undone.')) {
      return
    }

    try {
      await apiClient.delete(`/events/${eventId}`, localStorage.getItem('token') || undefined)
      fetchData()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete event')
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-medium uppercase tracking-[0.3em] animate-pulse">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6 relative overflow-hidden bg-slate-950">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-pink-500 to-cyan-500 opacity-20" />
        <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-pink-500/20 bg-pink-500/5 backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-[0.2em] text-pink-400 uppercase">Privileged Access</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none">
              Command <span className="text-gradient">Center</span>
            </h1>
          </div>
          <div className="flex gap-4">
            <NeonButton variant="ghost" onClick={logout} className="border-white/5">Sign Out</NeonButton>
          </div>
        </div>

        {error && (
          <div className="mb-12 p-6 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 font-bold italic text-center">
            {error}
          </div>
        )}

        {/* Analytics Indicators */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          <GlassCard className="border-violet-500/10 py-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Active Experiences</p>
            <h4 className="text-4xl font-black text-white italic">{upcomingEvents}</h4>
            <div className="mt-4 h-1 w-12 bg-violet-500 rounded-full" />
          </GlassCard>

          <GlassCard className="border-pink-500/10 py-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Global Occupancy</p>
            <h4 className="text-4xl font-black text-white italic">{occupancyRate.toFixed(1)}%</h4>
            <div className="mt-4 h-1 w-12 bg-pink-500 rounded-full" />
          </GlassCard>

          <GlassCard className="border-cyan-500/10 py-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Pending Verification</p>
            <h4 className="text-4xl font-black text-white italic">{statusCounts.PENDING}</h4>
            <div className="mt-4 h-1 w-12 bg-cyan-500 rounded-full" />
          </GlassCard>

          <GlassCard className="border-green-500/10 py-8">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3">Secured Bookings</p>
            <h4 className="text-4xl font-black text-white italic">{statusCounts.CONFIRMED}</h4>
            <div className="mt-4 h-1 w-12 bg-green-500 rounded-full" />
          </GlassCard>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
          {/* Events Management */}
          <div className="space-y-8">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-2xl font-black text-white italic tracking-tight uppercase">Event Registry</h2>
              <Link href="/events/new">
                <NeonButton variant="primary" size="sm">+ New Entry</NeonButton>
              </Link>
            </div>

            <div className="space-y-6">
              {events.map((event) => (
                <GlassCard key={event.id} className="border-white/5 hover:border-violet-500/20 transition-all duration-500 py-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-xl font-black text-white italic tracking-tight mb-2">{event.title}</h3>
                      <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest leading-relaxed">
                        {new Date(event.date).toLocaleDateString()} • {event.location}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${event.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-slate-500/10 text-slate-400 border border-slate-500/20'
                        }`}>
                        {event.status}
                      </span>
                      <div className="flex gap-2">
                        {event.status === 'DRAFT' && (
                          <button
                            onClick={() => handlePublishEvent(event.id)}
                            className="px-3 py-1 rounded-lg bg-violet-600/10 text-violet-400 text-[9px] font-black uppercase tracking-widest hover:bg-violet-600/20 border border-violet-600/20 transition-all"
                          >
                            Publish
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="px-3 py-1 rounded-lg bg-red-600/10 text-red-400 text-[9px] font-black uppercase tracking-widest hover:bg-red-600/20 border border-red-600/20 transition-all"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>

          {/* Reservations Management */}
          <div className="space-y-8">
            <h2 className="text-2xl font-black text-white italic tracking-tight uppercase px-2">Reservation Buffer</h2>

            <div className="space-y-6">
              {reservations.map((reservation) => (
                <GlassCard key={reservation.id} className="border-white/5 hover:border-pink-500/20 transition-all duration-500 py-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex-1">
                      <h3 className="text-lg font-black text-white italic tracking-tight mb-2 truncate max-w-[200px]">{reservation.event.title}</h3>
                      <div className="space-y-1">
                        <p className="text-slate-400 text-xs font-bold">{reservation.user.name} • {reservation.user.email}</p>
                        <p className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                          {reservation.quantity} Units • Sent {new Date(reservation.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${reservation.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400' :
                        reservation.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400' :
                          'bg-red-500/10 text-red-400'
                        }`}>
                        {reservation.status}
                      </span>

                      {reservation.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleConfirmReservation(reservation.id)}
                            className="w-8 h-8 rounded-lg bg-green-500/10 text-green-400 flex items-center justify-center hover:bg-green-500/20 border border-green-500/20 transition-all"
                          >✓</button>
                          <button
                            onClick={() => handleRefuseReservation(reservation.id)}
                            className="w-8 h-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 border border-red-500/20 transition-all"
                          >✕</button>
                        </div>
                      )}
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
