import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'

const SCOPES = [
  { key: 'team', label: 'Team', subtitle: 'My Team Rankings' },
  { key: 'school', label: 'School', subtitle: 'School vs School' },
  { key: 'national', label: 'National', subtitle: 'National Rankings' },
  { key: 'global', label: 'Global', subtitle: 'Global Rankings' },
]

const RANK_COLORS = {
  1: { border: 'border-[#FFD700]', shadow: 'shadow-[0_0_20px_rgba(255,215,0,0.4)]', bg: 'bg-[#FFD700]', text: 'text-[#FFD700]', glow: 'rgba(255,215,0,0.25)' },
  2: { border: 'border-[#C0C0C0]', shadow: 'shadow-[0_0_15px_rgba(192,192,192,0.3)]', bg: 'bg-[#C0C0C0]', text: 'text-[#C0C0C0]', glow: 'rgba(192,192,192,0.15)' },
  3: { border: 'border-[#CD7F32]', shadow: 'shadow-[0_0_15px_rgba(205,127,50,0.3)]', bg: 'bg-[#CD7F32]', text: 'text-[#CD7F32]', glow: 'rgba(205,127,50,0.15)' },
}

function PodiumCard({ player, rank, isCenter }) {
  const colors = RANK_COLORS[rank]
  const size = isCenter ? 'w-24 h-24' : 'w-18 h-18'
  const nameSize = isCenter ? 'text-base font-black' : 'text-sm font-bold'
  const scoreSize = isCenter ? 'text-lg font-black' : 'text-sm font-bold'

  return (
    <div className={`flex flex-col items-center gap-3 ${isCenter ? '-translate-y-6' : ''}`}>
      {isCenter && (
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-1">👑</span>
        </div>
      )}
      <div className="relative">
        <div className={`${isCenter ? 'w-24 h-24' : 'w-[72px] h-[72px]'} rounded-full border-[3px] ${colors.border} ${colors.shadow} overflow-hidden bg-on-surface/10 relative`}>
          <img src={player.avatar} alt={player.name} className="w-full h-full object-cover" />
          {/* Rank badge */}
          <div className={`absolute -bottom-1 -right-1 w-7 h-7 ${colors.bg} rounded-full flex items-center justify-center border-2 border-[#0D0D1A] shadow-lg`}>
            <span className="text-[#0D0D1A] font-black text-xs">{rank}</span>
          </div>
        </div>
      </div>
      <div className="text-center">
        <p className={`text-on-surface ${nameSize} leading-tight max-w-[90px] truncate`}>{player.name}</p>
        <p className={`${colors.text} ${scoreSize} mt-0.5`}>{player.score.toLocaleString()}</p>
        {player.city && <p className="text-on-surface/30 text-[10px] mt-0.5">{player.city}</p>}
        {!player.city && player.group && <p className="text-on-surface/30 text-[10px] mt-0.5">{player.group}</p>}
      </div>
    </div>
  )
}

