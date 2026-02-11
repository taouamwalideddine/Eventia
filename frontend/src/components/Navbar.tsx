'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { NeonButton } from './ui/NeonButton'

export const Navbar = () => {
    const { isAuthenticated, logout, user } = useAuth();

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 py-3 rounded-2xl border-white/5">
                <Link href="/" className="text-2xl font-black tracking-tighter">
                    <span className="text-white">Event</span>
                    <span className="text-gradient">ia</span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <Link href="/events" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                        Browse Events
                    </Link>
                    {isAuthenticated && (
                        <>
                            <Link href="/reservations" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                My Bookings
                            </Link>
                            {user?.role === 'ADMIN' && (
                                <Link href="/admin" className="text-sm font-bold text-pink-400 hover:text-pink-300 transition-colors">
                                    Admin Dashboard
                                </Link>
                            )}
                        </>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <>
                            <span className="text-sm text-slate-400 mr-2 hidden sm:inline">
                                {user?.name}
                            </span>
                            <NeonButton variant="ghost" size="sm" onClick={logout}>
                                Sign Out
                            </NeonButton>
                        </>
                    ) : (
                        <>
                            <Link href="/auth/login">
                                <NeonButton variant="ghost" size="sm">
                                    Sign In
                                </NeonButton>
                            </Link>
                            <Link href="/auth/register">
                                <NeonButton variant="secondary" size="sm">
                                    Get Started
                                </NeonButton>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
};
