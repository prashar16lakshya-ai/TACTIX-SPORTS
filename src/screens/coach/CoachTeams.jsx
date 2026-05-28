import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, where, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

export default function CoachTeams() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [teams, setTeams] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedTeamId, setCopiedTeamId] = useState(null)

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
    if (!user) return
    
    // Use onSnapshot for real-time updates
    const q = query(collection(db, 'teams'), where('coachId', '==', user.uid))
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
  }, [user])

  return (
    <div className="bg-background text-on-background font-body-md antialiased min-h-screen pb-24 pt-20">
      <TopBar trailingIcon="settings" trailingPath="/coach/settings" title="Team Manager" />

      <main className="px-container-padding max-w-5xl mx-auto flex flex-col gap-stack-lg">
        {/* Section Header */}
        <div className="flex flex-col gap-stack-sm mt-4">
          <h2 className="font-headline-xl text-headline-xl text-on-surface">Active Rosters</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">Monitor performance metrics and manage line-ups for your assigned squads.</p>
        </div>

        {/* Teams Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-stack-md">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-surface-container rounded-xl p-container-padding h-64 animate-pulse border border-outline-variant" />
            ))
          ) : teams.length > 0 ? (
            teams.map(team => (
              <article 
                key={team.id}
                onClick={() => navigate(`/coach/teams/${team.id}`)}
                className="bg-surface-container rounded-xl p-container-padding flex flex-col gap-stack-md border border-outline-variant relative overflow-hidden group hover:border-primary/50 transition-colors duration-300 cursor-pointer"
              >
                {/* Bio-tech accent glow */}
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none group-hover:bg-primary/20 transition-all duration-500"></div>
                
                <div className="flex justify-between items-start z-10">
                  <div className="flex flex-col gap-1">
                    <span className="inline-block px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container font-label-sm text-label-sm w-fit uppercase tracking-wider">
                      {team.sport || 'General'}
                    </span>
                    <h3 className="font-headline-md text-headline-md text-on-surface mt-1">{team.name}</h3>
                  </div>
                  <span className="material-symbols-outlined text-primary text-3xl opacity-80" style={{ fontVariationSettings: "'FILL' 1" }}>
                    {getSportIcon(team.sport)}
                  </span>
                </div>

                <div className="flex flex-col gap-4 mt-2 z-10 flex-grow">
                  <div className="flex items-center gap-3 bg-surface-container-highest rounded-lg p-3">
                    <div className="w-10 h-10 rounded-full bg-surface flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface-variant">groups</span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-body-md text-body-md text-on-surface">{team.memberCount || 0} Active Athletes</span>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">Team ID: {team.id.slice(0, 8)}</span>
                    </div>
                  </div>

                  {/* Team Code Display */}
                  {team.teamCode && (
                    <div 
                      className="mt-auto flex items-center justify-between bg-surface-container-high rounded-lg p-3 border border-outline-variant/50 hover:border-primary/30 transition-colors"
                      onClick={(e) => handleCopyCode(team.id, team.teamCode, e)}
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Access Code</span>
                        <span className="font-lexend font-black text-on-surface tracking-wider">{team.teamCode}</span>
                      </div>
                      <button 
                        className={`p-2 rounded-md transition-all ${copiedTeamId === team.id ? 'bg-primary/20 text-primary' : 'bg-surface-container text-on-surface hover:text-primary'}`}
                        title="Copy Code"
                      >
                        <span className="material-symbols-outlined text-[18px]">
                          {copiedTeamId === team.id ? 'check' : 'content_copy'}
                        </span>
                      </button>
                    </div>
                  )}
                </div>

                <button className="mt-4 w-full min-h-[48px] bg-primary text-on-primary font-label-lg text-label-lg rounded-lg flex items-center justify-center gap-2 hover:bg-primary-fixed transition-colors active:scale-95 z-10 shadow-[0_4px_14px_rgba(68,231,142,0.15)]">
                  <span>View Dashboard</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </article>
            ))
          ) : (
            <div className="col-span-full bg-surface-container rounded-xl border border-dashed border-outline-variant p-12 text-center">
              <span className="material-symbols-outlined text-outline text-6xl">groups</span>
              <p className="mt-4 text-headline-md text-on-surface">No teams assigned yet.</p>
              <p className="text-body-md text-on-surface-variant">Contact your administrator to be assigned to a team.</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}

function getSportIcon(sport) {
  switch (sport?.toLowerCase()) {
    case 'basketball': return 'sports_basketball'
    case 'soccer': return 'sports_soccer'
    case 'football': 
    case 'american football': return 'sports_football'
    case 'track & field': return 'directions_run'
    case 'baseball': return 'sports_baseball'
    case 'tennis': return 'sports_tennis'
    case 'volleyball': return 'sports_volleyball'
    case 'swimming': return 'pool'
    default: return 'sports'
  }
}
