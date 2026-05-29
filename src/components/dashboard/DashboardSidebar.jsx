import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

// Primary drawer navigation — accessible on all screen sizes via hamburger
const DRAWER_GROUPS = [
  {
    title: 'Manage',
    items: [
      { label: 'Attendance',               icon: 'how_to_reg',          path: '/attendance-snapshot', roles: ['admin', 'coach'] },
      { label: 'All Players',              icon: 'people',              path: '/admin/players',       roles: ['admin'] },
      { label: 'Coaches',                  icon: 'sports',              path: '/admin/coaches',       roles: ['admin'] },
      { label: 'Sports',                   icon: 'category',            path: '/admin/sports',        roles: ['admin'] },
      { label: 'Role Management',          icon: 'manage_accounts',     path: '/admin/roles',         roles: ['admin'] },
      { label: 'Bulk Import',              icon: 'upload_file',         path: '/bulk-import',         roles: ['admin', 'coach'] },
      { label: 'Assign Training',          icon: 'fitness_center',      path: '/coach/training',      roles: ['coach'] },
      { label: 'Report Injury',            icon: 'local_hospital',      path: '/coach/report-injury', roles: ['coach'] },
      { label: 'Compare Players',          icon: 'compare_arrows',      path: '/coach/compare',       roles: ['coach'] },
    ],
  },
  {
    title: 'Performance',
    items: [
      { label: 'Leaderboard',              icon: 'leaderboard',         path: '/leaderboard',         roles: ['admin', 'coach', 'player', 'student'] },
      { label: 'Needs Attention',          icon: 'priority_high',       path: '/needs-attention',     roles: ['admin', 'coach'] },
      { label: 'Team Alerts',             icon: 'notifications_active', path: '/team-alerts',         roles: ['admin', 'coach'] },
    ],
  },
  {
    title: 'Communication',
    items: [
      { label: 'Announcements',            icon: 'campaign',            path: '/announcements',       roles: ['admin', 'coach', 'player', 'student'] },
      { label: 'Campaigns',               icon: 'podcasts',            path: '/campaigns',           roles: ['admin', 'coach'] },
    ],
  },
  {
    title: 'Admin',
    items: [
      { label: 'Holidays',                icon: 'event_busy',          path: '/holidays',            roles: ['admin'] },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Settings',                icon: 'settings',            path: '/settings',            roles: ['admin', 'coach', 'player', 'student'] },
      { label: 'Help & Support',          icon: 'help_outline',        path: '/help',                roles: ['admin', 'coach', 'player', 'student'] },
      { label: 'Feedback',               icon: 'rate_review',          path: '/feedback',            roles: ['admin', 'coach', 'player', 'student'] },
    ],
  },
]

export default function DashboardSidebar({ onClose }) {
  const { pathname } = useLocation()
  const { logout, user } = useAuth()
  const navigate = useNavigate()

  const role = user?.role?.toLowerCase()
  const normalizedRole = role === 'player' ? 'student' : role

  const filteredGroups = DRAWER_GROUPS.map(g => ({
    ...g,
    items: g.items.filter(item => !item.roles || item.roles.includes(normalizedRole) || item.roles.includes(role)),
  })).filter(g => g.items.length > 0)

  const handleNav = (path) => {
    navigate(path)
    onClose?.()
  }

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to log out?")) {
      logout()
      onClose?.()
    }
  }

  return (
    <aside className="w-[280px] h-full bg-surface/98 backdrop-blur-2xl border-r border-outline-variant/15 flex flex-col overflow-hidden animate-slide-in-left">
      {/* Red accent line at top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#DC143C] via-[#FF1493] to-[#DC143C] opacity-70" />

      {/* Drawer Header */}
      <div className="h-14 flex items-center justify-between px-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="TACTIX" className="w-7 h-7 object-contain opacity-80" />
          <span className="text-on-surface font-black text-base tracking-tight">TACTIX</span>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-on-surface/40 hover:text-[#DC143C] hover:bg-[#DC143C]/10 transition-all active:scale-90"
          aria-label="Close menu"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* User Info Strip */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 shrink-0">
        <div className="relative">
          <div className="w-9 h-9 rounded-full bg-[#DC143C]/20 border border-[#DC143C]/30 flex items-center justify-center text-[#FF1493] font-black text-sm overflow-hidden shrink-0">
            {user?.photoURL
              ? <img src={user.photoURL} alt="Avatar" className="w-full h-full object-cover" />
              : (user?.initials || user?.name?.slice(0, 2)?.toUpperCase() || 'U')
            }
          </div>
          {/* Online dot */}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-surface animate-pop" />
        </div>
        <div className="min-w-0">
          <p className="text-on-surface font-semibold text-sm truncate">{user?.name || 'User'}</p>
          <p className="text-[#FF1493]/60 text-[11px] capitalize">{user?.role || 'Member'}{user?.isDemo ? ' · Demo' : ''}</p>
        </div>
      </div>

      {/* Nav Groups */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 flex flex-col gap-4">
        {filteredGroups.map((group, gi) => (
          <div key={group.title} className="animate-fade-in" style={{ animationDelay: `${gi * 0.06}s` }}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-on-surface/25 px-3 mb-1.5">
              {group.title}
            </p>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item, ii) => {
                const active = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/')
                return (
                  <button
                    key={item.label}
                    onClick={() => handleNav(item.path)}
                    style={{ animationDelay: `${(gi * 0.06) + (ii * 0.03)}s` }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left text-sm animate-fade-in group
                      ${active
                        ? 'bg-gradient-to-r from-[#DC143C]/15 to-[#FF1493]/5 text-[#FF1493] font-semibold border border-[#DC143C]/20 shadow-[0_0_12px_rgba(220,20,60,0.1)]'
                        : 'text-on-surface/55 hover:text-on-surface hover:bg-white/5'
                      }`}
                  >
                    {/* Active left indicator */}
                    {active && (
                      <span className="absolute left-2 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-[#DC143C] rounded-full animate-tab-indicator" />
                    )}
                    <span
                      className={`material-symbols-outlined text-[20px] shrink-0 transition-all duration-200 ${active ? 'text-[#DC143C] scale-110' : 'group-hover:text-[#DC143C] group-hover:scale-105'}`}
                      style={{ fontVariationSettings: active ? "'FILL' 1" : "'FILL' 0" }}
                    >
                      {item.icon}
                    </span>
                    <span className="truncate">{item.label}</span>
                    {active && (
                      <span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#FF1493] animate-pop" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Logout Footer */}
      <div className="px-2 py-3 border-t border-white/5 shrink-0">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400/70 hover:text-red-400 hover:bg-red-500/8 transition-all text-sm group"
        >
          <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">logout</span>
          <span className="font-medium">Log Out</span>
        </button>
      </div>
    </aside>
  )
}
