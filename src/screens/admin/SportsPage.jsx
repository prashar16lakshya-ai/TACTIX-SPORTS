import { useState, useEffect } from 'react'
import { collection, query, onSnapshot, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { db } from '../../firebase'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import EmptyState from '../../components/common/EmptyState'

// Pre-defined icons for sports if they don't have one in DB
const SPORT_ICONS = {
  'football': 'sports_soccer',
  'basketball': 'sports_basketball',
  'tennis': 'sports_tennis',
  'cricket': 'sports_cricket',
  'volleyball': 'sports_volleyball',
  'swimming': 'pool',
  'athletics': 'directions_run',
  'default': 'sports'
}

export default function SportsPage() {
  const [search, setSearch] = useState('')
  const [sportsList, setSportsList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Assuming sports might be stored as a collection or derived from teams.
    // For now, let's query a 'sports' collection if it exists, or mock it if empty
    const q = query(collection(db, 'sports'))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      let list = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // If no sports found in DB, stay empty for real users. 
      // Demo users would see empty too unless they add some, or we add demo-specific logic.
      // But user wants fake data gone.

      setSportsList(list)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching sports:', err)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filtered = sportsList.filter(s => 
    (s.name || '').toLowerCase().includes(search.toLowerCase())
  )

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to delete this sport?')) {
      try {
        await deleteDoc(doc(db, 'sports', id))
      } catch (err) {
        console.error('Error deleting sport:', err)
        alert('Failed to delete sport.')
      }
    }
  }

  const getIcon = (name) => {
    if (!name) return SPORT_ICONS.default
    const key = name.toLowerCase()
    return SPORT_ICONS[key] || SPORT_ICONS.default
  }

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingSport, setEditingSport] = useState(null)
  const [sportForm, setSportForm] = useState({ name: '' })

  const openAddModal = () => {
    setEditingSport(null)
    setSportForm({ name: '' })
    setIsModalOpen(true)
  }

  const openEditModal = (sport) => {
    setEditingSport(sport)
    setSportForm({ name: sport.name })
    setIsModalOpen(true)
  }

  const saveSport = async () => {
    if (!sportForm.name.trim()) return
    try {
      if (editingSport) {
        await updateDoc(doc(db, 'sports', editingSport.id), { name: sportForm.name })
      } else {
        await addDoc(collection(db, 'sports'), { name: sportForm.name, teamsCount: 0, playersCount: 0 })
      }
      setIsModalOpen(false)
    } catch (err) {
      console.error('Error saving sport:', err)
      alert('Failed to save sport.')
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar trailingIcon="add_circle" onTrailingIconClick={openAddModal} />
      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 animate-slide-up">
          <div>
            <h1 className="text-headline-lg font-inter font-bold text-on-surface">Sports</h1>
            <p className="text-body-md font-lexend text-on-surface/60 mt-1">{sportsList.length} sports managed</p>
          </div>
          <button onClick={openAddModal} className="h-12 px-6 rounded-xl bg-primary text-on-primary font-lexend font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined">add</span>
            Add Sport
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">search</span>
          <input
            id="sports-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search sports..."
            className="w-full bg-[#111111] h-12 pl-12 pr-4 font-lexend text-body-md text-on-surface rounded-xl border border-outline-variant/30 focus:border-primary focus:shadow-[0_0_15px_rgba(220,20,60,0.2)] outline-none transition-all placeholder:text-on-surface/30"
          />
        </div>

        {/* Sports Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-slide-up stagger-2">
          {filtered.map(s => (
            <div key={s.id} className="bg-[#111111] border border-outline-variant/30 rounded-2xl p-6 relative overflow-hidden group hover:border-primary/50 hover:shadow-[0_0_30px_rgba(220,20,60,0.15)] transition-all duration-300 flex flex-col items-center text-center card-hover">
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button onClick={() => openEditModal(s)} className="w-8 h-8 rounded-full bg-on-surface/10 hover:bg-white/20 flex items-center justify-center text-on-surface transition-colors" title="Edit">
                  <span className="material-symbols-outlined text-[16px]">edit</span>
                </button>
                <button onClick={() => handleDelete(s.id)} className="w-8 h-8 rounded-full bg-red-500/20 hover:bg-red-500/40 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors" title="Delete">
                  <span className="material-symbols-outlined text-[16px]">delete</span>
                </button>
              </div>

              <div className="w-20 h-20 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center text-primary mb-4 mt-2 transition-transform duration-300 group-hover:scale-110 shadow-[0_0_15px_rgba(220,20,60,0.2)]">
                <span className="material-symbols-outlined text-[40px]">{getIcon(s.name)}</span>
              </div>
              
              <h3 className="text-xl font-lexend font-bold text-on-surface mb-4">{s.name}</h3>

              <div className="grid grid-cols-2 gap-4 w-full pt-4 border-t border-outline-variant/30">
                <div>
                  <p className="text-xs font-lexend text-on-surface/40 uppercase tracking-wider">Teams</p>
                  <p className="text-lg font-lexend font-bold text-on-surface mt-0.5">{s.teamsCount || 0}</p>
                </div>
                <div>
                  <p className="text-xs font-lexend text-on-surface/40 uppercase tracking-wider">Players</p>
                  <p className="text-lg font-lexend font-bold text-on-surface mt-0.5">{s.playersCount || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <EmptyState
            icon="sports"
            title="No sports found"
            description="Start by adding a sport to your organization."
            actionLabel="Add Sport"
            onAction={openAddModal}
          />
        )}
      </main>

      {/* Edit/Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-surface-container-high border border-outline-variant rounded-3xl p-6 shadow-2xl relative animate-fade-in-scale">
            <h2 className="text-xl font-bold text-on-surface mb-4">
              {editingSport ? 'Edit Sport' : 'Add Sport'}
            </h2>
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-primary uppercase tracking-wider">Sport Name</label>
                <input 
                  type="text" 
                  value={sportForm.name} 
                  onChange={(e) => setSportForm({ name: e.target.value })}
                  placeholder="e.g. Football"
                  className="bg-[#111111] border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface outline-none focus:border-primary"
                />
              </div>
              <div className="flex justify-end gap-3 mt-4">
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-outline-variant/30 text-on-surface/80 hover:bg-on-surface/5 transition-colors font-bold text-sm"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveSport}
                  className="px-6 py-2 rounded-xl bg-primary text-on-primary font-bold text-sm hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                  Save
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
