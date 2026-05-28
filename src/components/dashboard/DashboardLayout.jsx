import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'
import BottomNav from '../BottomNav'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="flex flex-col h-dvh bg-[#0A0A0A] font-lexend overflow-hidden">
      {/* Top App Bar */}
      <DashboardHeader onMenuClick={() => setIsDrawerOpen(true)} />

      {/* Drawer Overlay */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setIsDrawerOpen(false)}
          />
          {/* Drawer Panel */}
          <div className="relative h-full animate-[slideInLeft_0.22s_ease-out]">
            <DashboardSidebar onClose={() => setIsDrawerOpen(false)} />
          </div>
        </div>
      )}

      {/* Scrollable content area */}
      <main className="flex-1 overflow-y-auto bg-[#0A0A0A] pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-5">
          {children}

          {/* 🚀 Conversion CTA for Demo Mode */}
          {user?.isDemo && (
            <section className="mt-12 mb-8 pt-10 border-t border-white/5 text-center">
              <h3 className="text-on-surface font-black text-lg uppercase tracking-tight mb-2">Ready for the real deal?</h3>
              <p className="text-on-surface/40 text-[11px] uppercase tracking-[0.2em] mb-8 max-w-xs mx-auto">
                Explore more features by logging into your account or joining TACTIX today.
              </p>

              <div className="flex flex-col gap-4 max-w-[280px] mx-auto">
                <button
                  onClick={() => logout()}
                  className="w-full h-14 bg-[#DC143C] text-on-primary font-black uppercase tracking-[0.2em] rounded-2xl shadow-[0_8px_20px_rgba(124,58,237,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => { logout(); /* Navigate to signup handled by redirect */ }}
                  className="w-full h-14 bg-on-surface/5 border-2 border-outline-variant/30 text-on-surface font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-on-surface/10 transition-all"
                >
                  Sign Up
                </button>
                <p className="text-[10px] text-on-surface/20 mt-2 uppercase tracking-widest">

                </p>
              </div>
            </section>
          )}
        </div>
      </main>

      {/* Bottom Navigation — mobile only */}
      <BottomNav />
    </div>
  )
}
