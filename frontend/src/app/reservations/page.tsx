'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonButton } from '@/components/ui/NeonButton'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

interface Reservation {
  id: string
  quantity: number
  status: string
  createdAt: string
  event: {
    title: string
    date: string
    location: string
  }
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isAuthenticated, isLoading: authLoading } = useAuth()

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchReservations()
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false)
    }
  }, [isAuthenticated, authLoading])

  const fetchReservations = async () => {
    try {
      const data = await apiClient.get('/reservations/my', localStorage.getItem('token') || undefined)
      setReservations(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load reservations')
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (reservationId: string) => {
    try {
      const blob = await apiClient.getFile(`/pdf/ticket/${reservationId}`, localStorage.getItem('token') || undefined)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ticket-${reservationId}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Download failed')
    }
  }

  if (loading || authLoading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin mb-6"></div>
        <p className="text-slate-500 font-bold uppercase tracking-widest animate-pulse">Loading reservations...</p>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <GlassCard className="max-w-md w-full text-center border-white/5 bg-white/[0.02] shadow-2xl">
          <span className="text-6xl mb-8 block">🔒</span>
          <h2 className="text-3xl font-bold text-white mb-4 italic tracking-tighter uppercase">Access Required</h2>
          <p className="text-slate-400 font-medium mb-12">Please sign in to view your reservations.</p>
          <Link href="/auth/login">
            <NeonButton variant="primary" fullWidth size="lg">Sign In</NeonButton>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6 relative overflow-hidden">
      {/* Background Dynamics */}
      <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto max-w-5xl z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-10">
          <div>
            <div className="inline-block px-3 py-1 mb-4 rounded-full border border-violet-500/20 bg-violet-500/5 backdrop-blur-md">
              <span className="text-[10px] font-bold tracking-[0.2em] text-violet-400 uppercase">Personal Dossier</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-black text-white italic tracking-tighter leading-none">
              My <span className="text-gradient">Reservations</span>
            </h1>
          </div>
          <Link href="/events">
            <NeonButton variant="ghost" size="lg" className="border-white/10">Browse Gallery</NeonButton>
          </Link>
        </div>

        {error ? (
          <GlassCard className="text-center py-20 border-red-500/20">
            <p className="text-red-400 font-bold mb-8 italic">{error}</p>
            <NeonButton onClick={fetchReservations} variant="primary">Attempt Sync</NeonButton>
          </GlassCard>
        ) : reservations.length === 0 ? (
          <GlassCard className="text-center py-40 border-white/5 bg-white/[0.02]">
            <div className="text-6xl mb-10 opacity-30">🎫</div>
            <p className="text-slate-400 text-3xl font-black italic tracking-tighter mb-4 uppercase">No Bookings</p>
            <p className="text-slate-500 font-medium mb-12">You have not made any event reservations yet.</p>
            <Link href="/events">
              <NeonButton variant="primary" size="lg">Browse Events</NeonButton>
            </Link>
          </GlassCard>
        ) : (
          <div className="space-y-12">
            {reservations.map((reservation) => (
              <GlassCard key={reservation.id} className="group relative border-white/5 hover:border-white/10 transition-all duration-700 overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-transparent pointer-events-none" />

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-12 relative z-10">
                  <div className="flex-1">
                    <div className="flex items-center gap-6 mb-6">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${reservation.status === 'CONFIRMED' ? 'bg-green-500/10 text-green-400 border border-green-500/30' :
                        reservation.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' :
                          'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                        {reservation.status}
                      </span>
                      <span className="text-slate-600 text-[10px] font-black uppercase tracking-widest">
                        Logged: {new Date(reservation.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <h3 className="text-3xl font-black text-white italic group-hover:text-gradient transition-all duration-500 mb-6 tracking-tighter">
                      {reservation.event.title}
                    </h3>

                    <div className="flex flex-wrap gap-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">📍</span>
                        <span className="truncate max-w-[200px]">{reservation.event.location}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xl">🗓️</span>
                        <span>{new Date(reservation.event.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-3 text-white">
                        <span className="text-xl">🎫</span>
                        <span>{reservation.quantity} Tickets</span>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
                    {reservation.status === 'CONFIRMED' && (
                      <NeonButton variant="secondary" size="md" onClick={() => handleDownload(reservation.id)}>
                        Download Ticket
                      </NeonButton>
                    )}
                    <Link href={`/events/${reservation.id}`} className="flex-1">
                      <NeonButton variant="ghost" size="md" fullWidth className="border-white/10">View Details</NeonButton>
                    </Link>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      <footer className="mt-40 py-20 border-t border-white/5 text-center">
        <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Eventia Digital Ecosystem &copy; 2024</p>
      </footer>
    </div>
  )
}
