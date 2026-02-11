'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonButton } from '@/components/ui/NeonButton'
import { apiClient } from '@/lib/api'

interface Event {
  id: string
  title: string
  description: string
  date: string
  location: string
  capacity: number
  status: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = await apiClient.get('/events')
      setEvents(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="text-center z-10">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-500 mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto max-w-7xl z-10 relative">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-white mb-2">
              Available <span className="text-gradient">Events</span>
            </h1>
            <p className="text-slate-400">Discover and book extraordinary experiences.</p>
          </div>
          <Link href="/">
            <NeonButton variant="secondary">Back to Home</NeonButton>
          </Link>
        </div>

        {error && (
          <GlassCard className="mb-8 border-red-500/20 text-center">
            <p className="text-red-200 mb-4">{error}</p>
            <NeonButton onClick={fetchEvents} variant="primary">Try Again</NeonButton>
          </GlassCard>
        )}

        {events.length === 0 && !error ? (
          <GlassCard className="text-center py-20">
            <p className="text-slate-400 text-lg">No events found. Check back later!</p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <GlassCard key={event.id} className="flex flex-col hover:scale-[1.02] transition-transform duration-300">
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white group-hover:text-violet-400 transition-colors">
                      {event.title}
                    </h3>
                    <span className="px-3 py-1 bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-semibold rounded-full uppercase tracking-wider">
                      {event.status}
                    </span>
                  </div>
                  <p className="text-slate-400 mb-6 line-clamp-3 leading-relaxed">
                    {event.description}
                  </p>

                  <div className="space-y-3 text-sm text-slate-300 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-violet-400">
                        🗓️
                      </div>
                      <span>{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'long' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-pink-400">
                        📍
                      </div>
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-cyan-400">
                        👥
                      </div>
                      <span>{event.capacity} spots remaining</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-4 border-t border-white/5">
                  <Link href={`/events/${event.id}`}>
                    <NeonButton fullWidth variant="primary">View Details</NeonButton>
                  </Link>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
