import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const LOW_PERFORMANCE = [
  { name: 'Vihaan Kapoor', score: '4.2 / 10', trend: 'down', lastMatch: 'May 15, 2025', avatar: 'VK' },
  { name: 'Rohit Sharma', score: '4.8 / 10', trend: 'down', lastMatch: 'May 15, 2025', avatar: 'RS' },
  { name: 'Reyansh Raj', score: '5.0 / 10', trend: 'down', lastMatch: 'May 14, 2025', avatar: 'RR' },
  { name: 'Aditya Chauhan', score: '5.1 / 10', trend: 'down', lastMatch: 'May 15, 2025', avatar: 'AC' },
  { name: 'Kunal Das', score: '5.3 / 10', trend: 'down', lastMatch: 'May 13, 2025', avatar: 'KD' },
];

const LOW_STAMINA = [
  { name: 'Arjun Singh', value: 58, status: 'Low', avatar: 'AS' },
  { name: 'Kabir Verma', value: 61, status: 'Low', avatar: 'KV' },
  { name: 'Yuvraj Patel', value: 63, status: 'Low', avatar: 'YP' },
  { name: 'Shaurya Iyer', value: 65, status: 'Low', avatar: 'SI' },
];

const INACTIVE = [
  { name: 'Harshit Malik', lastActive: 'May 8, 2025', days: '9 days', avatar: 'HM' },
  { name: 'Devansh Rao', lastActive: 'May 6, 2025', days: '11 days', avatar: 'DR' },
  { name: 'Ishaan Bhatia', lastActive: 'May 5, 2025', days: '12 days', avatar: 'IB' },
];

export default function NeedsAttention() {
  const navigate = useNavigate();

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full pb-20 px-4 lg:px-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-on-surface/60 hover:text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Needs Attention</h1>
          <p className="text-on-surface/50 text-sm">Players who need your focus and support</p>
        </div>

        {/* Top Summary Widgets */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Players', val: '12', icon: 'groups', color: 'text-on-surface' },
            { label: 'Low Performance', val: '5', icon: 'trending_down', color: 'text-orange-500' },
            { label: 'Low Stamina', val: '4', icon: 'bolt', color: 'text-yellow-500' },
            { label: 'Inactive Players', val: '3', icon: 'person_off', color: 'text-red-500' },
          ].map((w, i) => (
            <div key={i} className="bg-on-surface/5 border border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center gap-3 text-center">
              <span className={`material-symbols-outlined ${w.color}`}>{w.icon}</span>
              <div>
                <p className="text-2xl font-black text-on-surface">{w.val}</p>
                <p className="text-[9px] font-black text-on-surface/30 uppercase tracking-widest mt-1">{w.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Low Performance */}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-end px-2">
              <div>
                <h3 className="text-red-500 font-bold flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg">warning</span>
                  Low Performance
                </h3>
                <p className="text-on-surface/40 text-[10px] font-medium mt-1">Players with low match performance</p>
              </div>
              <button className="text-[10px] font-black text-[#FF1493] uppercase tracking-widest">View all</button>
            </div>
            
            <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl overflow-hidden">
              <div className="grid grid-cols-3 p-4 border-b border-white/5 bg-on-surface/5 text-[9px] font-black text-on-surface/20 uppercase tracking-widest">
                <span>Player</span>
                <span className="text-center">Avg. Score</span>
                <span className="text-right">Last Match</span>
              </div>
              <div className="flex flex-col">
                {LOW_PERFORMANCE.map((p, i) => (
                  <div key={i} className="grid grid-cols-3 p-4 items-center border-b border-white/5 last:border-0 hover:bg-on-surface/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.avatar}</div>
                      <span className="text-xs font-bold text-on-surface truncate">{p.name}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-on-surface">{p.score}</span>
                      <span className="material-symbols-outlined text-red-500 text-xs">trending_down</span>
                    </div>
                    <div className="text-right text-[10px] font-black text-on-surface/30 uppercase tracking-widest">{p.lastMatch}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-8">
            {/* Low Stamina */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h3 className="text-yellow-500 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">bolt</span>
                    Low Stamina
                  </h3>
                  <p className="text-on-surface/40 text-[10px] font-medium mt-1">Players with low stamina levels</p>
                </div>
                <button className="text-[10px] font-black text-[#FF1493] uppercase tracking-widest">View all</button>
              </div>
              
              <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-6 flex flex-col gap-4">
                {LOW_STAMINA.map((p, i) => (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.avatar}</div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1.5">
                        <span className="text-xs font-bold text-on-surface">{p.name}</span>
                        <span className="text-[10px] font-black text-on-surface/30">{p.value}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-on-surface/10 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${p.value}%` }}></div>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">{p.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Inactive Players */}
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end px-2">
                <div>
                  <h3 className="text-red-500 font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-lg">person_off</span>
                    Inactive Players
                  </h3>
                  <p className="text-on-surface/40 text-[10px] font-medium mt-1">Players inactive for more than 7 days</p>
                </div>
                <button className="text-[10px] font-black text-[#FF1493] uppercase tracking-widest">View all</button>
              </div>
              
              <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-3 p-4 border-b border-white/5 bg-on-surface/5 text-[9px] font-black text-on-surface/20 uppercase tracking-widest">
                  <span>Player</span>
                  <span className="text-center">Last Active</span>
                  <span className="text-right">Days Inactive</span>
                </div>
                {INACTIVE.map((p, i) => (
                  <div key={i} className="grid grid-cols-3 p-4 items-center border-b border-white/5 last:border-0 hover:bg-on-surface/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.avatar}</div>
                      <span className="text-xs font-bold text-on-surface truncate">{p.name}</span>
                    </div>
                    <div className="text-center text-[10px] font-black text-on-surface/30 uppercase tracking-widest">{p.lastActive}</div>
                    <div className="text-right text-[10px] font-black text-red-400 uppercase tracking-widest">{p.days}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <button className="flex-1 bg-[#FF1493] hover:bg-[#C01277] text-on-surface font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-xl">rate_review</span>
            Add Feedback
          </button>
          <button className="flex-1 bg-on-surface/5 hover:bg-on-surface/10 text-on-surface font-black py-4 rounded-2xl border border-outline-variant/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-xl">assignment</span>
            Assign Training
          </button>
          <button className="flex-1 bg-on-surface/5 hover:bg-on-surface/10 text-on-surface font-black py-4 rounded-2xl border border-outline-variant/30 transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-xl">chat</span>
            Message Players
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}