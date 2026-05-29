import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import StarRating from '../../components/StarRating'
import Toast from '../../components/Toast'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'

export default function MarkAttendance() {
  const navigate = useNavigate()
  const { data, setAttendanceForDate, appendActivityLog } = useAppData()
  const { user } = useAuth()
  const todayKey = new Date().toISOString().slice(0, 10)
  const isHoliday = data.holidays?.some(h => h.date === todayKey) || false
  const defaultRows = (data.players || []).map((player, index) => ({
    id: player.id,
    name: player.name,
    number: String(index + 1).padStart(2, '0'),
    position: `${player.sport || ''} · ${player.groupName || ''}`,
    status: null,
    stars: 0,
    remark: '',
  }))
  const [players, setPlayers] = useState((data.attendanceByDate || {})[todayKey] || defaultRows)
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const setStatus = (id, status) => setPlayers(ps => ps.map(p => p.id === id ? { ...p, status, stars: status === 'absent' ? 0 : p.stars } : p))
  const setStars = (id, stars) => setPlayers(ps => ps.map(p => p.id === id ? { ...p, stars } : p))
  const setRemark = (id, remark) => setPlayers(ps => ps.map(p => p.id === id ? { ...p, remark } : p))
  const markAll = (status) => setPlayers((ps) => ps.map((p) => ({ ...p, status, stars: status === 'absent' ? 0 : p.stars })))

  const handleSave = async () => {
    if (isHoliday) {
      setToast({ message: 'Holiday — Attendance not required', type: 'warning' })
      return
    }
    if (players.length === 0) {
      setToast({ message: 'No players to save attendance for.', type: 'error' })
      return
    }
    const unmarked = players.filter(p => p.status === null)
    if (unmarked.length > 0) {
      setToast({ message: `${unmarked.length} player(s) not marked yet.`, type: 'warning' })
      return
    }
    setSaving(true)
    await new Promise(r => setTimeout(r, 1200))
    setAttendanceForDate(todayKey, players)
    appendActivityLog('Attendance marked', 'success')
    setSaving(false)
    setToast({ message: 'Attendance saved successfully!', type: 'success' })
    setTimeout(() => navigate('/coach'), 1500)
  }

  const present = players.filter(p => p.status === 'present').length

  return (
    <div className="min-h-dvh bg-surface-container-lowest text-on-surface flex flex-col">
      {/* Header */}
      <header className="bg-slate-950 text-blue-500 sticky top-0 z-50 border-b border-slate-800">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-7xl mx-auto">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest flex-shrink-0 cursor-pointer">
            <div className="w-full h-full bg-primary-container/30 flex items-center justify-center font-inter font-bold text-primary">CM</div>
          </div>
          <img src="/name.png" alt="TACTIX" className="h-6 object-contain drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
          <button onClick={() => navigate(-1)} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-on-surface/5 transition-colors">
            <span className="material-symbols-outlined text-blue-500">close</span>
          </button>
        </div>
      </header>

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

      <main className="w-full max-w-7xl mx-auto px-6 py-8 flex-1 flex flex-col gap-6 pb-40">
        {/* Section Header */}
        <div className="flex flex-col gap-2 border-b-2 border-surface-container-high pb-4">
          <div className="flex justify-between items-end gap-4 flex-wrap">
            <div>
              <h2 className="text-headline-lg font-inter font-bold text-on-surface">Mark Attendance</h2>
              <p className="text-body-lg font-lexend text-primary mt-1 tracking-wide">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="inline-flex items-center gap-2 bg-secondary-fixed/10 text-secondary-fixed px-3 py-1.5 rounded-full border border-secondary-fixed/20">
              <span className="w-2 h-2 rounded-full bg-secondary-fixed animate-pulse" />
              <span className="text-label-sm font-lexend uppercase font-bold tracking-widest">Live Rostering</span>
            </div>
          </div>
          <div className="flex gap-4 text-label-sm font-lexend">
            <span className="text-primary">{present} Present</span>
            <span className="text-error">{players.filter(p => p.status === 'absent').length} Absent</span>
            <span className="text-on-surface-variant">{players.filter(p => !p.status).length} Unmarked</span>
          </div>
          {isHoliday && (
            <div className="px-4 py-3 rounded-xl bg-primary-container/20 border border-primary text-primary font-semibold">
              Holiday — Attendance not required
            </div>
          )}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => markAll('present')}
              disabled={isHoliday}
              className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-container font-bold disabled:opacity-50"
            >
              Mark Present (All)
            </button>
            <button
              onClick={() => markAll('absent')}
              disabled={isHoliday}
              className="px-4 py-2 rounded-lg bg-error-container text-on-error-container font-bold disabled:opacity-50"
            >
              Mark Absent (All)
            </button>
          </div>
        </div>

        {players.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-24 text-center bg-surface-container-low rounded-2xl border border-white/5 mx-4">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
              <span className="material-symbols-outlined text-4xl text-primary">person_search</span>
            </div>
            <h3 className="text-xl font-bold text-on-surface mb-2">No Students Found</h3>
            <p className="text-on-surface-variant max-w-sm mb-8">
              There are no players registered in your account yet. Please add players first to start marking attendance.
            </p>
            <button 
              onClick={() => navigate('/coach/players/add')}
              className="px-8 py-3 bg-primary text-on-primary rounded-xl font-bold hover:scale-105 transition-all"
            >
              Add Players
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {players.map(p => (
              <article key={p.id} className={`bg-surface-container-low rounded-xl border p-4 flex flex-col gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.2)] transition-all
                ${p.status === 'absent' ? 'border-error/20 opacity-80 hover:opacity-100' : 'border-surface-container-high hover:border-surface-container-highest'}`}>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* Profile */}
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 rounded-full bg-surface-container border-2 border-surface-container-highest flex items-center justify-center font-inter font-bold text-lg text-on-surface ${p.status === 'absent' ? 'grayscale' : ''}`}>
                      {p.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className={`text-headline-md font-inter font-bold leading-tight ${p.status === 'absent' ? 'text-on-surface-variant' : 'text-on-surface'}`}>{p.name}</h3>
                      <p className="text-label-sm font-lexend text-outline uppercase tracking-wider mt-1">#{p.number} · {p.position}</p>
                    </div>
                  </div>
                  {/* Toggle */}
                  <div className="flex bg-surface-container p-1 rounded-lg shadow-inner border border-surface-container-highest/50">
                    <button
                      onClick={() => setStatus(p.id, 'present')}
                      className={`px-4 py-2.5 rounded-md font-lexend text-label-lg flex-1 transition-all font-bold
                        ${p.status === 'present' ? 'bg-secondary-fixed text-on-secondary-fixed shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                      Present
                    </button>
                    <button
                      onClick={() => setStatus(p.id, 'absent')}
                      className={`px-4 py-2.5 rounded-md font-lexend text-label-lg flex-1 transition-all font-bold
                        ${p.status === 'absent' ? 'bg-error-container text-on-error-container shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}>
                      Absent
                    </button>
                  </div>
                </div>
                {/* Stars + Remark */}
                <div className="flex flex-col gap-3 pt-3 border-t border-surface-container">
                  <div className="flex items-center gap-4 flex-wrap">
                    <div className="bg-surface-container px-3 py-2 rounded-lg border border-surface-container-highest/30">
                      <StarRating value={p.stars} onChange={(s) => setStars(p.id, s)} disabled={p.status === 'absent'} />
                    </div>
                    <div className="flex-1 w-full">
                      <input
                        type="text"
                        value={p.remark}
                        onChange={e => setRemark(p.id, e.target.value)}
                        placeholder="Add remarks or notes..."
                        disabled={p.status === 'absent' && p.remark === ''}
                        className={`w-full bg-transparent border-0 border-b-2 py-2 font-lexend text-body-md text-on-surface placeholder:text-surface-bright transition-colors outline-none
                          ${p.status === 'absent' ? 'border-error/50 focus:border-error' : 'border-surface-container-highest focus:border-primary-container'}`}
                      />
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      {players.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 px-6 pb-6 pt-4 bg-gradient-to-t from-surface-container-lowest via-surface-container-lowest/90 to-transparent z-40">
          <button
            id="save-attendance"
            onClick={handleSave}
            disabled={saving || isHoliday || user?.isDemo}
            title={user?.isDemo ? "Login required to save attendance" : ""}
            className="w-full h-14 bg-primary-container text-secondary font-inter font-bold text-xl px-8 rounded-xl shadow-[0_4px_24px_rgba(12,202,117,0.4)] hover:bg-inverse-primary transition-colors flex items-center justify-center gap-3 disabled:opacity-60"
          >
            {saving ? (
              <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" /></svg>
            ) : (
              <><span className="material-symbols-outlined text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>cloud_upload</span>{user?.isDemo ? 'Save Attendance (Login Required)' : 'Save Attendance'}</>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
