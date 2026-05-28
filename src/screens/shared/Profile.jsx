import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useTheme } from '../../context/ThemeContext'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

function EditableField({ icon, label, value, field, onSave }) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(value)

  const handleSave = () => {
    onSave(field, draft)
    setEditing(false)
  }

  const handleCancel = () => {
    setDraft(value)
    setEditing(false)
  }

  return (
    <div className="flex items-start gap-4 py-1 group">
      <div className="w-10 h-10 rounded-lg bg-on-surface/5 flex items-center justify-center text-on-surface/40 flex-shrink-0 mt-0.5">
        <span className="material-symbols-outlined text-[20px]">{icon}</span>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-on-surface/40 text-[10px] uppercase tracking-widest mb-1">{label}</p>
        {editing ? (
          <div className="flex items-center gap-2">
            <input
              autoFocus
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel() }}
              className="flex-1 bg-on-surface/5 border border-[#FF1493]/50 rounded-lg px-3 py-1.5 text-on-surface text-sm focus:outline-none focus:border-[#FF1493] transition-colors"
            />
            <button onClick={handleSave} className="w-8 h-8 bg-[#FF1493]/20 hover:bg-[#FF1493]/40 rounded-lg flex items-center justify-center text-[#FF1493] transition-colors">
              <span className="material-symbols-outlined text-[16px]">check</span>
            </button>
            <button onClick={handleCancel} className="w-8 h-8 bg-on-surface/5 hover:bg-on-surface/10 rounded-lg flex items-center justify-center text-on-surface/40 transition-colors">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <p className="text-on-surface text-sm font-medium truncate">{value || <span className="text-on-surface/20 italic">Not set</span>}</p>
            <button
              onClick={() => { setDraft(value); setEditing(true) }}
              className="opacity-0 group-hover:opacity-100 w-6 h-6 bg-on-surface/5 hover:bg-[#FF1493]/20 rounded flex items-center justify-center text-on-surface/40 hover:text-[#FF1493] transition-all flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[14px]">edit</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, updateSession } = useAuth()
  const { data, saveProfile, appendActivityLog } = useAppData()
  const { isDark, toggleTheme } = useTheme()

  const [passwords, setPasswords] = useState({ current: '', new: '', confirm: '' })
  const [showPwd, setShowPwd] = useState({ current: false, new: false, confirm: false })
  const [pwdMsg, setPwdMsg] = useState(null)
  const [emailNotif, setEmailNotif] = useState(true)
  const [pushNotif, setPushNotif] = useState(true)

  // The user's profile photo: prefer saved profile photo, then Firebase photoURL, then header avatar fallback
  const photoURL = data.profile?.photo || user?.photoURL || null
  const displayName = data.profile?.name || user?.name || user?.displayName || 'User'
  const roleLabel = user?.role
    ? user.role.charAt(0).toUpperCase() + user.role.slice(1).toLowerCase()
    : 'Head Coach'

  const stats = [
    { label: 'Teams Managed', value: data.groups?.length || '2', icon: 'groups', color: 'text-red-400', bg: 'bg-red-400/10' },
    { label: 'Players', value: data.players?.length || '24', icon: 'person', color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Matches', value: '18', icon: 'calendar_today', color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Win Rate', value: data.coach?.stats?.winRate ? `${data.coach.stats.winRate}%` : '72%', icon: 'emoji_events', color: 'text-orange-400', bg: 'bg-orange-400/10' },
  ]

  const editableFields = [
    { label: 'Full Name', field: 'name', icon: 'person', value: data.profile?.name || user?.name || '' },
    ...(user?.role === 'admin' ? [{ label: 'School Name', field: 'schoolName', icon: 'school', value: data.profile?.schoolName || user?.schoolName || '' }] : []),
    { label: 'Phone', field: 'phone', icon: 'call', value: data.profile?.phone || '' },
    { label: 'Date of Birth', field: 'dob', icon: 'calendar_month', value: data.profile?.dob || '' },
    { label: 'Gender', field: 'gender', icon: 'transgender', value: data.profile?.gender || '' },
    { label: 'Location', field: 'location', icon: 'location_on', value: data.profile?.location || '' },
    { label: 'Language', field: 'language', icon: 'language', value: data.profile?.language || 'English' },
  ]

  const handleFieldSave = async (field, value) => {
    if (user?.isDemo) {
      appendActivityLog(`(Demo) Updated profile field: ${field}`, 'info')
      return
    }
    try {
      if (user?.uid) {
        const { doc, updateDoc } = await import('firebase/firestore')
        const { db } = await import('../../firebase')
        const userRef = doc(db, 'users', user.uid)
        await updateDoc(userRef, { [field]: value })
      }
      saveProfile({ [field]: value })
      updateSession({ [field]: value })
      appendActivityLog(`Updated profile field: ${field}`, 'info')
    } catch (err) {
      console.error('Failed to update field', err)
    }
  }

  const handlePasswordUpdate = () => {
    if (!passwords.current) return setPwdMsg({ type: 'error', text: 'Enter your current password.' })
    if (passwords.new.length < 6) return setPwdMsg({ type: 'error', text: 'New password must be at least 6 characters.' })
    if (passwords.new !== passwords.confirm) return setPwdMsg({ type: 'error', text: 'Passwords do not match.' })
    
    if (user?.isDemo) {
      setPwdMsg({ type: 'success', text: 'Password update simulated in Demo Mode!' })
      setPasswords({ current: '', new: '', confirm: '' })
      setTimeout(() => setPwdMsg(null), 3000)
      return
    }
    
    setPwdMsg({ type: 'success', text: 'Password updated successfully!' })
    setPasswords({ current: '', new: '', confirm: '' })
    setTimeout(() => setPwdMsg(null), 3000)
  }

  const activities = data.activityLogs?.slice(0, 4).map(log => ({
    text: log.message,
    time: log.time,
    icon: log.type === 'success' ? 'check_circle' : log.type === 'error' ? 'error' : 'info',
    color: log.type === 'success' ? 'text-green-400' : log.type === 'error' ? 'text-red-400' : 'text-blue-400',
  })) || []

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-10">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-on-surface">My Profile</h1>
            <p className="text-on-surface/40 text-sm mt-1">View and manage your personal information.</p>
          </div>
          <button
            onClick={() => navigate(`/${user?.role?.toLowerCase() === 'admin' ? 'admin' : 'coach'}/profile/edit`)}
            className="flex items-center gap-2 px-4 py-2.5 bg-on-surface/5 hover:bg-on-surface/10 border border-outline-variant/30 rounded-xl text-on-surface text-sm font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">edit</span>
            Edit Profile
          </button>
        </div>

        {/* Hero Card */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1A1A2E] via-[#16213E] to-[#0F0C29] border border-white/5 p-8">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF1493]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/5 blur-[80px] rounded-full -ml-20 -mb-20 pointer-events-none"></div>

          <div className="relative flex flex-col md:flex-row items-center gap-8">
            {/* Avatar — uses real user photo */}
            <div className="relative flex-shrink-0">
              <div className="w-32 h-32 rounded-full border-4 border-[#FF1493]/40 p-1 shadow-[0_0_30px_rgba(168,85,247,0.2)]">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-[#FF1493]/30 to-[#DC143C]/30 flex items-center justify-center">
                    <span className="text-3xl font-black text-[#FF1493]">
                      {displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate(`/${user?.role?.toLowerCase() === 'admin' ? 'admin' : 'coach'}/profile/edit`)}
                className="absolute bottom-1 right-1 w-8 h-8 bg-[#FF1493] hover:bg-[#C01277] rounded-full flex items-center justify-center border-2 border-[#0F0C29] text-on-surface transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">photo_camera</span>
              </button>
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-4">
                <h2 className="text-3xl font-bold text-on-surface">{displayName}</h2>
                <span className="inline-flex px-3 py-1 bg-[#FF1493]/20 border border-[#FF1493]/30 rounded-full text-[#FF1493] text-xs font-bold uppercase tracking-wider self-center md:self-auto">
                  {roleLabel}
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-center md:justify-start gap-2 text-on-surface/60">
                  <span className="material-symbols-outlined text-[18px]">mail</span>
                  <span className="text-sm">{user?.email || '—'}</span>
                </div>
                {data.profile?.phone && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-on-surface/60">
                    <span className="material-symbols-outlined text-[18px]">call</span>
                    <span className="text-sm">{data.profile.phone}</span>
                  </div>
                )}
                {data.profile?.location && (
                  <div className="flex items-center justify-center md:justify-start gap-2 text-on-surface/60">
                    <span className="material-symbols-outlined text-[18px]">location_on</span>
                    <span className="text-sm">{data.profile.location}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Details */}
            <div className="w-full md:w-auto bg-on-surface/5 backdrop-blur-md rounded-2xl p-6 border border-white/5 flex-shrink-0">
              <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                <div>
                  <p className="text-on-surface/40 text-[10px] uppercase tracking-widest mb-1">Role</p>
                  <p className="text-on-surface text-sm font-semibold">{roleLabel}</p>
                </div>
                <div>
                  <p className="text-on-surface/40 text-[10px] uppercase tracking-widest mb-1">Team</p>
                  <p className="text-on-surface text-sm font-semibold">{data.coach?.teamName || data.groups?.[0]?.name || 'Thunder FC'}</p>
                </div>
                <div>
                  <p className="text-on-surface/40 text-[10px] uppercase tracking-widest mb-1">Member Since</p>
                  <p className="text-on-surface text-sm font-semibold">Jan 15, 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, idx) => (
            <div key={idx} className="bg-on-surface/5 border border-white/5 rounded-2xl p-6 flex items-center gap-4 hover:bg-on-surface/10 transition-colors group">
              <div className={`w-12 h-12 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <div>
                <p className="text-on-surface/40 text-xs font-medium">{stat.label}</p>
                <p className="text-on-surface text-xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="flex flex-col gap-8">
            {/* Personal Information — all editable except email */}
            <div className="bg-on-surface/5 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#FF1493]">badge</span>
                <h3 className="text-lg font-bold text-on-surface">Personal Information</h3>
                <span className="ml-auto text-[10px] text-on-surface/20 italic">Hover a field to edit</span>
              </div>

              {/* Email — read-only */}
              <div className="flex items-center gap-4 pb-4 mb-4 border-b border-white/5">
                <div className="w-10 h-10 rounded-lg bg-on-surface/5 flex items-center justify-center text-on-surface/40 flex-shrink-0">
                  <span className="material-symbols-outlined text-[20px]">mail</span>
                </div>
                <div>
                  <p className="text-on-surface/40 text-[10px] uppercase tracking-widest mb-1">Email</p>
                  <div className="flex items-center gap-2">
                    <p className="text-on-surface text-sm font-medium">{user?.email || '—'}</p>
                    <span className="text-[9px] px-1.5 py-0.5 bg-on-surface/5 border border-outline-variant/30 rounded text-on-surface/30 uppercase tracking-wider">Read-only</span>
                  </div>
                </div>
              </div>

              {/* Editable fields */}
              <div className="flex flex-col gap-5">
                {editableFields.map(f => (
                  <EditableField
                    key={f.field}
                    icon={f.icon}
                    label={f.label}
                    field={f.field}
                    value={f.value}
                    onSave={handleFieldSave}
                  />
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-on-surface/5 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#FF1493]">settings</span>
                <h3 className="text-lg font-bold text-on-surface">Preferences</h3>
              </div>
              <div className="flex flex-col gap-6">
                {/* Email Notifications */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-on-surface text-sm font-medium">Email Notifications</p>
                    <p className="text-on-surface/40 text-xs">Receive email updates and alerts</p>
                  </div>
                  <button
                    onClick={() => setEmailNotif(v => !v)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${emailNotif ? 'bg-[#FF1493] shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-on-surface/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${emailNotif ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Push Notifications */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-on-surface text-sm font-medium">Push Notifications</p>
                    <p className="text-on-surface/40 text-xs">Receive push notifications</p>
                  </div>
                  <button
                    onClick={() => setPushNotif(v => !v)}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${pushNotif ? 'bg-[#FF1493] shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-on-surface/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${pushNotif ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>

                {/* Dark Mode */}
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-on-surface text-sm font-medium">Dark Mode</p>
                    <p className="text-on-surface/40 text-xs">Theme preference</p>
                  </div>
                  <button
                    onClick={toggleTheme}
                    className={`w-12 h-6 rounded-full transition-all duration-300 relative flex-shrink-0 ${isDark ? 'bg-[#FF1493] shadow-[0_0_10px_rgba(168,85,247,0.4)]' : 'bg-on-surface/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${isDark ? 'left-7' : 'left-1'}`}></div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-8">
            {/* Change Password */}
            <div className="bg-on-surface/5 border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-[#FF1493]">lock</span>
                <h3 className="text-lg font-bold text-on-surface">Change Password</h3>
              </div>
              <div className="flex flex-col gap-4">
                {[
                  { key: 'current', label: 'Current Password', placeholder: 'Enter current password' },
                  { key: 'new', label: 'New Password', placeholder: 'Enter new password' },
                  { key: 'confirm', label: 'Confirm New Password', placeholder: 'Confirm new password' },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="text-on-surface/60 text-xs font-medium mb-1.5 block">{label}</label>
                    <div className="relative">
                      <input
                        type={showPwd[key] ? 'text' : 'password'}
                        placeholder={placeholder}
                        value={passwords[key]}
                        onChange={e => setPasswords(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-3 pr-12 text-on-surface text-sm placeholder:text-on-surface/20 focus:outline-none focus:border-[#FF1493]/50 transition-colors"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd(p => ({ ...p, [key]: !p[key] }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/20 hover:text-on-surface/60 transition-colors"
                      >
                        <span className="material-symbols-outlined text-[20px]">{showPwd[key] ? 'visibility' : 'visibility_off'}</span>
                      </button>
                    </div>
                  </div>
                ))}

                {pwdMsg && (
                  <div className={`text-sm px-4 py-3 rounded-xl font-medium ${pwdMsg.type === 'success' ? 'bg-green-500/10 border border-green-500/20 text-green-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
                    {pwdMsg.text}
                  </div>
                )}

                <button
                  onClick={handlePasswordUpdate}
                  className="w-full bg-[#FF1493] hover:bg-[#C01277] active:scale-[0.98] text-on-surface py-3 rounded-xl font-bold transition-all mt-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]"
                >
                  Update Password
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-on-surface/5 border border-white/5 rounded-2xl p-6 flex-1">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FF1493]">schedule</span>
                  <h3 className="text-lg font-bold text-on-surface">Recent Activity</h3>
                </div>
                <button className="text-[#FF1493] text-xs font-bold hover:underline">View All</button>
              </div>
              {activities.length > 0 ? (
                <div className="flex flex-col gap-5">
                  {activities.map((activity, idx) => (
                    <div key={idx} className="flex gap-4">
                      <div className={`w-10 h-10 rounded-lg bg-on-surface/5 flex items-center justify-center flex-shrink-0 ${activity.color}`}>
                        <span className="material-symbols-outlined text-[20px]">{activity.icon}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-on-surface text-sm font-medium truncate">{activity.text}</p>
                        <p className="text-on-surface/40 text-xs mt-0.5">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <span className="material-symbols-outlined text-on-surface/10 text-5xl mb-3">history</span>
                  <p className="text-on-surface/30 text-sm">No recent activity yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
