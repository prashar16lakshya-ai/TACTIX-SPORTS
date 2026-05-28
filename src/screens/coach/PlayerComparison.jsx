import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'

export default function PlayerComparison() {
  const { data } = useAppData()
  const { user } = useAuth()
  const players = useMemo(() => {
    return (data?.players || []).map(p => ({
      id: p.id,
      name: p.name || 'Unknown',
      role: p.position || 'Player',
      team: p.team || 'No Team',
      level: p.level || 'Standard',
      img: p.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'U')}&background=random`,
      stats: {
        perf: p.performanceScore || 0,
        matches: p.matchesPlayed || 0,
        wins: p.wins || 0,
        rate: p.winRate || '0%',
        announcements: p.announcements || 0
      }
    }))
  }, [data?.players])

  const [p1Idx, setP1Idx] = useState(0)
  const [p2Idx, setP2Idx] = useState(players.length > 1 ? 1 : 0)

  const p1 = players[p1Idx]
  const p2 = players[p2Idx]

  const stats = useMemo(() => {
    if (!p1 || !p2) return []
    return [
      { label: 'Performance Score', v1: p1.stats.perf, v2: p2.stats.perf, icon: 'trending_up', color: 'text-green-500' },
      { label: 'Matches Played', v1: p1.stats.matches, v2: p2.stats.matches, icon: 'sports_soccer', color: 'text-green-500' },
      { label: 'Wins', v1: p1.stats.wins, v2: p2.stats.wins, icon: 'emoji_events', color: 'text-green-500' },
      { label: 'Win Rate', v1: p1.stats.rate, v2: p2.stats.rate, icon: 'speed', color: 'text-green-500' },
      { label: 'Announcements', v1: p1.stats.announcements, v2: p2.stats.announcements, icon: 'campaign', color: 'text-green-500' },
    ]
  }, [p1, p2])

  if (players.length === 0) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-24 text-on-surface/40">
          <span className="material-symbols-outlined text-6xl mb-4">compare_arrows</span>
          <p>No players available for comparison.</p>
        </div>
      </DashboardLayout>
    )
  }



  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <h1 className="text-xl font-bold text-on-surface">Compare Players</h1>
          </div>
          <button className="text-on-surface/50 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">info</span>
          </button>
        </div>

        {/* Player Selectors & Cards */}
        <div className="grid grid-cols-2 gap-4 md:gap-8 mb-8 relative">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0A0A0A] border border-outline-variant/30 flex items-center justify-center text-on-surface/50 font-bold z-10 text-sm">
            VS
          </div>

          {/* Player 1 */}
          <div className="space-y-4">
            <select 
              value={p1Idx}
              onChange={(e) => setP1Idx(Number(e.target.value))}
              className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl p-3 text-on-surface font-bold text-sm outline-none focus:border-primary"
            >
              {players.map((p, i) => <option key={p.id} value={i} className="bg-[#0A0A0A]">{p.name}</option>)}
            </select>

            {p1 && (
              <div className="bg-gradient-to-b from-[#0A0A0A] to-green-500/10 border border-green-500/30 rounded-2xl overflow-hidden relative group">
                <div className="h-48 md:h-64 relative">
                  <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity group-hover:opacity-80 transition-opacity" style={{ backgroundImage: `url(${p1.img})` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                    <h2 className="text-xl md:text-2xl font-bold text-on-surface">{p1.name}</h2>
                    <p className="text-green-500 text-sm mb-1">{p1.role}</p>
                    <p className="text-green-500 text-xs mb-3">{p1.team}</p>
                    <span className="inline-block border border-[#FF1493] text-[#FF1493] px-3 py-1 rounded-lg text-xs font-bold bg-[#FF1493]/10">{p1.level}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Player 2 */}
          <div className="space-y-4">
            <select 
              value={p2Idx}
              onChange={(e) => setP2Idx(Number(e.target.value))}
              className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl p-3 text-on-surface font-bold text-sm outline-none focus:border-[#FF1493]"
            >
              {players.map((p, i) => <option key={p.id} value={i} className="bg-[#0A0A0A]">{p.name}</option>)}
            </select>

            {p2 && (
              <div className="bg-gradient-to-b from-[#0A0A0A] to-[#FF1493]/10 border border-[#FF1493]/30 rounded-2xl overflow-hidden relative group">
                <div className="h-48 md:h-64 relative">
                  <div className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-luminosity group-hover:opacity-80 transition-opacity" style={{ backgroundImage: `url(${p2.img})` }}></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-[#0A0A0A]/50 to-transparent"></div>

                  <div className="absolute bottom-0 left-0 p-4 md:p-6 w-full">
                    <h2 className="text-xl md:text-2xl font-bold text-on-surface">{p2.name}</h2>
                    <p className="text-[#FF1493] text-sm mb-1">{p2.role}</p>
                    <p className="text-[#FF1493] text-xs mb-3">{p2.team}</p>
                    <span className="inline-block border border-[#FF1493] text-[#FF1493] px-3 py-1 rounded-lg text-xs font-bold bg-[#FF1493]/10">{p2.level}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats Comparison */}
        <div className="space-y-3 mb-8">
          {stats.map((stat, i) => (
            <div key={i} className="bg-on-surface/5 border border-outline-variant/30 rounded-xl p-4 flex items-center justify-between">
              <div className="flex-1 flex justify-center items-center gap-2">
                <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
                <span className={`font-bold text-lg md:text-xl ${stat.v1 >= stat.v2 ? stat.color : 'text-on-surface/50'}`}>{stat.v1}</span>
              </div>

              <div className="flex-1 text-center">
                <p className="text-on-surface/60 text-[10px] md:text-xs uppercase tracking-wider">{stat.label}</p>
              </div>

              <div className="flex-1 flex justify-center items-center gap-2">
                <span className={`font-bold text-lg md:text-xl ${stat.v2 > stat.v1 ? 'text-[#FF1493]' : 'text-on-surface/50'}`}>{stat.v2}</span>
              </div>
            </div>
          ))}
        </div>


      </div>
    </DashboardLayout>
  )
}
