'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonButton } from '@/components/ui/NeonButton'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/context/AuthContext'

export default function NewEventPage() {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [location, setLocation] = useState('')
    const [capacity, setCapacity] = useState(10)
    const [price, setPrice] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const { user, isAuthenticated } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!isAuthenticated || user?.role !== 'ADMIN') {
            router.push('/events')
        }
    }, [isAuthenticated, user, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // Simple Validation
        if (new Date(date) < new Date()) {
            setError('The event date must be in the future.')
            return
        }

        if (capacity <= 0) {
            setError('Capacity must be greater than zero.')
            return
        }

        setLoading(true)
        setError(null)

        try {
            const token = localStorage.getItem('token')

            if (!token) {
                setError('Authentication required. Please log in again.')
                router.push('/auth/login')
                return
            }

            const payload = {
                title,
                description,
                date,
                location,
                capacity: Number(capacity),
                price: Number(price),
            }

            await apiClient.post('/events', payload, token)
            router.push('/admin')
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create event')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen py-12 px-6 relative overflow-hidden bg-slate-950">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-violet-600/5 rounded-full blur-[120px]" />
            </div>

            <div className="container mx-auto max-w-2xl relative z-10">
                <Link href="/admin" className="inline-flex items-center text-slate-500 hover:text-white mb-12 transition-all font-bold uppercase tracking-widest text-xs group">
                    <span className="mr-3 group-hover:-translate-x-2 transition-transform">←</span> Back to Dashboard
                </Link>

                <GlassCard className="border-white/10 shadow-2xl p-10">
                    <div className="mb-12">
                        <h1 className="text-4xl font-black text-white italic tracking-tighter mb-3">Create <span className="text-gradient">Event</span></h1>
                        <p className="text-slate-400 font-medium">Enter the details for your new event.</p>
                    </div>

                    {error && (
                        <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center italic">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Event Title</label>
                            <input
                                type="text"
                                required
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                                placeholder="The Grand Convergence"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Description</label>
                            <textarea
                                required
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={4}
                                className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium resize-none"
                                placeholder="Describe the journey..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Event Date</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Location</label>
                                <input
                                    type="text"
                                    required
                                    value={location}
                                    onChange={(e) => setLocation(e.target.value)}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                                    placeholder="The Citadel"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Capacity</label>
                                <input
                                    type="number"
                                    required
                                    min="1"
                                    value={capacity}
                                    onChange={(e) => setCapacity(Number(e.target.value))}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Price ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(Number(e.target.value))}
                                    className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <NeonButton
                            type="submit"
                            variant="primary"
                            fullWidth
                            size="lg"
                            disabled={loading}
                            className="mt-6 py-6 font-bold uppercase tracking-widest"
                        >
                            {loading ? 'Creating...' : 'Create Event'}
                        </NeonButton>
                    </form>
                </GlassCard>
            </div>
        </div>
    )
}
