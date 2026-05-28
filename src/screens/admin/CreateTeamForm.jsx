import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import { generateCode, createAccessCode } from '../../utils/codeManager'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import Toast from '../../components/Toast'

const SPORTS = ['Football', 'Basketball', 'Cricket', 'Soccer', 'Tennis', 'Badminton', 'Swimming', 'Athletics', 'Other']

export default function CreateTeamForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', sport: '', customSport: '', coachId: '' })
  const [coaches, setCoaches] = useState([])
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const [createdTeamCode, setCreatedTeamCode] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        // Only fetch users with role 'coach' and who have a teamId (joined via code)
        const q = query(
          collection(db, 'users'), 
          where('role', '==', 'coach')
        )
        const querySnapshot = await getDocs(q)
        const coachesList = querySnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(c => c.teamId) // Ensure they joined via team code
        setCoaches(coachesList)
      } catch (err) {
        console.error('Error fetching coaches:', err)
      }
    }
    fetchCoaches()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.sport || (form.sport === 'Other' && !form.customSport)) {
      setToast({ message: 'Please fill in all required fields.', type: 'error' })
      return
    }

    if (form.coachId) {
      const selectedCoach = coaches.find(c => c.id === form.coachId)
      if (!selectedCoach || selectedCoach.role !== 'coach') {
        setToast({ message: 'Invalid coach selected.', type: 'error' })
        return
      }
    }

    setLoading(true)
    try {
      const teamSport = form.sport === 'Other' ? form.customSport : form.sport
      const teamData = {
        name: form.name,
        sport: teamSport,
        coachId: form.coachId,
        players: [],
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        memberCount: 0
      }

      const docRef = await addDoc(collection(db, 'teams'), teamData)
      
      const newTeamCode = generateCode('TEAM', teamSport)
      
      await updateDoc(docRef, { teamCode: newTeamCode })
      
      await createAccessCode({
        code: newTeamCode,
        type: 'team',
        createdBy: user.uid,
        teamId: docRef.id
      })

      setCreatedTeamCode(newTeamCode)
      setToast({ message: `Team "${form.name}" created successfully!`, type: 'success' })
    } catch (err) {
      console.error('Error creating team:', err)
      setToast({ message: 'Failed to create team. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCopyCode = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(createdTeamCode)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = createdTeamCode
        textArea.style.position = "absolute"
        textArea.style.left = "-999999px"
        document.body.prepend(textArea)
        textArea.select()
        try {
          document.execCommand('copy')
        } catch (error) {
          console.error('Fallback copy failed', error)
        } finally {
          textArea.remove()
        }
      }
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full">
        <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Create Team</h1>
            <p className="text-on-surface/50 text-sm">Initialize a new athletic squad for the school.</p>
          </div>
        </div>

        {createdTeamCode ? (
          <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-8 lg:p-10 flex flex-col items-center justify-center gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#DC143C]/10 to-transparent opacity-50"></div>
            
            <div className="w-20 h-20 rounded-full bg-[#DC143C]/20 flex items-center justify-center text-[#DC143C] relative z-10 shadow-[0_0_30px_rgba(124,58,237,0.3)]">
              <span className="material-symbols-outlined text-5xl">check_circle</span>
            </div>
            
            <div className="text-center relative z-10">
              <h3 className="text-2xl font-black text-on-surface mb-2">Team Forged Successfully!</h3>
              <p className="text-on-surface/60 text-sm">Share this code with athletes to join this team.</p>
            </div>

            <div className="w-full max-w-sm p-6 bg-[#0A0A0A] border-2 border-[#DC143C]/30 rounded-2xl relative group relative z-10">
              <div className="text-center">
                <p className="text-[10px] uppercase tracking-[0.3em] text-[#DC143C] font-black mb-2">Team Access Code</p>
                <p className="text-3xl font-black tracking-tighter text-on-surface font-lexend">{createdTeamCode}</p>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-2">
                {copySuccess && (
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#DC143C]/20 rounded-full border border-[#DC143C]/30 animate-in fade-in zoom-in slide-in-from-right-2 duration-300">
                    <span className="material-symbols-outlined text-[14px] text-[#DC143C]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    <span className="text-[10px] text-[#DC143C] font-black uppercase tracking-widest">Copied</span>
                  </div>
                )}
                <button
                  onClick={handleCopyCode}
                  className={`p-2 rounded-lg transition-all duration-300 ${copySuccess
                    ? 'bg-[#DC143C]/20 text-[#DC143C] scale-110'
                    : 'bg-on-surface/5 text-on-surface/60 hover:text-[#DC143C] hover:bg-[#DC143C]/10'
                    }`}
                  aria-label="Copy code to clipboard"
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {copySuccess ? 'check' : 'content_copy'}
                  </span>
                </button>
              </div>
            </div>

            <button
              onClick={() => navigate('/admin/teams')}
              className="mt-4 h-14 px-8 rounded-2xl bg-[#DC143C] text-on-primary font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] relative z-10"
            >
              Back to Teams
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-8 lg:p-10 flex flex-col gap-8 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#DC143C]/5 to-transparent opacity-50"></div>
            
            <div className="relative z-10 space-y-8">
              {/* Team Name */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Team Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30">groups</span>
                  <input 
                    className="w-full bg-[#0A0A0A] border border-outline-variant/30 text-on-surface font-bold px-12 py-4 rounded-2xl focus:border-[#DC143C] outline-none transition-all placeholder:text-on-surface/10" 
                    placeholder="e.g. Velocity Strikers" 
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    required
                  />
                </div>
              </div>

              {/* Sport Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Primary Sport</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30">sports_football</span>
                    <select 
                      className="w-full bg-[#0A0A0A] border border-outline-variant/30 text-on-surface font-bold pl-12 pr-10 py-4 rounded-2xl focus:border-[#DC143C] outline-none transition-all appearance-none cursor-pointer" 
                      value={form.sport}
                      onChange={e => setForm(f => ({ ...f, sport: e.target.value }))}
                      required
                    >
                      <option value="" disabled>Select Sport</option>
                      {SPORTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/30 pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Assign Head Coach</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/30">sports</span>
                    <select 
                      className="w-full bg-[#0A0A0A] border border-outline-variant/30 text-on-surface font-bold pl-12 pr-10 py-4 rounded-2xl focus:border-[#DC143C] outline-none transition-all appearance-none cursor-pointer" 
                      value={form.coachId}
                      onChange={e => setForm(f => ({ ...f, coachId: e.target.value }))}
                    >
                      <option value="">No coach assigned</option>
                      {coaches.map(c => (
                        <option key={c.id} value={c.id}>{c.name || c.email}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/30 pointer-events-none">expand_more</span>
                  </div>
                </div>
              </div>

              {form.sport === 'Other' && (
                <div className="flex flex-col gap-2 animate-in slide-in-from-top-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Custom Sport Name</label>
                  <input 
                    className="w-full bg-[#0A0A0A] border border-outline-variant/30 text-on-surface font-bold px-6 py-4 rounded-2xl focus:border-[#DC143C] outline-none transition-all" 
                    placeholder="Enter sport name..." 
                    type="text"
                    value={form.customSport}
                    onChange={e => setForm(f => ({ ...f, customSport: e.target.value }))}
                    required
                  />
                </div>
              )}

              <div className="flex items-center gap-4 pt-4">
                <button 
                  type="button"
                  onClick={() => navigate(-1)}
                  className="flex-1 h-14 rounded-2xl border border-outline-variant/30 text-on-surface/60 font-black uppercase tracking-widest hover:bg-on-surface/5 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="flex-[2] h-14 rounded-2xl bg-[#DC143C] text-on-primary font-black uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Forge Team'}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </DashboardLayout>
  )
}