export default function LeaderboardModule() {
  const { data } = useAppData()
  const { user } = useAuth()
  const [scope, setScope] = useState('team')
  const [search, setSearch] = useState('')

  const filteredPlayers = useMemo(() => {
    let list = data?.players || []
    
    // Sort
    list = [...list].sort((a, b) => (b.score || b.performanceScore || 0) - (a.score || a.performanceScore || 0))
    
    return list
  }, [data?.players, scope])

  const getScopedData = () => {
    if (scope === 'team') {
      return (data.players || [])
        .map(p => ({
          id: p.id,
          name: p.name || 'Unknown',
          group: p.team || p.groupName || 'No Team',
          score: p.performanceScore || p.score || 0,
          trend: 'up',
          avatar: p.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(p.name || 'U')}&background=random`,
          sport: p.sport || ''
        }))
        .sort((a, b) => b.score - a.score)
    }
    
    // For other scopes in real mode, show empty for now
    return []
  }

  const currentData = getScopedData()
  const currentScope = SCOPES.find(s => s.key === scope)

  const filtered = currentData.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  // Podium: show rank 2, 1, 3 in that visual order
  const top3 = currentData.slice(0, 3)
  const visualPodium = [top3[1], top3[0], top3[2]].filter(Boolean)

  const rankList = search
    ? filtered
    : currentData.slice(3)

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen">

        {/* ── Hero Section ──────────────────────────────────────────── */}
        <div
          className="relative rounded-3xl overflow-hidden mb-8 pt-8 pb-20 px-6"
          style={{ background: 'linear-gradient(135deg, #1A0533 0%, #2D0B6B 50%, #1A1A3E 100%)' }}
        >
          {/* Decorative orbs */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#FF1493]/20 blur-[80px] rounded-full pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Title */}
          <div className="relative text-center mb-8">
            <h1 className="text-3xl font-black text-on-surface tracking-tight">Leaderboard</h1>
            <p className="text-on-surface/40 text-sm mt-1">Real-time Player Rankings</p>
          </div>

          {/* ── Scope Tabs ── */}
          <div className="relative flex justify-center mb-10">
            <div className="flex gap-1 bg-on-surface/10 backdrop-blur-md rounded-2xl p-1 border border-outline-variant/30">
              {SCOPES.map(s => (
                <button
                  key={s.key}
                  onClick={() => { setScope(s.key); setSearch('') }}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300 ${scope === s.key
                    ? 'bg-[#FF1493] text-on-surface shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                    : 'text-on-surface/50 hover:text-primary'
                    }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* ── Podium (only when no search) ── */}
          {!search && top3.length > 0 ? (
            <div className="relative flex items-end justify-center gap-6 pb-4">
              {top3.length >= 2 && <PodiumCard player={top3[1]} rank={2} isCenter={false} />}
              {top3.length >= 1 && <PodiumCard player={top3[0]} rank={1} isCenter={true} />}
              {top3.length >= 3 && <PodiumCard player={top3[2]} rank={3} isCenter={false} />}
            </div>
          ) : !search && (
            <div className="py-12 text-center text-on-surface/20 uppercase text-[10px] font-black tracking-widest">
              Awaiting Rankings
            </div>
          )}

          {/* Podium floor bars */}
          {!search && top3.length > 0 && (
            <div className="relative flex items-end justify-center gap-6 px-4 mt-2">
              <div className="flex-1 h-10 rounded-t-xl bg-on-surface/10 border border-outline-variant/30 backdrop-blur flex items-center justify-center">
                <span className="text-on-surface/40 text-xs font-bold">2ND</span>
              </div>
              <div className="flex-1 h-14 rounded-t-xl bg-[#FF1493]/20 border border-[#FF1493]/30 backdrop-blur flex items-center justify-center">
                <span className="text-[#FF1493] text-xs font-bold">1ST</span>
              </div>
              <div className="flex-1 h-8 rounded-t-xl bg-on-surface/10 border border-outline-variant/30 backdrop-blur flex items-center justify-center">
                <span className="text-on-surface/40 text-xs font-bold">3RD</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Search ─────────────────────────────────────────────────── */}
        <div className="mb-6 relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface/30 text-[20px]">search</span>
          <input
            type="text"
            placeholder={`Search ${scope === 'school' ? 'schools' : 'players'}...`}
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-2xl pl-11 pr-4 py-3.5 text-on-surface text-sm placeholder:text-on-surface/30 focus:outline-none focus:border-[#FF1493]/50 transition-colors"
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface/30 hover:text-primary">
              <span className="material-symbols-outlined text-[20px]">close</span>
            </button>
          )}
        </div>

        {/* ── Ranked List ────────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 pb-10">
          {/* Section label */}
          <div className="flex items-center justify-between mb-2 px-1">
            <p className="text-on-surface/40 text-xs uppercase tracking-widest font-bold">
              {search ? `Results for "${search}"` : 'Rankings'}
            </p>
            <p className="text-on-surface/20 text-xs">{rankList.length} entries</p>
          </div>

          {rankList.length === 0 && (!top3.length || search) && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="material-symbols-outlined text-on-surface/10 text-6xl mb-4">leaderboard</span>
              <p className="text-on-surface/30 text-sm">No results found.</p>
            </div>
          )}

          {rankList.map((item, idx) => {
            const globalRank = search ? currentData.findIndex(a => a.id === item.id) + 1 : idx + 4
            const isTop = globalRank <= 3
            const rankColor = globalRank === 1 ? 'text-[#FFD700]' : globalRank === 2 ? 'text-[#C0C0C0]' : globalRank === 3 ? 'text-[#CD7F32]' : 'text-on-surface/40'

            return (
              <div
                key={item.id}
                className="group flex items-center gap-4 bg-on-surface/5 hover:bg-on-surface/10 border border-white/5 hover:border-[#FF1493]/20 rounded-2xl p-4 transition-all duration-200 cursor-default"
              >
                {/* Rank number */}
                <div className={`w-8 text-center font-black text-sm flex-shrink-0 ${rankColor}`}>
                  {globalRank}
                </div>

                {/* Avatar */}
                <div className={`w-12 h-12 rounded-xl overflow-hidden border ${isTop ? 'border-[#FF1493]/40' : 'border-outline-variant/30'} flex-shrink-0`}>
                  <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-on-surface text-sm font-bold truncate">{item.name}</p>
                    <span className="text-base leading-none">{item.badge}</span>
                  </div>
                  <p className="text-on-surface/40 text-xs mt-0.5 truncate">
                    {item.group || item.city || item.sport}
                    {item.sport && item.group ? ` · ${item.sport}` : ''}
                  </p>
                </div>

                {/* Score + Trend */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-on-surface font-black text-base tabular-nums">
                    {item.score.toLocaleString()}
                  </span>
                  <div className={`flex items-center justify-center w-6 h-6 rounded-full ${item.trend === 'up' ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                    <span className={`material-symbols-outlined text-[18px] ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                      {item.trend === 'up' ? 'arrow_drop_up' : 'arrow_drop_down'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Footer */}
        <div className="text-center pb-6">
          <p className="text-on-surface/20 text-[11px] font-medium">
            Scores based on performance, matches, attendance & achievements
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}
