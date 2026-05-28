import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const ATTENDANCE_DATA = [
  { id: 1, name: 'Aarav Mehta', status: 'Present', time: '08:45 AM', avatar: 'AM' },
  { id: 2, name: 'Rohit Sharma', status: 'Present', time: '08:50 AM', avatar: 'RS' },
  { id: 3, name: 'Vihaan Kapoor', status: 'Absent', time: '--', avatar: 'VK' },
  { id: 4, name: 'Arjun Singh', status: 'Present', time: '08:55 AM', avatar: 'AS' },
  { id: 5, name: 'Kabir Verma', status: 'Present', time: '08:47 AM', avatar: 'KV' },
];

export default function AttendanceSnapshot() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full pb-20 px-4 lg:px-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-on-surface/60 hover:text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
          </button>
        </div>

        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Attendance Snapshot</h1>
            <p className="text-on-surface/50 text-sm">Overview of team attendance and trends</p>
          </div>
          <select className="bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-2 text-xs text-on-surface outline-none">
            <option>All Squads</option>
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Overall Attendance */}
          <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-8 flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black text-on-surface/30 uppercase tracking-[0.2em] mb-2">Overall Attendance</p>
              <div className="flex items-baseline gap-4">
                <span className="text-6xl font-black text-on-surface tracking-tighter">94%</span>
                <span className="bg-green-500/10 text-green-500 text-[10px] font-black px-2 py-1 rounded-lg border border-green-500/20">+ 4% vs last 7 days</span>
              </div>
              <p className="text-on-surface/30 text-[10px] mt-4 font-medium">Avg. across all active squads</p>
            </div>
            <div className="relative w-24 h-24">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-on-surface/5" />
                <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray="251.2" strokeDashoffset="15" className="text-green-500" />
              </svg>
            </div>
          </div>

          {/* Attendance Trend */}
          <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-8">
            <p className="text-[10px] font-black text-on-surface/30 uppercase tracking-[0.2em] mb-6">Attendance Trend (Last 7 Days)</p>
            <div className="h-32 flex items-end justify-between gap-2 px-2">
              {[60, 80, 75, 90, 85, 94, 92].map((h, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="w-full bg-green-500/20 rounded-t-lg relative group transition-all" style={{ height: `${h}%` }}>
                    <div className="absolute inset-0 bg-green-500 opacity-20 group-hover:opacity-40 rounded-t-lg"></div>
                  </div>
                  <span className="text-[8px] font-black text-on-surface/20 uppercase">{['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Attendance */}
          <div className="lg:col-span-2 bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Today's Attendance</h3>
              <span className="text-[10px] font-black text-[#FF1493] uppercase tracking-widest">May 17, 2025</span>
            </div>
            
            <div className="flex flex-col gap-2">
              {ATTENDANCE_DATA.map((p) => (
                <div key={p.id} className="flex items-center gap-4 p-3 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-on-surface/5 transition-all">
                  <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.avatar}</div>
                  <div className="flex-1 text-xs font-bold text-on-surface">{p.name}</div>
                  <div className={`text-[10px] font-black px-2 py-1 rounded-lg uppercase ${p.status === 'Present' ? 'text-green-500 bg-green-500/10' : 'text-red-500 bg-red-500/10'}`}>
                    {p.status}
                  </div>
                  <div className="text-[10px] font-black text-on-surface/30 w-16 text-right uppercase tracking-widest">{p.time}</div>
                </div>
              ))}
            </div>
            
            <button className="text-[10px] font-black text-[#FF1493] uppercase tracking-widest hover:underline mt-2">View all players</button>
          </div>

          {/* Absentees */}
          <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6">
            <h3 className="text-sm font-bold text-on-surface uppercase tracking-widest">Absentees</h3>
            
            <div className="flex flex-col gap-8">
              <div>
                <p className="text-[9px] font-black text-on-surface/30 uppercase tracking-[0.2em] mb-4">Absent Today (1)</p>
                <div className="flex items-center gap-3 p-3 rounded-2xl bg-red-500/5 border border-red-500/10">
                  <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center text-[10px] font-black text-red-400">VK</div>
                  <div>
                    <p className="text-xs font-bold text-on-surface">Vihaan Kapoor</p>
                    <p className="text-[9px] text-on-surface/40 font-medium uppercase tracking-widest">Forward</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-[9px] font-black text-on-surface/30 uppercase tracking-[0.2em] mb-4">Absent &gt; 2 Days (2)</p>
                <div className="flex flex-col gap-3">
                  {[{name: 'Reyansh Raj', pos: 'Midfielder'}, {name: 'Aditya Chauhan', pos: 'Defender'}].map((p, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/5">
                      <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.name.split(' ').map(n=>n[0]).join('')}</div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-on-surface">{p.name}</p>
                        <p className="text-[9px] text-on-surface/40 font-medium uppercase tracking-widest">{p.pos}</p>
                      </div>
                      <div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-[#FF1493] hover:bg-[#C01277] text-on-surface font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-xl">how_to_reg</span>
            Mark Attendance
          </button>
          <button className="flex-1 bg-on-surface/5 hover:bg-on-surface/10 text-on-surface font-black py-4 rounded-2xl border border-outline-variant/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-xl">download</span>
            Download Report
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}