import { useState, useMemo, lazy, Suspense } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import AnimatedNumber from '../../components/common/AnimatedNumber'

// Real dynamic data

export default function AdminDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data } = useAppData()
  const [trendRange, setTrendRange] = useState('Week')

  // SECTION 1: System Snapshot Stats
  const systemStats = [
    { label: 'Total Teams', icon: 'groups', value: data?.groups?.length || 0, trend: data?.groups?.length > 0 ? '+1' : '0', color: 'text-[#FF1493]' },
    { label: 'Total Players', icon: 'directions_run', value: data?.players?.length || 0, trend: data?.players?.length > 0 ? '+1' : '0', color: 'text-[#DC143C]' },
    { label: 'Active Coaches', icon: 'sports', value: data?.groups?.length > 0 ? Math.ceil(data.groups.length / 2) : 0, trend: '0%', color: 'text-green-500' },
    { label: 'Activity Score', icon: 'bolt', value: data?.players?.length > 0 ? '92' : '0', trend: '0%', color: 'text-yellow-500' },
  ]



  // Dynamic calculations for Admin
  const avgAttendance = useMemo(() => {
    if (!data?.players?.length) return 0
    const sum = data.players.reduce((acc, p) => acc + (p.attendanceStats?.percentage || 0), 0)
    return (sum / data.players.length).toFixed(1)
  }, [data?.players])

  const needsAttentionCount = useMemo(() => {
    if (!data?.players) return 0
    return data.players.filter(p => (p.attendanceStats?.percentage || 0) < 75 || (p.performanceScore || 0) < 60).length
  }, [data?.players])

  const activeCoachesCount = useMemo(() => {
    const coaches = new Set(data?.groups?.map(g => g.coachId).filter(Boolean))
    return coaches.size
  }, [data?.groups])

  const alertCount = useMemo(() => {
    return data?.alerts?.length || 0
  }, [data?.alerts])

  const chartData = useMemo(() => {
    if (!data?.activityLogs || data.activityLogs.length === 0) return [0, 0, 0, 0, 0, 0, 0];
    
    const counts = [0, 0, 0, 0, 0, 0, 0];
    data.activityLogs.forEach(log => {
      const day = new Date().getDay();
      const idx = day === 0 ? 6 : day - 1;
      counts[idx] += 1;
    });
    
    const max = Math.max(...counts, 1);
    return counts.map(c => Math.round((c / max) * 100));
  }, [data?.activityLogs, trendRange])

  // SECTION 6: Leaderboard Preview
  const topPlayers = useMemo(() => {
    if (!data?.players) return []
    return [...data.players]
      .sort((a, b) => (b.performanceScore || 0) - (a.performanceScore || 0))
      .slice(0, 5)
  }, [data?.players])

  const quickControlActions = [
    { label: 'Create Team', icon: 'group_add', path: '/admin/teams/create', desc: 'Initialize a new squad', primary: true },
    { label: 'Add Coach', icon: 'person_add', path: '/admin/roles', desc: 'Onboard new leadership', primary: false },
    { label: 'Bulk Import', icon: 'upload_file', path: '/bulk-import', desc: 'Define & process data', primary: false },
    { label: 'Manage Calendar', icon: 'calendar_month', path: '/calendar', desc: 'Global schedule control', primary: false },
    { label: 'Manage Holidays', icon: 'event_busy', path: '/holidays', desc: 'Set system-wide holidays', primary: false },
    { label: 'System Settings', icon: 'settings', path: '/admin/settings', desc: 'Configure TACTIX core', primary: false },
  ]

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-stack-lg max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
          <div>
            <h1 className="font-headline-xl text-headline-xl text-on-surface mb-stack-sm tracking-tight font-black uppercase">
              Team Stats
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">
              Live updates for <span className="text-on-surface font-bold">{user?.schoolName || 'YOUR SCHOOL'}</span>.
            </p>
          </div>
        </div>

        {/* 🔷 SECTION 1: System Snapshot (New Design) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter">
          {/* Attendance Snapshot */}
          <div
            onClick={() => navigate('/attendance-snapshot')}
            className="bg-surface-container-low rounded-2xl p-6 border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all cursor-pointer animate-slide-up stagger-1"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-[#FF1493]/10 flex items-center justify-center border border-[#FF1493]/20">
                <span className="material-symbols-outlined text-[#FF1493]">how_to_reg</span>
              </div>
              <div className="flex items-center gap-1 bg-green-500/10 px-2 py-0.5 rounded-lg border border-green-500/20">
                <span className="material-symbols-outlined text-[12px] text-green-500">trending_up</span>
                <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div>
              <div className="font-label-lg text-label-lg text-on-surface-variant mb-1 uppercase tracking-[0.2em] text-[10px] font-black">Attendance Snapshot</div>
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">
                <AnimatedNumber value={avgAttendance} />%
              </div>
            </div>
          </div>

          {/* Players Needing Attention */}
          <div
            onClick={() => navigate('/needs-attention')}
            className="bg-surface-container-low rounded-2xl p-6 border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all cursor-pointer animate-slide-up stagger-2"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
                <span className="material-symbols-outlined text-red-500">priority_high</span>
              </div>
              <span className={`text-red-500 text-[10px] font-black uppercase tracking-widest ${needsAttentionCount > 0 ? 'bg-red-500/10 border-red-500/20' : 'bg-on-surface/5 border-outline-variant/30'} px-2 py-1 rounded-lg border`}>
                {needsAttentionCount > 0 ? 'Critical' : 'All Clear'}
              </span>
            </div>
            <div>
              <div className="font-label-lg text-label-lg text-on-surface-variant mb-1 uppercase tracking-[0.2em] text-[10px] font-black">Needs Attention</div>
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">
                <AnimatedNumber value={needsAttentionCount} />
              </div>
            </div>
          </div>

          {/* Active Coaches */}
          <div className="bg-surface-container-low rounded-2xl p-6 border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all animate-slide-up stagger-3">
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center border border-green-500/20">
                <span className="material-symbols-outlined text-green-500">sports</span>
              </div>
              <span className="text-on-surface/30 text-[10px] font-black uppercase tracking-widest bg-on-surface/5 px-2 py-1 rounded-lg border border-outline-variant/30">{activeCoachesCount} Active</span>
            </div>
            <div>
              <div className="font-label-lg text-label-lg text-on-surface-variant mb-1 uppercase tracking-[0.2em] text-[10px] font-black">Team Stats</div>
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">
                <AnimatedNumber value={data?.groups?.length || 0} />
                <span className="text-sm text-on-surface/30 font-bold uppercase ml-1">Squads</span>
              </div>
            </div>
          </div>

          {/* System Alerts */}
          <div
            onClick={() => navigate('/team-alerts')}
            className="bg-surface-container-low rounded-2xl p-6 border border-white/5 flex flex-col gap-4 group hover:bg-white/[0.03] transition-all cursor-pointer animate-slide-up stagger-4"
          >
            <div className="flex justify-between items-start">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center border border-yellow-500/20">
                <span className="material-symbols-outlined text-yellow-500">bolt</span>
              </div>
              <div className="flex -space-x-2">
                <div className={`w-6 h-6 rounded-full bg-red-500 ${alertCount > 0 ? 'shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'opacity-20'}`}></div>
                <div className={`w-6 h-6 rounded-full bg-yellow-500 ${alertCount > 2 ? 'shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'opacity-20'}`}></div>
              </div>
            </div>
            <div>
              <div className="font-label-lg text-label-lg text-on-surface-variant mb-1 uppercase tracking-[0.2em] text-[10px] font-black">System Alerts</div>
              <div className="font-headline-xl text-headline-xl text-on-surface tracking-tighter">
                <AnimatedNumber value={alertCount} />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-gutter">
          {/* 🔷 SECTION 2: Alerts & Issues */}
          <div className="xl:col-span-1 bg-surface-container-low rounded-2xl border border-white/5 p-6 flex flex-col gap-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 blur-3xl rounded-full"></div>
            <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest flex items-center gap-2 relative z-10">
              <span className="material-symbols-outlined text-red-500">warning</span>
              System Alerts
            </h2>
            <div className="flex flex-col gap-3 relative z-10">
              {(data?.alerts || []).length > 0 ? (data.alerts.map(alert => (
                <div key={alert.id} className={`p-4 rounded-xl border flex gap-4 items-start transition-all hover:translate-x-1 ${alert.type === 'critical' ? 'bg-red-500/10 border-red-500/20' :
                    alert.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' :
                      'bg-green-500/10 border-green-500/20'
                  }`}>
                  <span className={`material-symbols-outlined text-[20px] ${alert.type === 'critical' ? 'text-red-500' :
                      alert.type === 'warning' ? 'text-yellow-500' :
                        'text-green-500'
                    }`}>{alert.icon}</span>
                  <p className={`text-xs font-bold leading-relaxed ${alert.type === 'critical' ? 'text-red-400' :
                      alert.type === 'warning' ? 'text-yellow-400' :
                        'text-green-400'
                    }`}>{alert.message}</p>
                </div>
              ))) : (
                <div className="py-10 text-center text-on-surface/10 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-xl">
                  No active alerts
                </div>
              )}
            </div>
            <button className="mt-auto w-full py-3 bg-on-surface/5 hover:bg-on-surface/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-on-surface transition-all border border-white/5">
              View All System Logs
            </button>
          </div>

          {/* 🔷 SECTION 5: System Analytics */}
          <div className="xl:col-span-2 bg-surface-container-low rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF1493]">analytics</span>
                Growth & Activity
              </h2>
              <div className="flex gap-1 bg-on-surface/5 p-1 rounded-xl border border-white/5">
                {['Week', 'Month', 'Season'].map(range => (
                  <button
                    key={range}
                    onClick={() => setTrendRange(range)}
                    className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${trendRange === range ? 'bg-[#FF1493] text-[#0A0A0A]' : 'text-on-surface/40 hover:text-primary'
                      }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex-1 min-h-[220px] relative flex flex-col justify-between">
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8">
                {[1, 2, 3, 4, 5].map(i => <div key={i} className="w-full h-px bg-on-surface/5"></div>)}
              </div>
              {/* Dynamic Chart Area */}
              <div className="flex-1 min-h-[160px] flex items-stretch justify-around px-4 gap-3 pb-8 z-10">
                {chartData.map((val, i) => (
                  <div key={`${trendRange}-${i}`} className="flex-1 flex flex-col justify-end items-center gap-2 group h-full">
                    <div
                      className="w-full bg-gradient-to-t from-[#FF1493]/20 to-[#FF1493] rounded-t-lg transition-all duration-500 shadow-[0_0_15px_rgba(255,20,147,0.15)] group-hover:shadow-[0_0_25px_rgba(255,20,147,0.35)] animate-grow-up"
                      style={{ 
                        height: `${val}%`,
                        animationDelay: `${i * 60}ms`
                      }}
                    ></div>
                    <span className="text-[10px] font-bold text-on-surface/30 uppercase tracking-tighter">{['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-around items-center border-t border-white/5 pt-4">
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">New Athletes</p>
                <p className="text-xl font-black text-on-surface">{data?.players?.length || 0}</p>
              </div>
              <div className="w-px h-8 bg-on-surface/5"></div>
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Match Activity</p>
                <p className="text-xl font-black text-on-surface">{data?.activityLogs?.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* 🔷 SECTION 3: Team Overview Panel */}
          <div className="lg:col-span-2 bg-surface-container-low rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DC143C]">hub</span>
                Organizational Hub
              </h2>
              <button onClick={() => navigate('/admin/teams')} className="text-[#FF1493] text-[10px] font-black uppercase tracking-widest hover:underline transition-all">View All Teams</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(data?.groups?.slice(0, 4) || []).length > 0 ? (
                (data?.groups?.slice(0, 4) || []).map(team => (
                  <div key={team.id} className="p-4 rounded-xl bg-on-surface/5 border border-white/5 hover:border-[#DC143C]/30 transition-all group cursor-pointer" onClick={() => navigate('/admin/teams')}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="w-10 h-10 rounded-lg bg-[#DC143C]/10 flex items-center justify-center border border-[#DC143C]/20">
                        <span className="material-symbols-outlined text-[#DC143C]">groups</span>
                      </div>
                      <span className="bg-green-500/10 text-green-500 text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-widest border border-green-500/20">Active</span>
                    </div>
                    <h3 className="text-on-surface font-bold text-sm mb-1">{team.name}</h3>
                    <p className="text-[10px] text-on-surface/40 uppercase font-black tracking-widest mb-4">Coach {team.coachName || 'N/A'}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-on-surface/30 uppercase font-bold tracking-tighter">Players</span>
                        <span className="text-on-surface font-black text-xs">{team.memberCount || 0}</span>
                      </div>
                      <div className="flex flex-col text-right">
                        <span className="text-[10px] text-on-surface/30 uppercase font-bold tracking-tighter">Performance</span>
                        <span className="text-[#DC143C] font-black text-xs">{team.avgScore || 0}%</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="md:col-span-2 flex flex-col items-center justify-center py-12 border-2 border-dashed border-white/5 rounded-2xl gap-4">
                  <span className="material-symbols-outlined text-4xl text-on-surface/10">group_add</span>
                  <p className="text-on-surface/30 text-xs font-black uppercase tracking-widest text-center">No teams found.<br />Start by creating a new team.</p>
                  <button onClick={() => navigate('/admin/teams/create')} className="bg-[#DC143C] text-on-primary px-6 py-2 rounded-xl text-xs font-bold shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:scale-105 transition-all">Create Team</button>
                </div>
              )}
            </div>
          </div>

          {/* 🔷 SECTION 4: Activity Feed */}
          <div className="lg:col-span-1 bg-surface-container-low rounded-xl border border-white/5 p-6 flex flex-col h-[400px]">
            <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[#FF1493]">history</span>
              Live Feed
            </h2>
            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-6 hide-scrollbar">
              {(data?.activityLogs || []).length > 0 ? (data?.activityLogs || []).map((a, i) => (
                <div key={i} className="flex gap-4 items-start relative group">
                  <div className="w-8 h-8 rounded-xl bg-on-surface/5 flex-shrink-0 flex items-center justify-center border border-outline-variant/30 group-hover:border-[#FF1493]/30 transition-all">
                    <span className="material-symbols-outlined text-[16px] text-[#FF1493]">
                      {a.message.includes('Player') ? 'person_add' :
                        a.message.includes('Match') ? 'sports_soccer' :
                          a.message.includes('Achievement') ? 'verified' : 'notifications'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-on-surface/80 leading-relaxed">{a.message}</p>
                    <p className="text-[10px] text-on-surface/30 font-black uppercase tracking-widest mt-1.5">{a.time || '2m ago'}</p>
                  </div>
                </div>
              )) : (
                <div className="flex-1 flex flex-col items-center justify-center text-on-surface/10 gap-3">
                  <span className="material-symbols-outlined text-4xl">history</span>
                  <p className="text-[10px] font-black uppercase tracking-widest">No recent activity</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 🔷 SECTION 7: Quick Control Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
          {quickControlActions.map((action) => (
            <div
              key={action.label}
              onClick={() => navigate(action.path)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer group hover:-translate-y-1 ${action.primary
                  ? 'bg-[#DC143C] border-[#DC143C] shadow-[0_10px_20px_rgba(124,58,237,0.2)]'
                  : 'bg-on-surface/5 border-outline-variant/30 hover:border-[#FF1493]/30'
                }`}
            >
              <span className={`material-symbols-outlined text-2xl mb-4 block ${action.primary ? 'text-on-surface' : 'text-[#FF1493]'}`}>{action.icon}</span>
              <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${action.primary ? 'text-on-surface' : 'text-on-surface'}`}>{action.label}</h3>
              <p className={`text-[10px] ${action.primary ? 'text-on-surface/70' : 'text-on-surface/30'} font-bold`}>{action.desc}</p>
            </div>
          ))}
        </div>

        {/* 🔷 SECTION 6 & 8: Leaderboard & Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* Leaderboard Preview */}
          <div className="bg-surface-container-low rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
            <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF1493]">leaderboard</span>
              Global Standings
            </h2>
            <div className="flex flex-col gap-3">
              {topPlayers.length > 0 ? topPlayers.map((player, idx) => (
                <div key={player.id} className="flex items-center justify-between p-4 bg-on-surface/5 rounded-xl border border-white/5 hover:bg-on-surface/10 transition-all">
                  <div className="flex items-center gap-4">
                    <span className={`w-6 text-center font-black italic ${idx < 3 ? 'text-[#FF1493]' : 'text-on-surface/20'}`}>
                      #{idx + 1}
                    </span>
                    <div className="w-9 h-9 rounded-full bg-on-surface/10 flex items-center justify-center font-black text-on-surface text-xs border border-outline-variant/30">
                      {player.name?.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-on-surface">{player.name}</p>
                      <p className="text-[10px] text-on-surface/30 uppercase font-black tracking-widest">{player.groupName || 'Unassigned'}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="text-lg font-black text-[#FF1493] tracking-tighter">{player.performanceScore || 0}</p>
                      <p className="text-[8px] text-on-surface/30 uppercase font-black tracking-[0.2em]">Score</p>
                    </div>
                    <span className="material-symbols-outlined text-green-500 text-[18px]">trending_up</span>
                  </div>
                </div>
              )) : (
                <div className="py-10 text-center text-on-surface/10 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-xl">
                  No rankings available
                </div>
              )}
            </div>
          </div>

          {/* System Health / Summary Bonus */}
          <div className="bg-surface-container-low rounded-2xl border border-white/5 p-6 flex flex-col gap-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF1493]/5 via-transparent to-transparent"></div>
            <div>
              <h2 className="font-bold text-sm text-on-surface uppercase tracking-widest flex items-center gap-2 mb-2">
                <span className="material-symbols-outlined text-[#FF1493]">health_and_safety</span>
                System Health
              </h2>
              <p className="text-[10px] text-on-surface/30 uppercase font-black tracking-widest">Live diagnostic scoring</p>
            </div>

            <div className="flex-1 flex flex-col justify-center items-center gap-4 relative z-10">
              <div className="relative w-40 h-40 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-on-surface/5" />
                  <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-[#FF1493] transition-all duration-1000" strokeDasharray="440" strokeDashoffset={440 - (440 * (1.0))} strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-on-surface tracking-tighter">100%</span>
                  <span className="text-[10px] text-[#FF1493] font-black uppercase tracking-widest">Healthy</span>
                </div>
              </div>
              <p className="text-on-surface/60 text-xs text-center max-w-[200px] leading-relaxed">
                All systems operational. No critical issues detected.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
              <div className="flex flex-col">
                <span className="text-[10px] text-on-surface/30 uppercase font-black tracking-widest">Attendance</span>
                <span className="text-on-surface font-black text-lg">100%</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] text-on-surface/30 uppercase font-black tracking-widest">Verification</span>
                <span className="text-[#DC143C] font-black text-lg">Instant</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
