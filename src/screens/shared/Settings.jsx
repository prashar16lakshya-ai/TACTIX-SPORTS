import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useTheme } from '../../context/ThemeContext'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'

export default function Settings() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { data } = useAppData()
  const { isDark, toggleTheme } = useTheme()
  const [toast, setToast] = useState(null)

  const basePath = user?.role === 'admin' ? '/admin' : user?.role === 'coach' ? '/coach' : '/student'

  const SECTIONS = [
    {
      title: 'Account',
      items: [
        { label: 'Edit Profile', icon: 'edit', action: () => navigate(`${basePath}/profile/edit`) },
        { label: 'Change Password', icon: 'lock', action: () => setToast({ message: 'Password reset email sent!', type: 'success' }) },
      ],
    },
    {
      title: 'Preferences',
      items: [
        { label: 'Notifications', icon: 'notifications', action: () => navigate(`${basePath}/notifications`) },
        { label: 'Help & Feedback', icon: 'chat_bubble', action: () => navigate(`${basePath}/feedback`) },
        { label: 'Privacy Policy', icon: 'policy', action: () => navigate('/privacy') },
        { label: 'Legal & Copyright', icon: 'gavel', action: () => navigate('/legal') },
      ],
    },
  ]

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar showBack title="Settings" trailingIcon="tune" />

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

      <main className="flex-1 pt-20 pb-10 px-6 flex flex-col gap-6 max-w-2xl mx-auto w-full">
        {/* User card */}
        <div className="bg-surface-container border border-outline-variant rounded-xl p-5 flex items-center gap-4 mt-4">
          {data.profile?.photo ? (
            <img src={data.profile.photo} alt="Profile" className="w-14 h-14 rounded-full border-2 border-primary-container object-cover" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-primary-container/20 border-2 border-primary-container flex items-center justify-center font-inter font-bold text-xl text-primary">
              {user?.initials}
            </div>
          )}
          <div>
            <p className="text-label-lg font-lexend text-on-surface">{data.profile?.name || user?.name}</p>
            <p className="text-label-sm font-lexend text-on-surface-variant">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 rounded bg-primary-container/20 text-primary text-[10px] font-lexend font-bold uppercase tracking-wider capitalize">{user?.role}</span>
          </div>
        </div>

        {SECTIONS.map(section => (
          <div key={section.title}>
            <p className="text-label-sm font-lexend text-on-surface-variant uppercase tracking-widest mb-2 px-1">{section.title}</p>
            <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
              {section.items.map((item, i) => (
                <button key={item.label} onClick={item.action}
                  className={`w-full flex items-center gap-4 px-5 py-4 hover:bg-surface-container-high transition-colors text-left ${i < section.items.length - 1 ? 'border-b border-outline-variant' : ''}`}>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">{item.icon}</span>
                  <span className="text-label-lg font-lexend text-on-surface flex-1">{item.label}</span>
                  <span className="material-symbols-outlined text-on-surface-variant text-[20px]">chevron_right</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        <div>
          <p className="text-label-sm font-lexend text-on-surface-variant uppercase tracking-widest mb-2 px-1">Appearance</p>
          <button
            onClick={toggleTheme}
            className="w-full bg-surface-container border border-outline-variant rounded-xl px-5 py-4 hover:bg-surface-container-high transition-colors flex items-center justify-between"
          >
            <span className="text-label-lg font-lexend text-on-surface flex items-center gap-3">
              <span className="material-symbols-outlined text-[20px]">{isDark ? 'dark_mode' : 'light_mode'}</span>
              {isDark ? 'Dark Mode' : 'Light Mode'}
            </span>
            <span className="text-label-sm text-primary font-bold">{isDark ? 'Switch to Light' : 'Switch to Dark'}</span>
          </button>
        </div>

        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to log out?")) {
              await logout()
              navigate('/login', { replace: true })
            }
          }}
          className="w-full h-12 rounded-xl bg-error-container/20 border border-error/30 text-error font-lexend text-label-lg hover:bg-error-container/30 transition-colors flex items-center justify-center gap-2 mt-2">
          <span className="material-symbols-outlined text-[18px]">logout</span>Sign Out
        </button>


        <p className="text-center text-label-sm font-lexend text-on-surface-variant/50"><img src="/name.png" alt="TACTIX" className="inline-block h-[1.2em] object-contain align-text-bottom opacity-50" /> v1.0.0 · Performance Engine</p>
      </main>
    </div>
  )
}
