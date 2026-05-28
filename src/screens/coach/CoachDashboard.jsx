import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function CoachDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data } = useAppData()

  const handleQuickAction = (path) => {
    navigate(path)
  }

  const coachQuickActions = [
    ...(!user?.schoolId ? [{ label: 'Join School', icon: 'vpn_key', path: '/coach/enter-school-code', primary: true }] : []),
    { label: 'Mark Attendance', icon: 'how_to_reg', path: '/coach/attendance', primary: user?.schoolId ? true : false },
    { label: 'Add Feedback', icon: 'rate_review', path: '/coach/feedback', primary: false },
    { label: 'Assign Training', icon: 'fitness_center', path: '/coach/training', primary: false },
  ]


  const avgAttendance = useMemo(() => {
    if (!data?.players?.length) return 0
    const sum = data.players.reduce((acc, p) => acc + (p.attendanceStats?.percentage || 0), 0)
    return Math.round(sum / data.players.length)
  }, [data?.players])

  const needsAttentionCount = useMemo(() => {
    if (!data?.players) return 0
    return data.players.filter(p => (p.attendanceStats?.percentage || 0) < 75 || (p.performanceScore || 0) < 60).length
  }, [data?.players])

  const topPlayers = useMemo(() => {
    if (!data?.players || data.players.length === 0) return []
    return [...data.players]
      .sort((a, b) => (b.score || b.performanceScore || 0) - (a.score || a.performanceScore || 0))
      .slice(0, 5)
  }, [data?.players])

  const coachTeams = useMemo(() => {
    return data?.groups || []
  }, [data?.groups])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8 max-w-7xl mx-auto w-full">
        {/* Mobile Quick Actions (Sticky on Mobile) */}
        <div className="lg:hidden grid grid-cols-2 gap-3 mb-2">
          {coachQuickActions.slice(0, 4).map((a) => (
            <button
              key={a.label}
              onClick={() => handleQuickAction(a.path)}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl transition-all active:scale-95 border
                ${a.primary
                  ? 'bg-[#DC143C] border-[#DC143C]/20 text-on-surface shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                  : 'bg-on-surface/5 border-outline-variant/30 text-on-surface'
                }`}
            >
              <span className="material-symbols-outlined text-2xl">{a.icon}</span>
              <span className="text-[10px] font-black uppercase tracking-widest">{a.label.split(' ')[1] || a.label}</span>
            </button>
          ))}
        </div>

        {/* Header Section (Desktop) */}
        <div className="hidden lg:flex justify-between items-end gap-6">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight mb-2">
              Team Performance
            </h1>
            <p className="text-on-surface/50 text-sm">
              Welcome back, Coach {user?.name?.split(' ')[0] || 'Coach'}.
            </p>
          </div>
          <div className="flex gap-3">
            {coachQuickActions.map((a) => (
              <button
                key={a.label}
                onClick={() => handleQuickAction(a.path)}
                className={`flex items-center gap-2 px-6 h-12 rounded-xl transition-all hover:scale-105 active:scale-95 border
                  ${a.primary
                    ? 'bg-[#DC143C] border-[#DC143C]/20 text-on-surface font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)]'
                    : 'bg-on-surface/5 border-outline-variant/30 text-on-surface font-bold'
                  }`}
              >
                <span className="material-symbols-outlined text-[20px]">{a.icon}</span>
                <span className="text-sm">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Join School Prompt if missing */}
        {!user?.schoolId && (
          <div className="bg-[#DC143C]/10 border border-[#DC143C]/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 animate-pulse">
            <div>
              <h2 className="text-xl font-black text-on-surface uppercase tracking-tight flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DC143C]">warning</span>
                School Not Connected
              </h2>
              <p className="text-sm text-on-surface-variant font-lexend mt-1">
                You must join a school using a School Code to access your teams and players.
              </p>
            </div>
            <button
              onClick={() => navigate('/coach/enter-school-code')}
              className="whitespace-nowrap flex items-center gap-2 px-6 h-12 bg-[#DC143C] text-white rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(220,20,60,0.4)]"
            >
              <span className="material-symbols-outlined text-[18px]">vpn_key</span>
              Enter School Code
            </button>
          </div>
        )}

        {/* SECTION 1: Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          {/* Attendance Snapshot */}
          <div
            onClick={() => navigate('/attendance-snapshot')}
            className="bg-surface-container-low rounded-xl p-6 border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-[#FF1493]/10 flex items-center justify-center border border-[#FF1493]/20">
                <span className="material-symbols-outlined text-[#FF1493]">how_to_reg</span>
              </div>
              <span className="text-green-500 text-[10px] font-black uppercase tracking-widest bg-green-500/10 px-2 py-1 rounded-lg border border-green-500/20">
                Live Stats
              </span>
            </div>
            <div>
              <div className="font-label-lg text-label-lg text-on-surface-variant mb-1 uppercase tracking-[0.2em] text-[10px] font-black">Attendance Snapshot</div>
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">{avgAttendance}%</div>
              <p className="text-on-surface/30 text-[10px] font-medium mt-2">Avg. across all active squads</p>
            </div>
          </div>

          {/* Players Needing Attention */}
          <div
            onClick={() => navigate('/needs-attention')}
            className="bg-surface-container-low rounded-xl p-6 border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all cursor-pointer"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <span className="material-symbols-outlined text-red-500">priority_high</span>
              </div>
              <span className="text-red-500 text-[10px] font-black uppercase tracking-widest bg-red-500/10 px-2 py-1 rounded-lg border border-red-500/20">
                {needsAttentionCount > 0 ? `${needsAttentionCount} Needing Action` : 'All Healthy'}
              </span>
            </div>
            <div>
              <div className="font-label-lg text-label-lg text-on-surface-variant mb-1 uppercase tracking-[0.2em] text-[10px] font-black">Needs Attention</div>
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">{needsAttentionCount}</div>
              <p className="text-on-surface/30 text-[10px] font-medium mt-2">Players with low performance/attendance</p>
            </div>
          </div>

          {/* Team Alerts */}
          <div className="bg-surface-container-low rounded-xl p-6 border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all cursor-pointer" onClick={() => navigate('/team-alerts')}>
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <span className="material-symbols-outlined text-yellow-500">notification_important</span>
              </div>
              <div className="flex -space-x-2">
                {data?.alerts?.slice(0, 3).map((alert, i) => (
                  <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0A0A] bg-on-surface/10 flex items-center justify-center text-[10px] text-white">
                    !
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="font-label-lg text-label-lg text-on-surface-variant mb-1 uppercase tracking-[0.2em] text-[10px] font-black">Team Alerts</div>
              <div className="flex flex-col gap-1 mt-2">
                {data?.alerts?.length > 0 ? (
                  data.alerts.slice(0, 2).map((alert, idx) => (
                    <div key={idx} className={`flex items-center gap-2 text-[10px] font-bold ${alert.type === 'critical' ? 'text-red-400' : alert.type === 'warning' ? 'text-yellow-400' : 'text-blue-400'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${alert.type === 'critical' ? 'bg-red-400' : alert.type === 'warning' ? 'bg-yellow-400' : 'bg-blue-400'}`}></span>
                      {alert.message}
                    </div>
                  ))
                ) : (
                  <div className="text-on-surface/30 text-[10px] font-bold py-2">No active alerts</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: Top Players */}
        <div className="flex flex-col gap-4">
          <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2">
            <span className="material-symbols-outlined text-yellow-500 text-[20px]">star</span>
            Top Players
          </h3>
          <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
            {topPlayers.length > 0 ? topPlayers.map((p, idx) => (
              <div key={p.name || idx} className="min-w-[240px] bg-surface-container-low border border-white/5 rounded-2xl p-4 flex flex-col gap-3 group hover:border-primary/30 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-surface-container-high border-2 border-primary flex items-center justify-center font-bold text-on-surface text-lg">
                    {p.name?.charAt(0) || '?'}
                  </div>
                  <div>
                    <h4 className="text-on-surface font-lexend font-bold">{p.name || 'Athlete'}</h4>
                    <p className="text-on-surface/40 text-[10px] font-lexend uppercase tracking-wider">{p.role || p.sport || 'Player'}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  <div className="bg-[#111111] p-2 rounded-lg text-center border border-white/5">
                    <p className="text-[10px] text-on-surface/40 uppercase tracking-wider font-bold">Perf</p>
                    <p className="text-primary font-black text-sm">{p.score || p.performanceScore || 0}%</p>
                  </div>
                  <div className="bg-[#111111] p-2 rounded-lg text-center border border-white/5">
                    <p className="text-[10px] text-on-surface/40 uppercase tracking-wider font-bold">Att</p>
                    <p className="text-green-500 font-black text-sm">{p.att || p.attendanceStats?.percentage || 0}%</p>
                  </div>
                </div>
              </div>
            )) : (
              <div className="w-full py-12 text-center text-on-surface/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-2xl">
                No players added yet
              </div>
            )}
          </div>
        </div>

        {/* SECTION 3: Attendance Health & My Teams */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Attendance Health */}
          <div className="lg:col-span-1 bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col items-center justify-center">
            <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2 w-full justify-start mb-6">
              <span className="material-symbols-outlined text-[#FF1493] text-[20px]">health_and_safety</span>
              Attendance Health
            </h3>
            
            <div className="relative w-40 h-40 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="80" cy="80" r="64" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                <circle cx="80" cy="80" r="64" stroke="#FF1493" strokeWidth="12" fill="transparent"
                  strokeDasharray={2 * Math.PI * 64} strokeDashoffset={(2 * Math.PI * 64) - ((avgAttendance / 100) * 2 * Math.PI * 64)}
                  className="transition-all duration-1000 ease-out shadow-[0_0_15px_#FF1493]" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-black text-on-surface">{avgAttendance}%</span>
                <span className="text-[10px] text-[#FF1493] uppercase tracking-widest font-bold">Overall</span>
              </div>
            </div>
            
            <p className="text-on-surface/40 text-xs text-center mt-6">
              {avgAttendance > 75 
                ? `Attendance is looking healthy across your teams. ${needsAttentionCount} players require attention.`
                : `Attendance requires attention. ${needsAttentionCount} players are currently marked as at-risk.`}
            </p>
          </div>

          {/* My Teams */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DC143C] text-[20px]">groups</span>
                My Teams
              </h3>
              <button onClick={() => navigate('/coach/teams')} className="text-[#FF1493] text-xs font-bold hover:underline">View All</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {coachTeams.length > 0 ? coachTeams.map((t, idx) => (
                <div key={t.id || idx} onClick={() => navigate(`/coach/teams/${t.id}`)} className="bg-surface-container-low border border-white/5 rounded-2xl p-5 cursor-pointer hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-lexend font-bold text-on-surface group-hover:text-primary transition-colors">{t.name}</h4>
                      <p className="text-xs text-on-surface/40 font-lexend uppercase tracking-wider">{t.sport || 'Sport'}</p>
                    </div>
                    <div className="bg-[#111111] border border-outline-variant/30 px-3 py-1 rounded-lg">
                      <p className="text-[10px] text-on-surface/40 uppercase tracking-widest font-bold text-center">Players</p>
                      <p className="text-on-surface font-black text-center">{t.players || t.memberCount || 0}</p>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-xs mb-2 font-bold">
                      <span className="text-on-surface/50 uppercase tracking-widest">Performance</span>
                      <span className="text-[#DC143C]">{t.perf || t.avgScore || 0}%</span>
                    </div>
                    <div className="h-2 w-full bg-[#111111] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-blue-500 to-[#DC143C] rounded-full transition-all duration-1000" style={{ width: `${t.perf || t.avgScore || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              )) : (
                <div className="md:col-span-2 flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl gap-4">
                  <span className="material-symbols-outlined text-4xl text-on-surface/10">group_add</span>
                  <p className="text-on-surface/30 text-xs font-black uppercase tracking-widest text-center">No teams assigned yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
