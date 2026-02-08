'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { GlassCard } from '@/components/ui/GlassCard'
import { NeonButton } from '@/components/ui/NeonButton'
import { apiClient } from '@/lib/api'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const data = await apiClient.post('/auth/login', { email, password })
      login(data.access_token, data.user)
      router.push('/events')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center p-6 overflow-hidden">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />

      <GlassCard className="max-w-md w-full relative z-10 border-white/10 shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-3 tracking-tighter italic">Welcome <span className="text-gradient">Back</span></h1>
          <p className="text-slate-400 font-medium">Step into the future of events.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-bold text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
              placeholder="name@company.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-slate-500 ml-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all font-medium"
              placeholder="••••••••"
            />
          </div>

          <NeonButton
            type="submit"
            variant="primary"
            fullWidth
            size="lg"
            disabled={loading}
            className="mt-4"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </NeonButton>
        </form>

        <div className="mt-8 pt-8 border-t border-white/5 text-center">
          <p className="text-slate-400 text-sm font-medium">
            New to Eventia?{' '}
            <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-bold transition-colors">
              Create an account
            </Link>
          </p>
        </div>
      </GlassCard>
    </div>
  )
}
