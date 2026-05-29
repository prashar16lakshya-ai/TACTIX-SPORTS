import { useState } from 'react'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const MOCK_USERS = [
  { id: '1', name: 'Alex Johnson', email: 'alex@tactix.demo', role: 'admin', initials: 'AJ', color: 'bg-primary/20 text-primary border-primary/30' },
  { id: '2', name: 'Sarah Connor', email: 'sarah@tactix.demo', role: 'coach', initials: 'SC', color: 'bg-secondary-container/30 text-secondary border-secondary/30' },
  { id: '3', name: 'Michael Smith', email: 'michael@tactix.demo', role: 'player', initials: 'MS', color: 'bg-tertiary-container/30 text-tertiary border-tertiary/30' },
  { id: '4', name: 'Emma Wilson', email: 'emma@tactix.demo', role: 'player', initials: 'EW', color: 'bg-tertiary-container/30 text-tertiary border-tertiary/30' },
  { id: '5', name: 'James Brown', email: 'james@tactix.demo', role: 'coach', initials: 'JB', color: 'bg-secondary-container/30 text-secondary border-secondary/30' },
]

export default function RoleManagement() {
  const [users, setUsers] = useState(MOCK_USERS)
  const [search, setSearch] = useState('')

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  const handleRoleChange = (id, newRole) => {
    setUsers(prev => prev.map(u => {
      if (u.id === id) {
        let color = 'bg-tertiary-container/30 text-tertiary border-tertiary/30'
        if (newRole === 'admin') color = 'bg-primary/20 text-primary border-primary/30'
        if (newRole === 'coach') color = 'bg-secondary-container/30 text-secondary border-secondary/30'
        return { ...u, role: newRole, color }
      }
      return u
    }))
  }

  return (
    <div className="min-h-dvh bg-surface-container-lowest flex flex-col">
      <TopBar trailingIcon="person_add" />
      <main className="flex-1 w-full max-w-5xl mx-auto pt-20 pb-28 px-6 flex flex-col">
        <div className="py-8 flex flex-col gap-4">
          <div>
            <h1 className="text-headline-xl font-inter font-black text-on-surface tracking-tight">Role Management</h1>
            <p className="text-body-md font-lexend text-on-surface-variant mt-1">Assign and manage system access levels for all users.</p>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant z-10 pointer-events-none">search</span>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search users by name or email..."
              className="w-full bg-surface-container h-12 pl-12 pr-4 text-body-md font-lexend text-on-surface rounded-lg border-0 border-b-2 border-outline-variant focus:ring-0 focus:border-primary-container outline-none transition-colors placeholder:text-surface-bright"
            />
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {filteredUsers.length > 0 ? filteredUsers.map((u) => (
            <div key={u.id} className="bg-surface-container-low border border-surface-container rounded-xl p-4 flex items-center gap-4 hover:border-outline-variant/50 transition-colors group">
              <div className={`w-12 h-12 rounded-full border flex items-center justify-center font-inter font-bold shrink-0 ${u.color}`}>
                {u.initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-label-lg font-lexend font-bold text-on-surface truncate">{u.name}</p>
                <p className="text-label-sm font-lexend text-on-surface-variant truncate">{u.email}</p>
              </div>
              <div className="relative shrink-0">
                <select 
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                  className="appearance-none bg-surface-container border border-outline-variant/50 rounded-lg pl-3 pr-8 py-2 text-label-sm font-lexend font-bold uppercase tracking-widest text-on-surface outline-none focus:border-primary cursor-pointer hover:bg-surface-container-high transition-colors"
                >
                  <option value="admin">Admin</option>
                  <option value="coach">Coach</option>
                  <option value="player">Player</option>
                </select>
                <span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant pointer-events-none">expand_more</span>
              </div>
            </div>
          )) : (
            <div className="bg-surface-container border border-dashed border-outline-variant/50 rounded-xl p-12 text-center flex flex-col items-center">
              <span className="material-symbols-outlined text-surface-bright text-5xl mb-4">search_off</span>
              <p className="text-body-lg font-lexend font-bold text-on-surface">No users found</p>
              <p className="text-body-sm font-lexend text-on-surface-variant mt-1">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
