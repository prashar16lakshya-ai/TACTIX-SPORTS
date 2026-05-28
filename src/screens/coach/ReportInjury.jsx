import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { db } from '../../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'

const BODY_PARTS = ['Head', 'Neck', 'Shoulder', 'Arm', 'Wrist/Hand', 'Back', 'Hip', 'Knee', 'Ankle/Foot', 'Other']
const SEVERITY_OPTIONS = [
  { value: 'mild', label: 'Mild', color: 'yellow', icon: 'sentiment_neutral' },
  { value: 'moderate', label: 'Moderate', color: 'orange', icon: 'warning' },
  { value: 'severe', label: 'Severe', color: 'red', icon: 'emergency' },
]

export default function ReportInjury() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { data, isDemoMode } = useAppData()

  const preselectedId = searchParams.get('playerId') || ''
  const players = data?.players || []

  const [form, setForm] = useState({
    playerId: preselectedId,
    bodyPart: '',
    severity: '',
    dateReported: new Date().toISOString().slice(0, 10),
    notes: '',
  })
  const [toast, setToast] = useState(null)
  const [saving, setSaving] = useState(false)

  const selectedPlayer = players.find(p => p.id === form.playerId)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.playerId) { setToast({ message: 'Please select a player', type: 'error' }); return }
    if (!form.bodyPart) { setToast({ message: 'Please select body part', type: 'error' }); return }
    if (!form.severity) { setToast({ message: 'Please select severity', type: 'error' }); return }

    setSaving(true)
    try {
      const injuryData = {
        playerId: form.playerId,
        playerName: selectedPlayer?.name || 'Unknown',
        teamId: selectedPlayer?.groupId || selectedPlayer?.teamId || '',
        schoolId: user?.schoolId || '',
        bodyPart: form.bodyPart,
        severity: form.severity,
        dateReported: form.dateReported,
        status: 'active',
        notes: form.notes,
        reportedBy: user?.uid || '',
        reportedByName: user?.name || '',
        createdAt: serverTimestamp(),
      }

      if (!isDemoMode) {
        await addDoc(collection(db, 'injuries'), injuryData)
      }

      setToast({ message: 'Injury reported successfully', type: 'success' })
      setTimeout(() => navigate(-1), 1200)
    } catch (error) {
      console.error('Report injury error:', error)
      setToast({ message: 'Failed to report injury', type: 'error' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar showBack title="Report Injury" trailingIcon="local_hospital" />
      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

      <main className="flex-1 pt-20 pb-10 px-6 max-w-2xl mx-auto w-full">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Player Selector */}
          <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-3 block">
              Player <span className="text-red-400">*</span>
            </label>
            {preselectedId && selectedPlayer ? (
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#DC143C]/20 border border-[#DC143C]/30 flex items-center justify-center text-[#DC143C] font-black">
                  {selectedPlayer.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </div>
                <div>
                  <p className="text-on-surface font-bold">{selectedPlayer.name}</p>
                  <p className="text-on-surface/40 text-xs">{selectedPlayer.sport || selectedPlayer.groupName || 'Player'}</p>
                </div>
              </div>
            ) : (
              <select
                value={form.playerId}
                onChange={e => setForm(f => ({ ...f, playerId: e.target.value }))}
                className="w-full bg-[#0A0A0A] border border-outline-variant/30 rounded-xl text-on-surface p-3 outline-none focus:border-[#DC143C] text-sm"
              >
                <option value="">-- Select Player --</option>
                {players.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            )}
          </div>

          {/* Body Part */}
          <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-3 block">
              Body Part <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {BODY_PARTS.map(part => (
                <button
                  key={part}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, bodyPart: part }))}
                  className={`px-3 py-2.5 rounded-xl text-xs font-bold transition-all border ${
                    form.bodyPart === part
                      ? 'bg-[#DC143C]/15 border-[#DC143C]/40 text-[#DC143C]'
                      : 'bg-on-surface/5 border-white/5 text-on-surface/50 hover:text-on-surface'
                  }`}
                >
                  {part}
                </button>
              ))}
            </div>
          </div>

          {/* Severity */}
          <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-3 block">
              Severity <span className="text-red-400">*</span>
            </label>
            <div className="flex gap-3">
              {SEVERITY_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setForm(f => ({ ...f, severity: opt.value }))}
                  className={`flex-1 flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                    form.severity === opt.value
                      ? `bg-${opt.color}-500/15 border-${opt.color}-500/40 text-${opt.color}-500`
                      : 'bg-on-surface/5 border-white/5 text-on-surface/40'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {opt.icon}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Date */}
          <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-3 block">
              Date of Injury
            </label>
            <input
              type="date"
              value={form.dateReported}
              onChange={e => setForm(f => ({ ...f, dateReported: e.target.value }))}
              className="w-full bg-[#0A0A0A] border border-outline-variant/30 rounded-xl text-on-surface p-3 outline-none focus:border-[#DC143C] text-sm"
            />
          </div>

          {/* Notes */}
          <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-3 block">
              Notes <span className="text-on-surface/20">(optional)</span>
            </label>
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Describe the injury details..."
              rows={3}
              className="w-full bg-[#0A0A0A] border border-outline-variant/30 rounded-xl text-on-surface p-3 outline-none focus:border-[#DC143C] text-sm resize-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={saving || isDemoMode}
            className="w-full h-14 bg-red-500 text-white font-black uppercase tracking-widest text-sm rounded-xl hover:bg-red-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>local_hospital</span>
                {isDemoMode ? 'Report Injury (Login Required)' : 'Report Injury'}
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  )
}
