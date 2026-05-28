import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { useAuth } from '../../context/AuthContext'


export default function StudentProfile() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const INFO = []
  const PERFORMANCE = []

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar trailingIcon="settings" trailingPath="/student/settings" />
      <main className="flex-1 w-full max-w-2xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6">
        {/* Profile Hero */}
        <div className="bg-surface-container rounded-xl p-6 border border-surface-variant relative overflow-hidden flex flex-col items-center gap-4">
          <div className="absolute -top-16 -right-16 w-48 h-48 bg-primary-container rounded-full blur-[60px] opacity-10 pointer-events-none" />
          <div className="w-24 h-24 rounded-full bg-primary-container/20 border-4 border-surface flex items-center justify-center z-10">
            <span className="text-3xl font-inter font-black text-primary">{user?.initials || '--'}</span>
          </div>
          <div className="text-center z-10">
            <div className="inline-flex items-center px-3 py-1 rounded-full bg-secondary-fixed/10 border border-secondary-fixed/20 mb-2">
              <span className="text-label-sm font-lexend text-secondary-fixed uppercase tracking-wider">Group A Elite</span>
            </div>
            <h1 className="text-headline-lg font-inter font-bold text-on-surface">{user?.name || 'Unknown User'}</h1>
            <p className="text-body-md font-lexend text-on-surface-variant">{user?.email}</p>
          </div>
          <button onClick={() => navigate('/student/profile/edit')}
            className="w-full h-12 bg-surface-container-high border border-outline-variant rounded-xl font-lexend text-label-lg text-on-surface hover:bg-surface-bright transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">edit</span>Edit Profile
          </button>
        </div>

        {/* Info */}
        <div className="bg-surface-container border border-outline-variant rounded-xl overflow-hidden">
          {INFO.length > 0 ? INFO.map((item, i) => (
            <div key={item.label} className={`flex items-center justify-between px-5 py-4 ${i < INFO.length - 1 ? 'border-b border-outline-variant' : ''}`}>
              <span className="text-label-lg font-lexend text-on-surface-variant">{item.label}</span>
              <span className="text-label-lg font-lexend text-on-surface">{item.value}</span>
            </div>
          )) : (
            <div className="px-5 py-8 text-center">
              <span className="material-symbols-outlined text-outline text-4xl">person_off</span>
              <p className="mt-3 text-body-md font-lexend text-on-surface-variant">Profile details are not available yet.</p>
            </div>
          )}
        </div>

        {/* Performance Summary */}
        <div className="grid grid-cols-3 gap-3">
          {PERFORMANCE.length > 0 ? PERFORMANCE.map(s => (
            <div key={s.label} className="bg-surface-container-low border border-outline-variant rounded-xl p-3 text-center">
              <p className={`text-headline-md font-inter font-bold ${s.color}`}>{s.value}</p>
              <p className="text-label-sm font-lexend text-on-surface-variant mt-1">{s.label}</p>
            </div>
          )) : (
            <div className="col-span-3 bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-6 text-center">
              <p className="text-body-md font-lexend text-on-surface-variant">No performance summary available yet.</p>
            </div>
          )}
        </div>

        {/* My Fitness Stats (Removed) */}

        <button
          onClick={async () => {
            if (window.confirm("Are you sure you want to log out?")) {
              await logout()
              navigate('/login', { replace: true })
            }
          }}
          className="w-full h-12 rounded-xl border-2 border-outline-variant text-on-surface-variant font-lexend text-label-lg hover:bg-surface-container-high hover:text-error transition-colors flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[18px]">logout</span>Sign Out
        </button>
      </main>
      <BottomNav />
    </div>
  )
}
