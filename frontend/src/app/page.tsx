import Link from 'next/link';
import { GlassCard } from '../components/ui/GlassCard';
import { NeonButton } from '../components/ui/NeonButton';

export default function HomePage() {
  return (
    <div className="relative">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] bg-pink-600/10 rounded-full blur-[120px]" />
      </div>

      <main className="container mx-auto px-6 relative z-10">
        {/* Hero Section */}
        <section className="flex flex-col items-center justify-center min-h-[80vh] text-center pt-20">
          <div className="inline-block px-4 py-1.5 mb-8 rounded-full border border-white/10 bg-white/5 backdrop-blur-md">
            <span className="text-xs font-bold tracking-[0.2em] text-violet-400 uppercase">
              The Next Generation of Events
            </span>
          </div>

          <h1 className="text-6xl md:text-9xl font-black mb-8 tracking-tighter leading-[0.9]">
            <span className="text-white block mb-2">Experience</span>
            <span className="text-gradient block mb-2">Unforgettable</span>
            <span className="text-white block">Moments</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed font-medium">
            From world-class conferences to intimate workshops. Discover a premium digital ecosystem designed for the modern attendee.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center w-full sm:w-auto">
            <Link href="/events" className="w-full sm:w-auto">
              <NeonButton variant="primary" size="lg" className="w-full sm:w-[240px]">
                Explore Events
              </NeonButton>
            </Link>
            <Link href="/auth/register" className="w-full sm:w-auto">
              <NeonButton variant="ghost" size="lg" className="w-full sm:w-[240px]">
                Get Started
              </NeonButton>
            </Link>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <GlassCard className="animate-float" style={{ animationDelay: '0s' } as any}>
            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-3xl">
              ✨
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 italic tracking-tight">Curated Selection</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              We hand-pick every event to ensure the highest quality experience for our community.
            </p>
          </GlassCard>

          <GlassCard className="animate-float" style={{ animationDelay: '1s' } as any}>
            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-3xl">
              ⚡
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 italic tracking-tight">Fluid Experience</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Zero friction from discovery to check-in. Our platform is built for speed and elegance.
            </p>
          </GlassCard>

          <GlassCard className="animate-float" style={{ animationDelay: '2s' } as any}>
            <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 text-3xl">
              🔐
            </div>
            <h3 className="text-2xl font-bold text-white mb-4 italic tracking-tight">Total Security</h3>
            <p className="text-slate-400 leading-relaxed font-medium">
              Your data and bookings are protected by industry-leading encryption and standards.
            </p>
          </GlassCard>
        </section>

        {/* CTA Section */}
        <section className="py-40">
          <GlassCard className="bg-gradient-to-br from-violet-600/20 to-pink-600/20 border-white/10 text-center py-20 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">Ready to join the future?</h2>
            <p className="text-slate-300 mb-12 max-w-xl mx-auto text-lg font-medium">
              Join thousands of others discovering incredible events around the world.
            </p>
            <Link href="/auth/register">
              <NeonButton size="lg" variant="primary" className="mx-auto w-full sm:w-[280px]">
                Create Your Account
              </NeonButton>
            </Link>
          </GlassCard>
        </section>
      </main>

      <footer className="py-20 border-t border-white/5 mt-20">
        <div className="container mx-auto px-6 text-center">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-[0.3em]">
            &copy; 2024 Eventia. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
