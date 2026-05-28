import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function PlayerProfileDashboard() {
  const navigate = useNavigate()

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">

        {/* Top Section: Player Card & Stats */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

          {/* Main Player Card */}
          <div className="xl:col-span-1 bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl overflow-hidden relative">
            <div className="absolute top-4 right-4 z-10 flex gap-2">
              <span className="bg-[#FF1493]/10 text-[#FF1493] border border-[#FF1493]/30 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">local_police</span>
                STATE LEVEL
              </span>
            </div>

            <div className="absolute top-4 left-4 z-10 bg-[#0A0A0A]/80 backdrop-blur-md rounded-xl p-3 border border-outline-variant/30 text-center">
              <p className="text-[#FF1493] font-black text-3xl leading-none">94<span className="text-on-surface/40 text-sm font-normal">/100</span></p>
              <p className="text-on-surface/60 text-[10px] uppercase tracking-wider mt-1">Performance<br />Score</p>
            </div>

            {/* Simulated Player Image area */}
            <div className="h-64 bg-gradient-to-t from-[#0A0A0A] via-[#FF1493]/20 to-[#0A0A0A] flex items-end justify-center relative overflow-hidden">
              {/* Replace with actual image in prod */}
              <div className="absolute inset-0 bg-[url('https://i.pravatar.cc/500?img=11')] bg-cover bg-center opacity-40 mix-blend-luminosity"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent"></div>

              <div className="relative z-20 w-full p-6 text-center">
                <h1 className="text-3xl font-black text-on-surface uppercase tracking-wider">Priya Sharma</h1>
                <div className="flex items-center justify-center gap-3 text-on-surface/70 text-sm mt-2">
                  <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[16px]">sports_cricket</span> Batsman</span>
                  <span>•</span>
                  <span>Cricket</span>
                </div>
              </div>
            </div>

            <div className="p-6 pt-0">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-on-surface/50 text-xs">Team</p>
                  <p className="text-[#FF1493] font-bold">Cheetah XI</p>
                </div>
                <div className="text-right">
                  <p className="text-on-surface/50 text-xs">School</p>
                  <p className="text-on-surface font-bold">Delhi Public School, Gurugram</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div className="bg-on-surface/5 rounded-xl p-3 text-center border border-white/5">
                  <p className="text-on-surface/50 text-[10px] uppercase">Rank in Team</p>
                  <p className="text-on-surface font-bold text-xl mt-1">#2</p>
                </div>
                <div className="bg-on-surface/5 rounded-xl p-3 text-center border border-white/5">
                  <p className="text-on-surface/50 text-[10px] uppercase">Win Rate</p>
                  <p className="text-on-surface font-bold text-xl mt-1">75%</p>
                </div>
                <div className="bg-on-surface/5 rounded-xl p-3 text-center border border-white/5">
                  <p className="text-on-surface/50 text-[10px] uppercase">Recent Form</p>
                  <div className="flex justify-center gap-1 mt-2">
                    <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-500 text-[8px] flex items-center justify-center font-bold">W</span>
                    <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-500 text-[8px] flex items-center justify-center font-bold">W</span>
                    <span className="w-4 h-4 rounded-full bg-red-500/20 text-red-500 text-[8px] flex items-center justify-center font-bold">L</span>
                    <span className="w-4 h-4 rounded-full bg-green-500/20 text-green-500 text-[8px] flex items-center justify-center font-bold">W</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-4 border-t border-white/5 bg-on-surface/5 text-center divide-x divide-white/5 py-4">
              <div>
                <p className="text-on-surface/50 text-xs">Age</p>
                <p className="text-on-surface font-bold mt-1">17</p>
              </div>
              <div>
                <p className="text-on-surface/50 text-xs">Height</p>
                <p className="text-on-surface font-bold mt-1">182 cm</p>
              </div>
              <div>
                <p className="text-on-surface/50 text-xs">Position</p>
                <p className="text-on-surface font-bold mt-1 text-xs">STRIKER</p>
              </div>
              <div>
                <p className="text-on-surface/50 text-xs">Class</p>
                <p className="text-on-surface font-bold mt-1">11</p>
              </div>
            </div>
          </div>

          {/* Right Column: Performance & Selection */}
          <div className="xl:col-span-2 flex flex-col gap-6">

            <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
              <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF1493]">trending_up</span>
                Performance Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Bars */}
                <div className="space-y-4">
                  {[
                    { label: 'Skill', value: 98, color: 'bg-[#FF1493]' },
                    { label: 'Speed', value: 92, color: 'bg-[#DC143C]' },
                    { label: 'Stamina', value: 85, color: 'bg-yellow-500' }
                  ].map(stat => (
                    <div key={stat.label}>
                      <div className="flex justify-between text-xs mb-2">
                        <span className="text-on-surface/70">{stat.label}</span>
                        <span className="text-on-surface font-bold">{stat.value}</span>
                      </div>
                      <div className="h-2 w-full bg-on-surface/5 rounded-full overflow-hidden">
                        <div className={`h-full ${stat.color} rounded-full`} style={{ width: `${stat.value}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Grid Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-on-surface/5 rounded-xl p-4 border border-white/5">
                    <span className="material-symbols-outlined text-[#FF1493] mb-2 text-3xl">sports_soccer</span>
                    <p className="text-on-surface/50 text-xs">Matches Played</p>
                    <p className="text-on-surface font-bold text-2xl mt-1">24</p>
                  </div>
                  <div className="bg-on-surface/5 rounded-xl p-4 border border-white/5">
                    <span className="material-symbols-outlined text-green-500 mb-2 text-3xl">emoji_events</span>
                    <p className="text-on-surface/50 text-xs">Wins</p>
                    <p className="text-on-surface font-bold text-2xl mt-1">18</p>
                  </div>
                  <div className="bg-on-surface/5 rounded-xl p-4 border border-white/5">
                    <span className="material-symbols-outlined text-[#DC143C] mb-2 text-3xl">star</span>
                    <p className="text-on-surface/50 text-xs">Points</p>
                    <p className="text-on-surface font-bold text-2xl mt-1">420</p>
                  </div>
                  <div className="bg-on-surface/5 rounded-xl p-4 border border-white/5">
                    <span className="material-symbols-outlined text-yellow-500 mb-2 text-3xl">cancel</span>
                    <p className="text-on-surface/50 text-xs">Win Rate</p>
                    <p className="text-on-surface font-bold text-2xl mt-1">75%</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
              <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF1493]">verified</span>
                Selection Status
              </h3>
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex-1 w-full space-y-4">
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-full bg-[#DC143C]/20 text-[#DC143C] flex items-center justify-center">
                      <span className="material-symbols-outlined">emoji_events</span>
                    </div>
                    <div>
                      <p className="text-on-surface/50 text-xs">Current Level</p>
                      <p className="text-[#DC143C] font-bold">State Level</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 border-b border-white/5 pb-4">
                    <div className="w-10 h-10 rounded-full bg-[#FF1493]/20 text-[#FF1493] flex items-center justify-center">
                      <span className="material-symbols-outlined">local_police</span>
                    </div>
                    <div>
                      <p className="text-on-surface/50 text-xs">Eligible For</p>
                      <p className="text-[#FF1493] font-bold">National Trials</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-yellow-500/20 text-yellow-500 flex items-center justify-center">
                      <span className="material-symbols-outlined">verified_user</span>
                    </div>
                    <div>
                      <p className="text-on-surface/50 text-xs">Coach Recommendation</p>
                      <p className="text-yellow-500 font-bold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">star</span> Recommended
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center md:pl-8 md:border-l border-t md:border-t-0 pt-6 md:pt-0 border-outline-variant/30 w-full md:w-auto">
                  <p className="text-on-surface/50 text-xs mb-4">Selection Readiness</p>
                  <div className="relative w-32 h-32 rounded-full border-8 border-white/5 flex items-center justify-center">
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle cx="64" cy="64" r="56" fill="none" stroke="#0CCA75" strokeWidth="8" strokeDasharray="351" strokeDashoffset="40" className="transition-all duration-1000" />
                    </svg>
                    <span className="material-symbols-outlined text-[#0CCA75] text-5xl">check_circle</span>
                  </div>
                  <p className="text-[#0CCA75] font-black tracking-widest mt-4">READY</p>
                  <p className="text-on-surface/40 text-[10px] text-center mt-1">Excellent Form &<br />High Consistency</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Middle Section: Acheivements & Insights */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">trending_up</span>
                Recent Acheivements
              </h3>
              <button className="text-[#FF1493] text-xs hover:underline">View All</button>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { icon: 'location_on', title: 'District Selection 2026', desc: 'Selected for District Football Team', year: '2026', color: 'bg-blue-500', text: 'text-blue-500' },
                { icon: 'star', title: 'MVP - Tournament', desc: 'Most Valuable Player', year: '2025', color: 'bg-[#DC143C]', text: 'text-[#DC143C]' },
                { icon: 'emoji_events', title: 'State Qualifier', desc: 'Qualified for State Championship', year: '2025', color: 'bg-yellow-500', text: 'text-yellow-500' }
              ].map(ach => (
                <div key={ach.title} className="bg-[#0A0A0A]/50 border border-white/5 rounded-xl p-4 flex flex-col justify-between">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-10 h-10 rounded-lg ${ach.color}/20 ${ach.text} flex items-center justify-center flex-shrink-0`}>
                      <span className="material-symbols-outlined">{ach.icon}</span>
                    </div>
                    <div>
                      <p className="text-on-surface text-sm font-bold leading-tight mb-1">{ach.title}</p>
                      <p className="text-on-surface/40 text-[10px] leading-snug">{ach.desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-auto">
                    <span className="text-green-500 text-[10px] flex items-center gap-1 font-bold">
                      <span className="material-symbols-outlined text-[12px]">verified</span> Verified
                    </span>
                    <span className="text-on-surface/40 text-[10px]">{ach.year}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1 bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6 flex flex-col justify-between">
            <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-[#FF1493]">person</span>
              Coach Insights
            </h3>
            <div className="flex-1 relative">
              <span className="material-symbols-outlined text-6xl text-on-surface/5 absolute -top-4 -left-2">format_quote</span>
              <p className="text-on-surface/70 text-sm leading-relaxed relative z-10 italic">
                "Strong striker with excellent finishing ability and game awareness. Shows leadership qualities on the field. Ready for district-level competitions."
              </p>
            </div>
            <div className="flex items-center gap-3 mt-6 pt-6 border-t border-outline-variant/30">
              <div className="w-10 h-10 rounded-full bg-on-surface/10 overflow-hidden">
                <img src="data:image/jpeg;base64,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" alt="Coach" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-on-surface font-bold text-sm">Marcus Thorne</p>
                <p className="text-on-surface/40 text-xs">Head Coach</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section: Trend & Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">timeline</span>
                Performance Trend
              </h3>
              <select className="bg-on-surface/5 border border-outline-variant/30 rounded-lg px-3 py-1 text-xs text-on-surface/70 outline-none">
                <option>Last 6 Matches</option>
              </select>
            </div>
            <div className="h-32 flex items-center justify-between relative px-4">
              {/* Fake Line Chart */}
              <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
                <path d="M0,64 L100,64 L200,90 L300,40 L400,40 L500,40" fill="none" stroke="#FF1493" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <path d="M0,64 L100,64 L200,90 L300,40 L400,40 L500,40 L500,128 L0,128 Z" fill="url(#gradient)" stroke="none" vectorEffect="non-scaling-stroke" />
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FF1493" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#FF1493" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Data points */}
              {[
                { label: 'Jan 12', status: 'W', color: 'bg-green-500' },
                { label: 'Jan 19', status: 'W', color: 'bg-green-500' },
                { label: 'Jan 26', status: 'L', color: 'bg-red-500' },
                { label: 'Feb 02', status: 'W', color: 'bg-green-500' },
                { label: 'Feb 09', status: 'W', color: 'bg-green-500' },
                { label: 'Feb 16', status: 'W', color: 'bg-green-500' },
              ].map((pt, i) => (
                <div key={i} className="flex flex-col items-center gap-2 relative z-10">
                  <div className={`w-8 h-8 rounded-full ${pt.color}/20 flex items-center justify-center border border-${pt.color}/50 text-${pt.color.replace('bg-', '')} font-bold text-xs`}>
                    {pt.status}
                  </div>
                  <span className="text-on-surface/40 text-[10px]">{pt.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="xl:col-span-1 bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl p-6">
            <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-6">Quick Actions</h3>
            <div className="grid grid-cols-3 gap-4">
              <button className="bg-on-surface/5 hover:bg-on-surface/10 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[#FF1493] text-3xl">emoji_events</span>
                <span className="text-on-surface/70 text-xs text-center leading-tight">Add<br />Achievement</span>
              </button>
              <button className="bg-on-surface/5 hover:bg-on-surface/10 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-[#DC143C] text-3xl">policy</span>
                <span className="text-on-surface/70 text-xs text-center leading-tight">Scouting<br />Report</span>
              </button>
              <button className="bg-on-surface/5 hover:bg-on-surface/10 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-green-500 text-3xl">analytics</span>
                <span className="text-on-surface/70 text-xs text-center leading-tight">Performance<br />Report</span>
              </button>
              <button onClick={() => navigate('/coach/report-injury')} className="bg-on-surface/5 hover:bg-red-500/10 border border-white/5 hover:border-red-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-red-500 text-3xl">local_hospital</span>
                <span className="text-on-surface/70 group-hover:text-red-400 text-xs text-center leading-tight">Report<br />Injury</span>
              </button>
              <button onClick={() => navigate('/coach/player-report')} className="bg-on-surface/5 hover:bg-blue-500/10 border border-white/5 hover:border-blue-500/30 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors group">
                <span className="material-symbols-outlined text-blue-500 text-3xl">description</span>
                <span className="text-on-surface/70 group-hover:text-blue-400 text-xs text-center leading-tight">Parent<br />Report</span>
              </button>
              <button className="bg-on-surface/5 hover:bg-on-surface/10 border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-colors">
                <span className="material-symbols-outlined text-pink-500 text-3xl">chat</span>
                <span className="text-on-surface/70 text-xs text-center leading-tight">Message<br />Player</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
