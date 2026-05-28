import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { collection, query, onSnapshot, where, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const GROUP_COLORS = {
  'Cheetah XI':   'bg-primary/20 text-primary',
  'Thunderbolts': 'bg-yellow-500/20 text-yellow-400',
  'Unassigned':   'bg-surface-variant text-on-surface-variant',
}

export default function AllPlayers() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filterGroup, setFilterGroup] = useState('All')
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, 'users'), where('role', 'in', ['player', 'student']))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const playerList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setPlayers(playerList)
      setLoading(false)
    }, (err) => {
      console.error('Error fetching players:', err)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const filtered = players.filter(p => {
    const matchSearch = (p.name || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.sport || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.class || '').toLowerCase().includes(search.toLowerCase()) ||
      (p.team || '').toLowerCase().includes(search.toLowerCase())
    const matchGroup = filterGroup === 'All' || (p.sport || 'Unassigned') === filterGroup
    return matchSearch && matchGroup
  })

  // Get unique sports for the filter
  const sports = ['All', ...new Set(players.map(p => p.sport).filter(Boolean)), 'Unassigned']

  const handleDelete = async (id) => {
    if(window.confirm('Are you sure you want to remove this player? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'users', id))
        // The onSnapshot will automatically update the UI
      } catch (error) {
        console.error('Error deleting player:', error)
        alert('Failed to delete player. Please try again.')
      }
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar trailingIcon="filter_list" />
      <main className="flex-1 w-full max-w-7xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6 animate-fade-in">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-4 animate-slide-up">
          <div>
            <h1 className="text-headline-lg font-inter font-bold text-on-surface">Students Page</h1>
            <p className="text-body-md font-lexend text-on-surface/60 mt-1">{players.length} students across {sports.length - 1} sports</p>
          </div>
          <button onClick={() => navigate('/bulk-import')} className="h-12 px-6 rounded-xl bg-primary text-on-primary font-lexend font-bold flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors">
            <span className="material-symbols-outlined">person_add</span>
            Add Student
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface/40 pointer-events-none">search</span>
          <input
            id="players-search"
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, grade, team, or position..."
            className="w-full bg-[#111111] h-12 pl-12 pr-4 font-lexend text-body-md text-on-surface rounded-xl border border-outline-variant/30 focus:border-primary focus:shadow-[0_0_15px_rgba(220,20,60,0.2)] outline-none transition-all placeholder:text-on-surface/30"
          />
        </div>

        {/* Sport Filter */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {sports.map(g => (
            <button key={g} onClick={() => setFilterGroup(g)}
              className={`px-5 h-10 rounded-full font-lexend text-sm whitespace-nowrap transition-all duration-300
                ${filterGroup === g 
                  ? 'bg-primary/20 text-primary border border-primary/50 shadow-[0_0_15px_rgba(220,20,60,0.2)]' 
                  : 'bg-[#111111] border border-outline-variant/30 text-on-surface/60 hover:bg-on-surface/5 hover:text-primary'}`}>
              {g === 'All' ? 'All Sports' : g}
            </button>
          ))}
        </div>

        {/* Player Table/List */}
        <div className="bg-[#111111] border border-outline-variant/30 rounded-xl overflow-hidden shadow-lg shadow-black/50">
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse min-w-max">
              <thead>
                <tr className="bg-on-surface/5 border-b border-outline-variant/30 text-xs font-lexend text-on-surface/40 uppercase tracking-widest">
                  <th className="p-4 font-bold">Student</th>
                  <th className="p-4 font-bold">Grade & Position</th>
                  <th className="p-4 font-bold">Performance</th>
                  <th className="p-4 font-bold">Attendance</th>
                  <th className="p-4 font-bold text-right">Contact & Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => {
                  const perf = p.score || 0
                  const att = p.attendanceStats?.percentage || 0
                  return (
                    <tr key={p.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors group">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-inter font-bold text-on-surface text-sm shrink-0">
                            {(p.name || 'U').split(' ').map(n=>n?.[0]).join('')}
                          </div>
                          <div>
                            <h4 className="text-sm font-lexend font-medium text-on-surface">{p.name}</h4>
                            <p className="text-xs font-lexend text-on-surface/40 mt-0.5">{p.team || 'No Team Assigned'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <p className="text-sm font-lexend text-on-surface/80">Grade {p.class || 'N/A'}</p>
                        <p className="text-xs font-lexend text-on-surface/40 mt-0.5">{p.position || p.role}</p>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-lexend font-bold text-on-surface w-8">{perf}%</span>
                          <div className="flex-1 h-2 bg-on-surface/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#FF1493] to-primary rounded-full transition-all duration-1000" style={{ width: `${perf}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-lexend font-bold text-on-surface w-8">{att}%</span>
                          <div className="flex-1 h-2 bg-on-surface/10 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-[#DC143C] to-[#FF1493] rounded-full transition-all duration-1000" style={{ width: `${att}%` }}></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          {p.phone && (
                            <>
                              <a href={`https://wa.me/${p.phone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full bg-green-500/10 hover:bg-green-500/20 flex items-center justify-center text-green-400 hover:text-green-300 transition-colors" title="WhatsApp">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 00-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                                </svg>
                              </a>
                              <a href={`tel:${p.phone.replace(/[^0-9+]/g, '')}`} className="w-8 h-8 rounded-full bg-[#FF1493]/10 hover:bg-[#FF1493]/20 flex items-center justify-center text-[#FF1493] hover:text-[#FF1493]/80 transition-colors" title="Call">
                                <span className="material-symbols-outlined text-[18px]">call</span>
                              </a>
                            </>
                          )}
                          <div className="w-px h-4 bg-on-surface/10 mx-1"></div>
                          <button className="w-8 h-8 rounded-full bg-on-surface/5 hover:bg-on-surface/10 flex items-center justify-center text-on-surface/60 hover:text-primary transition-colors" title="Edit">
                            <span className="material-symbols-outlined text-[18px]">edit</span>
                          </button>
                          <button onClick={() => handleDelete(p.id)} className="w-8 h-8 rounded-full bg-red-500/10 hover:bg-red-500/20 flex items-center justify-center text-red-400 hover:text-red-300 transition-colors" title="Delete">
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {players.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-24 text-center bg-surface-container-low rounded-2xl border border-white/5 mx-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <span className="material-symbols-outlined text-4xl text-primary">person_add</span>
              </div>
              <h3 className="text-xl font-bold text-on-surface mb-2">No Students Registered</h3>
              <p className="text-on-surface-variant max-w-md mb-8">
                Your TACTIX roster is currently empty. Get started by adding players individually or using our bulk import tool.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <button 
                  onClick={() => navigate('/coach/players/add')}
                  className="px-6 py-3 bg-primary text-on-primary rounded-xl font-bold shadow-lg shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">person_add</span>
                  Add Single Player
                </button>
                <button 
                  onClick={() => navigate('/bulk-import')}
                  className="px-6 py-3 bg-surface-container-high text-on-surface rounded-xl font-bold border border-outline-variant/30 hover:bg-on-surface/5 transition-all flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">upload_file</span>
                  Bulk Import
                </button>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-on-surface/40">
              <span className="material-symbols-outlined text-[48px] opacity-50">person_search</span>
              <p className="mt-4 text-sm font-lexend">No students found matching your filters.</p>
            </div>
          ) : null}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
