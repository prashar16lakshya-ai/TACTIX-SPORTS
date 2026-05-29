import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import DashboardSidebar from './DashboardSidebar'
import DashboardHeader from './DashboardHeader'
import BottomNav from '../BottomNav'

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  return (
    <div className="flex flex-col h-dvh bg-background font-lexend overflow-hidden">
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
      <main className="flex-1 overflow-y-auto bg-background pb-20 md:pb-8">
        <div className="max-w-5xl mx-auto px-4 py-5">
          {children}


        </div>
      </main>

      {/* Bottom Navigation — mobile only */}
      <BottomNav />
    </div>
  )
}
