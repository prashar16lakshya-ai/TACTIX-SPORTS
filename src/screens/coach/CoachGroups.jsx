import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'
import { collection, query, onSnapshot, where, doc, deleteDoc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

export default function CoachGroups() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [groups, setGroups] = useState([])
  const [allPlayers, setAllPlayers] = useState([])
  const [selectedGroup, setSelectedGroup] = useState(null)
  const [showLeaderModal, setShowLeaderModal] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState(null)
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(true)

  // Fetch real data
  useEffect(() => {
    // Fetch Teams
    const qTeams = query(collection(db, 'teams'), where('coachId', '==', user.uid))
    const unsubTeams = onSnapshot(qTeams, (snapshot) => {
      const teamList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setGroups(teamList)
      setLoading(false)
    })

    // Fetch Players (either all or specific to coach)
    const qPlayers = query(collection(db, 'users'), where('role', 'in', ['player', 'student']))
    const unsubPlayers = onSnapshot(qPlayers, (snapshot) => {
      const playerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setAllPlayers(playerList)
    })

    return () => { unsubTeams(); unsubPlayers() }
  }, [user.uid])

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  const getGroupPlayers = (groupId) =>
    allPlayers.filter(p => p.teamId === groupId || p.groupId === groupId)

  const handleAssignLeader = (group) => {
    setSelectedGroup(group)
    setShowLeaderModal(true)
  }

  const confirmLeader = async (player) => {
    try {
      await updateDoc(doc(db, 'teams', selectedGroup.id), {
        leaderId: player.id,
        leaderName: player.name
      })
      setShowLeaderModal(false)
      showToast(`${player.name} assigned as Group Leader for ${selectedGroup.name}`)
    } catch (err) {
      console.error('Error assigning leader:', err)
      showToast('Failed to assign leader', 'error')
    }
  }

  const removeLeader = async (groupId) => {
    try {
      await updateDoc(doc(db, 'teams', groupId), {
        leaderId: null,
        leaderName: null
      })
      showToast('Group Leader removed', 'info')
    } catch (err) {
      console.error('Error removing leader:', err)
      showToast('Failed to remove leader', 'error')
    }
  }

  const handleDeletePlayer = async (playerId, playerName) => {
    if (window.confirm(`Are you sure you want to remove ${playerName}? This action cannot be undone.`)) {
      try {
        await deleteDoc(doc(db, 'users', playerId))
        showToast(`${playerName} removed successfully`)
      } catch (err) {
        console.error('Error deleting player:', err)
        showToast('Failed to delete player', 'error')
      }
    }
  }

  const SPORT_COLORS = {
    Cricket: '#0cca75',
    Athletics: '#f59e0b',
    Badminton: '#8b5cf6',
    Football: '#3b82f6',
  }

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col pb-24 pt-20">
      <TopBar title="Groups" trailingIcon="upload_file" trailingPath="/bulk-import" />

      {/* Toast */}
      {toast && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl font-bold text-sm shadow-lg ${
          toast.type === 'success' ? 'bg-[#0cca75] text-black' : 'bg-surface-container text-on-surface border border-outline-variant'
        }`}>
          {toast.msg}
        </div>
      )}

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 md:px-8 flex flex-col gap-6">
        {/* Header */}
        <div className="flex items-center justify-between mt-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-on-surface">Performance Groups</h1>
            <p className="text-on-surface-variant text-sm mt-1">Manage groups and assign leaders to sub-sections</p>
          </div>
          <button
            onClick={() => navigate('/bulk-import')}
            className="flex items-center gap-2 px-4 py-2 bg-[#0cca75] text-black font-bold rounded-xl text-sm hover:brightness-110 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            Bulk Import
          </button>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Total Groups', value: groups.length, icon: 'folder_special', color: 'text-[#0cca75]' },
            { label: 'Total Players', value: allPlayers.length, icon: 'groups', color: 'text-blue-400' },
            { label: 'Leaders Active', value: groups.filter(g => g.leaderId).length, icon: 'star', color: 'text-yellow-400' },
          ].map(s => (
            <div key={s.label} className="bg-surface-container rounded-xl p-4 border border-outline-variant/30 flex flex-col gap-1">
              <span className={`material-symbols-outlined ${s.color} text-xl`} style={{ fontVariationSettings: "'FILL' 1" }}>{s.icon}</span>
              <span className="text-2xl font-black text-on-surface">{s.value}</span>
              <span className="text-[11px] text-on-surface-variant uppercase tracking-wider font-bold">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Groups Cards */}
        <div className="flex flex-col gap-4">
          {groups.map(group => {
            const members = getGroupPlayers(group.id)
            const isExpanded = expandedGroup === group.id
            const accentColor = SPORT_COLORS[group.sport] || '#0cca75'

            return (
              <div
                key={group.id}
                className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden"
                style={{ borderLeft: `3px solid ${accentColor}` }}
              >
                {/* Card Header */}
                <div className="p-5 flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${accentColor}20` }}>
                      <span className="material-symbols-outlined" style={{ color: accentColor, fontVariationSettings: "'FILL' 1" }}>
                        {group.sportIcon || 'sports'}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="font-black text-on-surface text-lg">{group.name}</h2>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full" style={{ background: `${accentColor}20`, color: accentColor }}>
                          {group.sport}
                        </span>
                      </div>
                      <p className="text-on-surface-variant text-xs mt-0.5">{group.description}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setExpandedGroup(isExpanded ? null : group.id)}
                    className="text-on-surface-variant hover:text-primary transition-colors mt-1"
                  >
                    <span className="material-symbols-outlined">{isExpanded ? 'expand_less' : 'expand_more'}</span>
                  </button>
                </div>

                {/* Leader + Stats Row */}
                <div className="px-5 pb-4 flex flex-wrap gap-3 items-center">
                  {/* Group Leader Badge */}
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-xl px-3 py-2 border border-outline-variant/20 flex-1 min-w-0">
                    <span className="material-symbols-outlined text-yellow-400 text-base" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wider">Group Leader</p>
                      <p className="text-on-surface font-bold text-sm truncate">{group.leaderName || 'Not Assigned'}</p>
                    </div>
                    <button
                      onClick={() => handleAssignLeader(group)}
                      className="text-[11px] font-black text-[#0cca75] hover:underline whitespace-nowrap ml-2"
                    >
                      {group.leaderName ? 'Change' : 'Assign'}
                    </button>
                    {group.leaderName && (
                      <button
                        onClick={() => removeLeader(group.id)}
                        className="text-[11px] font-black text-error hover:underline ml-1"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  {/* Player Count */}
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-xl px-3 py-2 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-blue-400 text-base">groups</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wider">Players</p>
                      <p className="text-on-surface font-bold text-sm">{members.length}</p>
                    </div>
                  </div>

                  {/* Coach */}
                  <div className="flex items-center gap-2 bg-surface-container-high rounded-xl px-3 py-2 border border-outline-variant/20">
                    <span className="material-symbols-outlined text-[#0cca75] text-base">sports</span>
                    <div>
                      <p className="text-[10px] text-on-surface-variant uppercase font-black tracking-wider">Coach</p>
                      <p className="text-on-surface font-bold text-sm">{group.coachName || 'You'}</p>
                    </div>
                  </div>
                </div>

                {/* Expanded Player Table */}
                {isExpanded && (
                  <div className="border-t border-outline-variant/20 overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-surface-container-high text-on-surface-variant uppercase text-[10px] tracking-widest">
                        <tr>
                          <th className="px-5 py-3 text-left font-black">Player</th>
                          <th className="px-4 py-3 text-left font-black">Class</th>
                          <th className="px-4 py-3 text-left font-black">Role</th>
                          <th className="px-4 py-3 text-left font-black">Status</th>
                          <th className="px-4 py-3 text-right font-black">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-outline-variant/10">
                        {members.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-on-surface-variant">No players in this group</td>
                          </tr>
                        ) : members.map(p => (
                          <tr key={p.id} className="hover:bg-surface-container-high/50 transition-colors">
                            <td className="px-5 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black bg-[#0cca75]/20 text-[#0cca75]">
                                  {p.name.charAt(0)}
                                </div>
                                <span className="text-on-surface font-bold">{p.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-on-surface-variant">{p.class || 'N/A'}</td>
                            <td className="px-4 py-3">
                              {p.isLeader || (group.leaderId === p.id) ? (
                                <span className="flex items-center gap-1 text-yellow-400 font-bold text-xs">
                                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                                  Leader
                                </span>
                              ) : (
                                <span className="text-on-surface-variant text-xs">Player</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                                p.status === 'active' ? 'bg-[#0cca75]/20 text-[#0cca75]' :
                                p.status === 'injured' ? 'bg-error/20 text-error' :
                                'bg-yellow-500/20 text-yellow-400'
                              }`}>
                                {p.status || 'active'}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-right">
                              <button
                                onClick={() => handleDeletePlayer(p.id, p.name)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-error hover:bg-error/10 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[18px]">delete</span>
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* Leader Assignment Modal */}
      {showLeaderModal && selectedGroup && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowLeaderModal(false)}>
          <div className="bg-[#111] border border-outline-variant/30 rounded-t-3xl md:rounded-2xl p-6 w-full max-w-md shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-on-surface font-black text-lg">Assign Group Leader</h3>
                <p className="text-on-surface-variant text-sm">{selectedGroup.name}</p>
              </div>
              <button onClick={() => setShowLeaderModal(false)} className="text-on-surface-variant hover:text-primary">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <p className="text-on-surface-variant text-xs mb-4 uppercase font-black tracking-wider">Select a player to lead this group</p>
            <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
              {getGroupPlayers(selectedGroup.id).map(p => (
                <button
                  key={p.id}
                  onClick={() => confirmLeader(p)}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                    selectedGroup.leaderId === p.id
                      ? 'border-[#0cca75] bg-[#0cca75]/10'
                      : 'border-outline-variant/20 hover:border-[#0cca75]/50 hover:bg-surface-container-high'
                  }`}
                >
                  <div className="w-9 h-9 rounded-full bg-[#0cca75]/20 text-[#0cca75] flex items-center justify-center font-black text-sm">
                    {p.avatar}
                  </div>
                  <div className="flex-1">
                    <p className="text-on-surface font-bold text-sm">{p.name}</p>
                    <p className="text-on-surface-variant text-xs">{p.class} · {p.sport}</p>
                  </div>
                  {selectedGroup.leaderId === p.id && (
                    <span className="material-symbols-outlined text-[#0cca75] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  )
}
