import { useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import NotificationDropdown from './NotificationDropdown'
import { useState, useRef, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'

// Map route segments → human-readable page titles
const PAGE_TITLES = {
  '/admin/dashboard': 'Dashboard',
  '/admin': 'Dashboard',
  '/admin/teams': 'Teams',
  '/admin/coaches': 'Coaches',
  '/admin/sports': 'Sports',
  '/admin/players': 'All Players',
  '/admin/reports': 'Reports',
  '/admin/roles': 'Role Management',
  '/coach': 'Dashboard',
  '/coach/teams': 'My Teams',
  '/coach/groups': 'Groups',
  '/coach/schedule': 'Schedule',
  '/coach/attendance': 'Attendance',
  '/coach/training': 'Assign Training',
  '/coach/compare': 'Player Comparison',
  '/student': 'Dashboard',
  '/student/profile': 'My Profile',
  '/calendar': 'Sports Calendar',
  '/leaderboard': 'Leaderboard',
  '/announcements': 'Announcements',
  '/campaigns': 'Campaigns',
  '/reports': 'Reports',
  '/profile': 'My Profile',
  '/settings': 'Settings',
  '/help': 'Help & Support',
  '/feedback': 'Feedback',
  '/holidays': 'Holidays',
  '/bulk-import': 'Bulk Import',
  '/attendance-snapshot': 'Attendance',
  '/needs-attention': 'Needs Attention',
  '/team-alerts': 'Team Alerts',
}

function getPageTitle(pathname) {
  // Try exact match first
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname]
  // Try prefix match (longest match wins)
  const sorted = Object.keys(PAGE_TITLES).sort((a, b) => b.length - a.length)
  for (const key of sorted) {
    if (pathname.startsWith(key)) return PAGE_TITLES[key]
  }
  return 'TACTIX'
}

export default function DashboardHeader({ onMenuClick }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const pageTitle = getPageTitle(location.pathname)
  const initials = user?.initials || user?.name?.slice(0, 2)?.toUpperCase() || 'U'

  return (
    <header className="h-14 bg-surface/95 backdrop-blur-xl border-b border-outline-variant/15 flex items-center px-4 gap-3 sticky top-0 z-40 shrink-0">
      {/* Hamburger */}
      <button
        id="menu-hamburger"
        onClick={onMenuClick}
        className="w-9 h-9 flex items-center justify-center rounded-lg text-on-surface/70 hover:text-primary hover:bg-on-surface/5 transition-colors"
        aria-label="Open menu"
      >
        <span className="material-symbols-outlined text-[22px]">menu</span>
      </button>

      {/* Page title — centered */}
      <h1 className="flex-1 text-on-surface font-bold text-[15px] tracking-wide truncate text-center">
        {pageTitle}
      </h1>

      {/* Right: notifications + avatar */}
      <div className="flex items-center gap-3">
        <NotificationDropdown />

        <div className="relative" ref={dropdownRef}>
            <button
              id="header-avatar"
              onClick={() => setIsProfileOpen(prev => !prev)}
              className="w-8 h-8 rounded-full bg-[#DC143C]/30 border border-[#DC143C]/40 flex items-center justify-center text-[#FF1493] font-black text-xs overflow-hidden"
              aria-label="Profile menu"
            >
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              ) : initials}
            </button>

            {isProfileOpen && (
              <div className="absolute top-10 right-0 w-52 bg-surface-container/95 backdrop-blur-xl border border-outline-variant/20 rounded-xl shadow-xl py-2 z-50">
                <div className="px-4 pb-2 border-b border-white/5 mb-1">
                  <p className="text-on-surface font-bold text-sm truncate">{user?.name || 'User'}</p>
                  <p className="text-on-surface/40 text-[11px] capitalize">{user?.role || 'Member'}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-on-surface/70 hover:text-primary hover:bg-on-surface/5 transition-colors text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">person</span>
                  My Profile
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setIsProfileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-on-surface/70 hover:text-primary hover:bg-on-surface/5 transition-colors text-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">settings</span>
                  Settings
                </Link>
                <div className="border-t border-white/5 mt-1 pt-1">
                  <button
                    onClick={() => { 
                      if(window.confirm("Are you sure you want to log out?")) {
                        logout(); setIsProfileOpen(false);
                      }
                    }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
                  >
                    <span className="material-symbols-outlined text-[18px]">logout</span>
                    Sign Out
                  </button>
                </div>
              </div>
            )}
        </div>
      </div>
    </header>
  )
}
