import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

export default function TopBar({ title = 'TACTIX  ', trailingIcon = 'notifications', trailingPath, showBack = false, backPath }) {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [notifPulse, setNotifPulse] = useState(true)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleTrailing = () => {
    if (trailingPath) {
      setNotifPulse(false)
      navigate(trailingPath)
    }
  }

  const handleBack = () => {
    if (backPath) navigate(backPath)
    else navigate(-1)
  }

  const getInitialsColor = (role) => {
    if (role === 'admin') return 'bg-[#DC143C]/20 text-[#FF1493]'
    if (role === 'coach') return 'bg-[#DC143C]/15 text-[#DC143C]'
    return 'bg-surface-container-highest text-on-surface'
  }

  const basePath = user?.role === 'admin' ? '/admin' : user?.role === 'coach' ? '/coach' : '/student'

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) {
      await logout()
      navigate('/login')
    }
  }

  return (
    <header className="bg-surface/90 backdrop-blur-xl text-on-surface font-['Inter'] font-bold tracking-tight top-0 z-[100] sticky border-b border-outline-variant/15 shadow-[0_1px_20px_rgba(0,0,0,0.15)] flex justify-between items-center h-16 px-5 w-full animate-slide-down">

      {/* Red accent line at very top */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#DC143C] to-transparent opacity-60" />

      {/* Leading: Back Button & School Info */}
      <div className="flex items-center gap-3">
        {showBack && (
          <button
            onClick={handleBack}
            className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-[#DC143C]/10 transition-all active:scale-90 text-on-surface hover:text-[#DC143C]"
            aria-label="Go back"
          >
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
        )}
        <div className="flex flex-col cursor-pointer group" onClick={() => navigate('/')}>
          <span className="text-sm font-black tracking-wider text-on-surface uppercase leading-none group-hover:text-[#DC143C] transition-colors duration-200">
            {user?.schoolName || 'YOUR SCHOOL'}
          </span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-medium text-on-surface/40 uppercase tracking-tighter leading-none">
              {user?.sport || 'Sports'}
            </span>
            <span className="material-symbols-outlined text-[10px] text-on-surface/20">chevron_right</span>
            <span className="text-[10px] font-bold text-[#FF1493] uppercase tracking-tighter leading-none">
              {user?.teamName || 'Roster'}
            </span>
          </div>
        </div>
      </div>

      {/* Trailing: Notifications & Profile Avatar */}
      <div className="flex items-center gap-3 relative" ref={dropdownRef}>

        {/* Notification bell */}
        <button
          onClick={handleTrailing}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/8 hover:bg-[#DC143C]/10 hover:border-[#DC143C]/30 transition-all active:scale-90 text-on-surface relative group"
          aria-label={trailingIcon}
        >
          <span className="material-symbols-outlined text-[20px] group-hover:text-[#DC143C] transition-colors">{trailingIcon}</span>
          {trailingIcon === 'notifications' && notifPulse && (
            <>
              {/* Pulsing outer ring */}
              <span className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-[#FF1493]/30 animate-ping" />
              {/* Solid dot */}
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#FF1493] rounded-full border border-[#0A0A0A] animate-pop" />
            </>
          )}
        </button>

        {/* Avatar */}
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className={`w-10 h-10 rounded-full overflow-hidden flex items-center justify-center shrink-0 cursor-pointer transition-all duration-200 relative ${dropdownOpen ? 'border-2 border-[#FF1493] shadow-[0_0_12px_rgba(255,20,147,0.4)]' : 'border-2 border-white/15 hover:border-[#FF1493]/60'}`}
        >
          {/* Rotating glow border when dropdown open */}
          {dropdownOpen && (
            <span className="absolute inset-[-3px] rounded-full border-2 border-[#DC143C]/40 animate-rotate-border" />
          )}
          {user?.photoURL ? (
            <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
          ) : (
            <div className={`w-full h-full flex items-center justify-center ${getInitialsColor(user?.role)}`}>
              <span className="text-xs font-black">{user?.initials || user?.name?.charAt(0) || 'U'}</span>
            </div>
          )}
        </button>

        {/* Dropdown */}
        {dropdownOpen && (
          <div className="absolute top-12 right-0 mt-2 w-52 bg-surface-container/95 backdrop-blur-xl border border-outline-variant/20 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.3)] py-2 flex flex-col z-[101] animate-fade-in-scale">
            {/* Top accent */}
            <div className="absolute top-0 left-4 right-4 h-px bg-gradient-to-r from-transparent via-[#DC143C]/40 to-transparent" />

            <div className="px-4 py-3 border-b border-white/5 mb-1">
              <p className="text-sm font-bold text-on-surface truncate">{user?.name || 'User'}</p>
              <p className="text-[10px] text-[#FF1493]/70 truncate uppercase tracking-widest mt-0.5">{user?.role || 'Guest'}</p>
            </div>

            {[
              { label: 'Profile', icon: 'person', action: () => { setDropdownOpen(false); navigate(`${basePath}/profile/edit`) } },
              { label: 'Settings', icon: 'settings', action: () => { setDropdownOpen(false); navigate(`${basePath}/settings`) } },
            ].map((item, i) => (
              <button
                key={item.label}
                onClick={item.action}
                style={{ animationDelay: `${i * 0.05}s` }}
                className="w-full text-left px-4 py-2.5 text-sm text-on-surface/70 hover:bg-white/5 hover:text-on-surface transition-all flex items-center gap-3 group animate-fade-in"
              >
                <span className="material-symbols-outlined text-[18px] text-on-surface/40 group-hover:text-[#DC143C] transition-colors">{item.icon}</span>
                {item.label}
              </button>
            ))}

            <div className="h-px bg-white/5 mx-3 my-1" />

            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all flex items-center gap-3"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              Log Out
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
