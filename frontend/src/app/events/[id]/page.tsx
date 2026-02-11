'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
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
  price: number
  status: string
}

export default function EventDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const [event, setEvent] = useState<Event | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [bookingLoading, setBookingLoading] = useState(false)

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const data = await apiClient.get(`/events/${id}`)
      setEvent(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleBooking = async () => {
    if (!isAuthenticated) {
      router.push('/auth/login')
      return
    }

    if (quantity <= 0) {
      alert('Must select at least 1 ticket')
      return
    }

    if (event && quantity > event.capacity) {
      alert('Exceeds available capacity')
      return
    }

    setBookingLoading(true)
    try {
      await apiClient.post('/reservations', {
        eventId: Number(id),
        quantity,
      }, localStorage.getItem('token') || undefined)
      alert('Booking successful! Redirecting...')
      router.push('/reservations')
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Booking failed')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-violet-500/20 border-t-violet-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6 text-center">
        <GlassCard className="max-w-md w-full border-red-500/20 shadow-2xl">
          <span className="text-6xl mb-8 block">🔍</span>
          <p className="text-red-400 font-black mb-8 italic text-lg uppercase tracking-tight">{error || 'Experience Not Found'}</p>
          <Link href="/events">
            <NeonButton variant="ghost">Back to Collective</NeonButton>
          </Link>
        </GlassCard>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-6 relative overflow-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 right-[-10%] w-[600px] h-[600px] bg-pink-600/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto max-w-6xl z-10 relative">
        <Link href="/events" className="inline-flex items-center text-slate-500 hover:text-white mb-16 transition-all font-bold uppercase tracking-widest text-[10px] group">
          <span className="mr-3 group-hover:-translate-x-2 transition-transform duration-500">←</span> Back to Events
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-20">
          <div className="lg:col-span-2 space-y-12">
            <div className="space-y-6">
              <div className="flex gap-3">
                <span className="px-3 py-1 bg-violet-600/10 border border-violet-500/30 text-violet-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Status: {event.status}
                </span>
                <span className="px-3 py-1 bg-cyan-600/10 border border-cyan-500/30 text-cyan-400 text-[10px] font-bold rounded-full uppercase tracking-widest">
                  Official Event
                </span>
              </div>
              <h1 className="text-5xl md:text-9xl font-black text-white leading-[0.85] tracking-tighter italic">
                {event.title.split(' ').map((word, i) => (
                  <span key={i} className={i % 2 === 1 ? 'text-gradient block' : 'block'}>
                    {word}
                  </span>
                ))}
              </h1>
            </div>

            <GlassCard className="border-white/5 bg-white/[0.01] p-10">
              <p className="text-slate-300 text-2xl leading-relaxed font-medium mb-16 italic tracking-tight">{event.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-12 border-t border-white/5">
                <div className="flex items-center gap-8 group">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl group-hover:bg-violet-500/10 transition-colors">🗓️</div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">Event Date</p>
                    <p className="text-white font-bold text-xl">{new Date(event.date).toLocaleDateString(undefined, { dateStyle: 'full' })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-8 group">
                  <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center text-4xl group-hover:bg-pink-500/10 transition-colors">📍</div>
                  <div>
                    <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-2">Location</p>
                    <p className="text-white font-bold text-xl">{event.location}</p>
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="space-y-10">
            <GlassCard className="sticky top-28 border-white/10 shadow-[0_40px_80px_rgba(0,0,0,0.6)] bg-gradient-to-b from-white/5 to-transparent overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50" />

              <div className="mb-12 text-center">
                <p className="text-slate-500 text-[10px] mb-3 uppercase font-bold tracking-widest">Price per Ticket</p>
                <p className="text-6xl font-black text-white italic tracking-tighter">${event.price || 'Free'}</p>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-widest mb-6 ml-1">Select Quantity</label>
                  <div className="flex items-center justify-between p-3 bg-white/5 border border-white/10 rounded-2xl">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black text-2xl transition-all"
                    >-</button>
                    <span className="text-3xl font-black text-white italic">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(event.capacity, quantity + 1))}
                      className="w-14 h-14 rounded-xl bg-white/5 hover:bg-white/10 text-white font-black text-2xl transition-all"
                    >+</button>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/5">
                  <div className="flex justify-between items-end mb-10">
                    <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Total Price</span>
                    <span className="text-4xl font-black text-white italic tracking-tighter">${(event.price || 0) * quantity}</span>
                  </div>

                  <NeonButton
                    fullWidth
                    variant="primary"
                    size="lg"
                    onClick={handleBooking}
                    disabled={bookingLoading || event.status !== 'PUBLISHED'}
                    className="py-6 text-lg font-bold uppercase tracking-widest"
                  >
                    {bookingLoading ? 'Processing...' : event.status === 'PUBLISHED' ? 'Book Now' : 'Not Available'}
                  </NeonButton>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  )
}
