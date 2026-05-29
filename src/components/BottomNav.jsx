import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const ADMIN_TABS = [
  { label: 'Dashboard', icon: 'grid_view',     path: '/admin/dashboard' },
  { label: 'Team',      icon: 'group',          path: '/admin/teams' },
  { label: 'Calendar',  icon: 'calendar_today', path: '/calendar' },
  { label: 'Reports',   icon: 'analytics',      path: '/reports' },
  { label: 'Profile',   icon: 'person',         path: '/profile' },
]

const COACH_TABS = [
  { label: 'Dashboard', icon: 'grid_view',     path: '/coach' },
  { label: 'Team',      icon: 'group',          path: '/coach/teams' },
  { label: 'Calendar',  icon: 'calendar_today', path: '/calendar' },
  { label: 'Reports',   icon: 'analytics',      path: '/reports' },
  { label: 'Profile',   icon: 'person',         path: '/profile' },
]

const STUDENT_TABS = [
  { label: 'Dashboard',  icon: 'grid_view',     path: '/student' },
  { label: 'Updates',    icon: 'campaign',       path: '/announcements' },
  { label: 'Calendar',   icon: 'calendar_today', path: '/calendar' },
  { label: 'Board',      icon: 'leaderboard',    path: '/leaderboard' },
  { label: 'Profile',    icon: 'person',         path: '/student/profile' },
]

export default function BottomNav() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const tabs = user?.role === 'admin' ? ADMIN_TABS
    : user?.role === 'coach' ? COACH_TABS
    : STUDENT_TABS

  const isActive = (path) => {
    if (path === '/admin/dashboard') return location.pathname === path || location.pathname === '/admin'
    if (path === '/coach')           return location.pathname === '/coach'
    if (path === '/student')         return location.pathname === '/student'
    return location.pathname.startsWith(path)
  }

  return (
    <nav
      id="bottom-nav"
      className="md:hidden fixed bottom-0 left-0 w-full bg-surface/95 backdrop-blur-xl border-t border-outline-variant/20 flex justify-around items-stretch h-16 z-50 animate-slide-up"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      {tabs.map((tab, idx) => {
        const active = isActive(tab.path)
        return (
          <button
            key={tab.path}
            id={`nav-${tab.label.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => navigate(tab.path)}
            style={{ animationDelay: `${idx * 0.05}s` }}
            className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-2 transition-all duration-200 relative
              ${active ? 'text-[#FF1493]' : 'text-on-surface/40 hover:text-on-surface/70'}`}
          >
            {/* Active indicator bar at top */}
            {active && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#DC143C] to-[#FF1493] rounded-full animate-tab-indicator" />
            )}

            {/* Active glow orb behind icon */}
            {active && (
              <span className="absolute top-2 w-10 h-10 rounded-full bg-[#DC143C]/10 blur-sm animate-fade-in" />
            )}

            <span
              className={`material-symbols-outlined text-[22px] leading-none transition-transform duration-200 ${active ? 'scale-110' : 'scale-100'}`}
              style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
            >
              {tab.icon}
            </span>
            <span className={`text-[10px] font-semibold tracking-wide transition-all duration-200 ${active ? 'text-[#FF1493] font-bold' : 'text-on-surface/40'}`}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
