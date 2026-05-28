import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore'
import { db } from '../../firebase'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import EmptyState from '../../components/EmptyState'
import { doc, updateDoc, where } from 'firebase/firestore'
import { useAuth } from '../../context/AuthContext'

export default function AdminTeams() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [copiedTeamId, setCopiedTeamId] = useState(null)
  
  const { user } = useAuth()
  const [assigningTeam, setAssigningTeam] = useState(null)
  const [coaches, setCoaches] = useState([])
  const [loadingCoaches, setLoadingCoaches] = useState(false)

  const handleCopyCode = async (teamId, code, e) => {
    e.stopPropagation();
    if (!code) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code)
      } else {
        const textArea = document.createElement("textarea")
        textArea.value = code
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
      setCopiedTeamId(teamId)
      setTimeout(() => setCopiedTeamId(null), 2500)
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  useEffect(() => {
    const q = query(collection(db, 'teams'), orderBy('createdAt', 'desc'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const teamsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setTeams(teamsList)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching teams:', err)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filtered = teams.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase()) ||
    t.sport.toLowerCase().includes(search.toLowerCase())
  )

  const handleAssignCoachClick = (team) => {
    setAssigningTeam(team)
    setLoadingCoaches(true)
    
    // Fetch coaches
    const coachesQuery = query(
      collection(db, 'users'),
      where('role', '==', 'coach'),
      where('schoolId', '==', user?.schoolId || '')
    )
    
    const unsub = onSnapshot(coachesQuery, (snap) => {
      setCoaches(snap.docs.map(d => ({ id: d.id, ...d.data() })))
      setLoadingCoaches(false)
    }, (err) => {
      console.error(err)
      setLoadingCoaches(false)
    })
  }

  const handleSelectCoach = async (coach) => {
    if (!assigningTeam) return
    try {
      await updateDoc(doc(db, 'teams', assigningTeam.id), {
        coachId: coach.id,
        coachName: coach.name || coach.fullName || 'Unknown Coach',
        coach: coach.name || coach.fullName || 'Unknown Coach'
      })
      setAssigningTeam(null)
    } catch (err) {
      console.error('Error assigning coach:', err)
      alert('Failed to assign coach.')
    }
  }

  return (
    <div className="min-h-dvh bg-surface-container-lowest flex flex-col">
      <TopBar trailingIcon="settings" trailingPath="/admin/settings" />

      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-28 px-6 flex flex-col">
        {/* Header */}
        <div className="py-8 flex flex-col gap-4">
          <div>
            <h1 className="text-headline-xl font-inter font-black text-on-surface tracking-tight">Active Rosters</h1>
            <p className="text-body-md font-lexend text-on-surface-variant mt-1">Manage YOUR TEAM NAMEs, athletes, and coaching staff.</p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant z-10 pointer-events-none">search</span>
            <input
              id="teams-search"
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search teams or coaches..."
              className="w-full bg-surface-container h-12 pl-12 pr-4 text-body-md font-lexend text-on-surface rounded-lg border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary-container outline-none transition-colors placeholder:text-surface-bright"
            />
          </div>
        </div>

        {/* Team Cards */}
        <div className="flex-1 flex flex-col gap-4">
          {filtered.length > 0 ? filtered.map(t => (
            <div
              key={t.id}
              id={`team-card-${t.id}`}
              className="bg-surface-container-low rounded-xl border border-surface-container p-6 relative overflow-hidden group hover:border-primary-container transition-colors cursor-pointer flex flex-col min-h-[180px]"
              onClick={() => navigate('/admin/players')}
            >
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-secondary-container/10 rounded-full blur-3xl group-hover:bg-secondary-container/20 transition-all" />
              <div className="flex justify-between items-start mb-auto relative z-10">
                <span className="inline-flex items-center px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-label-sm font-lexend uppercase tracking-widest">
                  {t.sport}
                </span>
                <span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary transition-colors">arrow_forward</span>
              </div>
              <div className="mt-8 relative z-10 flex flex-col flex-1">
                <h3 className="text-headline-md font-inter font-bold text-on-surface mb-2">{t.name}</h3>
                <div className="flex items-center justify-between gap-2 text-on-surface-variant mb-4">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-[18px]">person</span>
                    <span className="text-label-lg font-lexend">{t.coach || t.coachName || 'Unassigned'}</span>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleAssignCoachClick(t); }}
                    className="text-[10px] uppercase font-bold tracking-widest text-primary border border-primary/30 px-2 py-1 rounded hover:bg-primary/10 transition-colors z-20"
                  >
                    {(t.coach || t.coachName || t.coachId) ? 'Reassign' : 'Assign Coach'}
                  </button>
                </div>
                
                {/* Team Code Display */}
                {t.teamCode && (
                  <div 
                    className="mt-auto mb-4 flex items-center justify-between bg-surface-container-high rounded-lg p-3 border border-outline-variant/50 hover:border-primary/30 transition-colors"
                    onClick={(e) => handleCopyCode(t.id, t.teamCode, e)}
                  >
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Access Code</span>
                      <span className="font-lexend font-black text-on-surface tracking-wider">{t.teamCode}</span>
                    </div>
                    <button 
                      className={`p-2 rounded-md transition-all ${copiedTeamId === t.id ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface hover:text-primary'}`}
                      title="Copy Code"
                    >
                      <span className="material-symbols-outlined text-[18px]">
                        {copiedTeamId === t.id ? 'check' : 'content_copy'}
                      </span>
                    </button>
                  </div>
                )}
                
                <div className="pt-4 border-t border-surface flex justify-between items-center">
                  <div className="flex items-center gap-1.5 text-tertiary">
                    <span className="material-symbols-outlined text-[16px]">groups</span>
                    <span className="text-label-sm font-lexend">{t.athletes} Athletes</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`relative flex h-2 w-2`}>
                      {t.pulse && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary-fixed opacity-75" />}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${t.pulse ? 'bg-secondary-fixed' : 'bg-surface-variant'}`} />
                    </span>
                    <span className={`text-label-sm font-lexend uppercase tracking-wider ${t.statusColor}`}>{t.status}</span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <EmptyState
              icon="groups"
              title="No Teams Created"
              description="Your roster is empty. Create your first team to start tracking attendance and performance."
              actionLabel="Create Team"
              onAction={() => navigate('/admin/teams/create')}
            />
          )}
        </div>
      </main>

      {/* FAB */}
      <button
        id="fab-create-team"
        onClick={() => navigate('/admin/teams/create')}
        className="fixed bottom-24 right-6 w-14 h-14 bg-primary-container rounded-full flex items-center justify-center shadow-[0_4px_20px_rgba(12,202,117,0.4)] z-40 active:scale-95 transition-transform hover:bg-inverse-primary"
      >
        <span className="material-symbols-outlined text-on-primary-container text-[28px]" style={{ fontVariationSettings: "'FILL' 1" }}>add</span>
      </button>

      <BottomNav />

      {assigningTeam && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setAssigningTeam(null)}>
          <div className="bg-surface-container border border-outline-variant/30 rounded-2xl w-full max-w-md p-6 flex flex-col max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-black text-on-surface uppercase tracking-tight">Assign Coach</h2>
              <button onClick={() => setAssigningTeam(null)} className="text-on-surface-variant hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <p className="text-sm text-on-surface-variant mb-4">
              Select a coach to assign to <strong className="text-primary">{assigningTeam.name}</strong>.
            </p>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-2">
              {loadingCoaches ? (
                <div className="p-4 text-center text-on-surface-variant text-sm animate-pulse">Loading coaches...</div>
              ) : coaches.length > 0 ? (
                coaches.map(c => (
                  <button
                    key={c.id}
                    onClick={() => handleSelectCoach(c)}
                    className="flex items-center gap-4 p-4 rounded-xl border border-outline-variant/30 bg-surface-container-low hover:border-primary hover:bg-primary/5 transition-all text-left"
                  >
                    <div className="w-10 h-10 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-sm">
                      {c.name?.charAt(0) || c.fullName?.charAt(0) || 'C'}
                    </div>
                    <div className="flex-1">
                      <div className="font-bold text-on-surface text-sm">{c.name || c.fullName}</div>
                      <div className="text-[10px] text-on-surface-variant uppercase tracking-widest">{c.email}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="p-6 text-center border border-dashed border-outline-variant/30 rounded-xl bg-surface-container-lowest text-on-surface-variant text-sm">
                  No available coaches found in your school.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
