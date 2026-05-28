import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, where, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

export default function CoachesPage() {
  const [search, setSearch] = useState('')
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', '==', 'coach'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setCoaches(list)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching coaches:', err)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filtered = coaches.filter(c => 
    (c.name || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.email || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleRemove = async (id) => {
    if(window.confirm('Are you sure you want to remove this coach? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', id))
      } catch (error) {
        console.error('Error deleting coach:', error)
        alert('Failed to delete coach. Please try again.')
      }
    }
  }

  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
  const [inviteEmail, setInviteEmail] = useState('')

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    // Simple mailto link to open default email client
    window.location.href = `mailto:${inviteEmail}?subject=Invitation%20to%20join%20TACTIX%20as%20a%20Coach&body=Hello,%0A%0AYou%20have%20been%20invited%20to%20join%20TACTIX%20as%20a%20Coach.%20Please%20sign%20up%20using%20this%20email%20address.`
    setIsInviteModalOpen(false)
    setInviteEmail('')
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar trailingIcon="person_add" onTrailingIconClick={() => setIsInviteModalOpen(true)} />
      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 animate-slide-up">
          <div>
            <h1 className="text-headline-lg font-inter font-bold text-on-surface">Coaches</h1>
            <p className="text-body-md font-lexend text-on-surface/60 mt-1">{coaches.length} active coaches</p>
          </div>
          <button onClick={() => setIsInviteModalOpen(true)} className="h-12 px-6 rounded-xl bg-primary text-on-primary font-lexend font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined">mail</span>
            Invite Coach
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">search</span>
          <input
            id="coaches-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-[#111111] h-12 pl-12 pr-4 font-lexend text-body-md text-on-surface rounded-xl border border-outline-variant/30 focus:border-primary focus:shadow-[0_0_15px_rgba(220,20,60,0.2)] outline-none transition-all placeholder:text-on-surface/30"
          />
        </div>

        {/* Coach Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map(c => {
            const exp = c.experience || 0;
            const teams = c.assignedTeams ? c.assignedTeams.length : 0;
            const players = c.playerCount || 0;
            
            return (
              <div key={c.id} className="bg-[#111111] border border-outline-variant/30 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 hover:shadow-[0_0_30px_rgba(220,20,60,0.15)] transition-all duration-300 card-hover">
                <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <button className="w-8 h-8 rounded-full bg-on-surface/10 hover:bg-white/20 flex items-center justify-center text-on-surface transition-colors" title="Edit">
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                  </button>
                  <button onClick={() => handleRemove(c.id)} className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors" title="Remove">
                    <span className="material-symbols-outlined text-[16px]">person_remove</span>
                  </button>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-full bg-surface-container-high border-2 border-primary flex items-center justify-center font-inter font-bold text-on-surface text-xl shrink-0">
                    {(c.name || 'C').split(' ').map(n=>n?.[0]).join('')}
                  </div>
                  <div>
                    <h3 className="text-lg font-lexend font-bold text-on-surface">{c.name}</h3>
                    <p className="text-sm font-lexend text-on-surface/60">{c.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-lexend font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/30">
                      {exp} Years Exp
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-outline-variant/30">
                  <div>
                    <p className="text-xs font-lexend text-on-surface/40 uppercase tracking-wider">Teams</p>
                    <p className="text-lg font-lexend font-bold text-on-surface mt-0.5">{teams}</p>
                  </div>
                  <div>
                    <p className="text-xs font-lexend text-on-surface/40 uppercase tracking-wider">Total Players</p>
                    <p className="text-lg font-lexend font-bold text-on-surface mt-0.5">{players}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-on-surface/40">
            <span className="material-symbols-outlined text-[48px] opacity-50">search_off</span>
            <p className="mt-4 text-sm font-lexend">No coaches found.</p>
          </div>
        )}
      </main>

      {/* Invite Coach Modal */}
      {isInviteModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-surface-container-high border border-outline-variant rounded-3xl p-6 shadow-2xl relative animate-fade-in-scale">
            <h2 className="text-xl font-bold text-on-surface mb-4">
              Invite Coach
            </h2>
            <p className="text-sm text-on-surface/60 mb-4">Enter the email address of the coach you wish to invite to TACTIX.</p>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider">Email Address</label>
                <input 
                  type="email" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)}
                  placeholder="coach@example.com"
                  className="bg-[#111111] border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setIsInviteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface/80 hover:bg-on-surface/5 transition-colors font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleInvite}
                  className="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">send</span>
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
