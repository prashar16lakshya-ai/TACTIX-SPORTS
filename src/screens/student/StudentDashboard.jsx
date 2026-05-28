import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import AnimatedNumber from '../../components/common/AnimatedNumber'



export default function StudentDashboard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { data } = useAppData()

  const remarks = data?.remarks || []
  const players = [...(data?.players || [])].sort((a, b) => (b.score || b.performanceScore || 0) - (a.score || a.performanceScore || 0)).slice(0, 5)

  const isCurrentPlayer = (p) => {
    return p.uid === user?.uid || p.id === user?.uid
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 lg:gap-8 max-w-4xl mx-auto w-full">
        {/* Profile Header (Mobile Centered) */}
        <section className="flex flex-col items-center text-center glass p-6 lg:p-8 rounded-3xl border border-outline-variant/30 relative overflow-hidden group animate-slide-up stagger-1">
          <div className="absolute inset-0 bg-gradient-to-br from-[#DC143C]/10 to-transparent opacity-50"></div>

          <div className="relative z-10 flex flex-col items-center">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full overflow-hidden border-4 border-[#DC143C] purple-glow mb-6">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Athlete Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-surface-container-high flex items-center justify-center">
                  <span className="text-4xl font-black text-[#DC143C]">{user?.initials || (user?.name ? user.name.slice(0, 2).toUpperCase() : '??')}</span>
                </div>
              )}
            </div>

            <h1 className="text-2xl lg:text-4xl font-black text-on-surface uppercase tracking-tight mb-2">
              {user?.name || 'Athlete'}
            </h1>
            <p className="text-[#FF1493] font-black text-[10px] lg:text-xs uppercase tracking-[0.3em] mb-4">
              {user?.sport || 'No Sport Assigned'} • {user?.teamId || 'No Team Assigned'}
            </p>

            <div className="flex gap-3 mb-4">
              <span className="bg-on-surface/5 border border-outline-variant/30 text-on-surface/60 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                Rank {user?.rank || '#--'}
              </span>
              <span className="bg-on-surface/5 border border-outline-variant/30 text-on-surface/60 font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full">
                {user?.tier || 'General Tier'}
              </span>
            </div>

            {!user?.teamId && (
              <button
                onClick={() => navigate('/enter-team-code')}
                className="flex items-center gap-2 px-6 py-2.5 bg-[#DC143C]/20 border border-[#DC143C]/40 rounded-full font-black text-xs uppercase tracking-widest text-[#DC143C] hover:bg-[#DC143C]/30 hover:scale-105 active:scale-95 transition-all shadow-[0_0_15px_rgba(220,20,60,0.2)]"
              >
                <span className="material-symbols-outlined text-[16px]">group_add</span>
                Join Team Code
              </button>
            )}
          </div>
        </section>

        {/* Performance & Attendance Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Performance Dashboard */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col gap-6 animate-slide-up stagger-2">
            <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">monitoring</span>
              Performance
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#111111] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-1">Score</span>
                <span className="text-3xl font-black text-on-surface">
                  <AnimatedNumber value={user?.performanceScore || 0} />
                </span>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-1">Team Rank</span>
                <span className="text-3xl font-black text-primary">
                  #{user?.rank ? <AnimatedNumber value={user.rank} /> : '--'}
                </span>
              </div>
              <div className="bg-[#111111] border border-white/5 rounded-xl p-4 flex flex-col items-center justify-center text-center col-span-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40 mb-1">Team Members</span>
                <span className="text-2xl font-black text-on-surface">
                  <AnimatedNumber value={data?.players?.length || 0} />
                </span>
              </div>
            </div>
          </div>

          {/* Attendance Page (Widget) */}
          <div className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col items-center">
            <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2 w-full mb-6">
              <span className="material-symbols-outlined text-green-500 text-[20px]">how_to_reg</span>
              Attendance
            </h3>
            
            <div className="flex gap-8 items-center w-full justify-center">
              {/* Donut Chart */}
              <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="64" cy="64" r="50" stroke="rgba(255,255,255,0.05)" strokeWidth="12" fill="transparent" />
                  <circle cx="64" cy="64" r="50" stroke="#10B981" strokeWidth="12" fill="transparent"
                    strokeDasharray={2 * Math.PI * 50} strokeDashoffset={(2 * Math.PI * 50) - (((user?.attendanceStats?.percentage || 0) / 100) * 2 * Math.PI * 50)}
                    className="transition-all duration-1000 ease-out shadow-[0_0_15px_#10B981]" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-2xl font-black text-on-surface">
                    <AnimatedNumber value={user?.attendanceStats?.percentage || 0} />%
                  </span>
                </div>
              </div>
              
              {/* Session Stats */}
              <div className="flex flex-col gap-3 flex-1">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Total</span>
                  <div className="text-xl font-bold text-on-surface">
                    <AnimatedNumber value={user?.attendanceStats?.total || 0} /> Sessions
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-on-surface/40">Attended</span>
                  <div className="text-xl font-bold text-green-500">
                    <AnimatedNumber value={user?.attendanceStats?.attended || 0} /> Sessions
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Leaderboard Highlight */}
        <section className="bg-surface-container-low border border-white/5 rounded-2xl p-6 flex flex-col gap-4 animate-slide-up stagger-3">
          <div className="flex justify-between items-center">
            <h3 className="text-on-surface font-bold text-sm uppercase tracking-wider flex items-center gap-2">
              <span className="material-symbols-outlined text-yellow-500 text-[20px]">leaderboard</span>
              Leaderboard
            </h3>
            <button onClick={() => navigate('/leaderboard')} className="text-primary text-xs font-bold hover:underline">Full View</button>
          </div>
          
          <div className="flex flex-col gap-2">
            {players.length > 0 ? players.map((p, idx) => (
              <div key={p.rank || idx} className={`flex items-center justify-between p-3 rounded-xl border ${isCurrentPlayer(p) ? 'bg-primary/10 border-primary/30' : 'bg-[#111111] border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <span className={`text-lg font-black w-6 text-center ${p.rank === 1 || idx === 0 ? 'text-yellow-500' : p.rank === 2 || idx === 1 ? 'text-gray-300' : p.rank === 3 || idx === 2 ? 'text-amber-600' : 'text-on-surface/40'}`}>
                    #{p.rank || idx + 1}
                  </span>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant/30 flex items-center justify-center font-bold text-on-surface text-xs">
                      {p.name?.charAt(0) || '?'}
                    </div>
                    <span className={`text-sm font-bold ${isCurrentPlayer(p) ? 'text-primary' : 'text-on-surface'}`}>{p.name} {isCurrentPlayer(p) && '(You)'}</span>
                  </div>
                </div>
                <span className="text-sm font-black text-on-surface">{p.score || p.performanceScore || 0}</span>
              </div>
            )) : (
              <div className="py-8 text-center text-on-surface/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-xl">
                No rankings available yet
              </div>
            )}
          </div>
        </section>

        {/* Coach Remarks (Simple List) */}
        <section className="flex flex-col gap-4 animate-slide-up stagger-4">
          <h2 className="text-xs font-black text-on-surface/30 uppercase tracking-[0.3em] pl-2">Recent Coach Remarks</h2>
          <div className="flex flex-col gap-3">
            {remarks.length > 0 ? remarks.map((r, i) => (
              <div key={i} className="bg-surface-container-low border border-white/5 rounded-2xl p-5 flex flex-col gap-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#DC143C]/20 flex items-center justify-center border border-[#DC143C]/30">
                      <span className="material-symbols-outlined text-[14px] text-[#DC143C]">sports</span>
                    </div>
                    <span className="text-[10px] font-black text-on-surface uppercase tracking-widest">{r.author || r.coach}</span>
                  </div>
                  <span className="text-[8px] font-black text-on-surface/40 uppercase tracking-widest">{r.date || r.time}</span>
                </div>
                <p className="text-sm text-on-surface/70 leading-relaxed font-lexend">{r.text}</p>
              </div>
            )) : (
              <div className="py-10 text-center text-on-surface/20 uppercase text-[10px] font-black tracking-widest border border-dashed border-white/5 rounded-2xl">
                No coach remarks available
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  )
}
