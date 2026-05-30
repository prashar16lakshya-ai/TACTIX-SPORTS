import React from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

import { useAppData } from '../../context/AppDataContext';
import EmptyState from '../../components/common/EmptyState';

export default function NeedsAttention() {
  const navigate = useNavigate();
  const { data } = useAppData();

  const players = data?.players || [];
  
  const lowPerformance = players.filter(p => (p.performanceScore || 0) < 60);
  const lowStamina = players.filter(p => (p.stamina || 0) < 70);
  
  const now = new Date();
  const inactivePlayers = players.filter(p => {
    if (!p.lastActive) return false;
    const diff = now - new Date(p.lastActive);
    return diff > 7 * 24 * 60 * 60 * 1000;
  });

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
            { label: 'Total Players', val: players.length, icon: 'groups', color: 'text-on-surface' },
            { label: 'Low Performance', val: lowPerformance.length, icon: 'trending_down', color: 'text-orange-500' },
            { label: 'Low Stamina', val: lowStamina.length, icon: 'bolt', color: 'text-yellow-500' },
            { label: 'Inactive Players', val: inactivePlayers.length, icon: 'person_off', color: 'text-red-500' },
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
            
            {lowPerformance.length > 0 ? (
              <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl overflow-hidden">
                <div className="grid grid-cols-3 p-4 border-b border-white/5 bg-on-surface/5 text-[9px] font-black text-on-surface/20 uppercase tracking-widest">
                  <span>Player</span>
                  <span className="text-center">Avg. Score</span>
                  <span className="text-right">Last Match</span>
                </div>
                <div className="flex flex-col">
                  {lowPerformance.map((p, i) => (
                    <div key={i} className="grid grid-cols-3 p-4 items-center border-b border-white/5 last:border-0 hover:bg-on-surface/5 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.name?.substring(0, 2).toUpperCase() || 'P'}</div>
                        <span className="text-xs font-bold text-on-surface truncate">{p.name || 'Unknown'}</span>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-xs font-bold text-on-surface">{p.performanceScore || 0} / 100</span>
                        <span className="material-symbols-outlined text-red-500 text-xs">trending_down</span>
                      </div>
                      <div className="text-right text-[10px] font-black text-on-surface/30 uppercase tracking-widest">{p.lastMatchDate ? new Date(p.lastMatchDate).toLocaleDateString() : '—'}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState icon="celebration" title="No Low Performance" message="All players are performing well." />
            )}
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
              
              {lowStamina.length > 0 ? (
                <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-6 flex flex-col gap-4">
                  {lowStamina.map((p, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.name?.substring(0, 2).toUpperCase() || 'P'}</div>
                      <div className="flex-1">
                        <div className="flex justify-between mb-1.5">
                          <span className="text-xs font-bold text-on-surface">{p.name || 'Unknown'}</span>
                          <span className="text-[10px] font-black text-on-surface/30">{p.stamina || 0}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-on-surface/10 rounded-full overflow-hidden">
                          <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${p.stamina || 0}%` }}></div>
                        </div>
                      </div>
                      <span className="text-[9px] font-black text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/20">Low</span>
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState icon="bolt" title="Stamina Levels OK" message="All players have adequate stamina." />
              )}
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
              
              {inactivePlayers.length > 0 ? (
                <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl overflow-hidden">
                  <div className="grid grid-cols-3 p-4 border-b border-white/5 bg-on-surface/5 text-[9px] font-black text-on-surface/20 uppercase tracking-widest">
                    <span>Player</span>
                    <span className="text-center">Last Active</span>
                    <span className="text-right">Days Inactive</span>
                  </div>
                  {inactivePlayers.map((p, i) => {
                    const days = Math.floor((now - new Date(p.lastActive)) / (1000 * 60 * 60 * 24));
                    return (
                      <div key={i} className="grid grid-cols-3 p-4 items-center border-b border-white/5 last:border-0 hover:bg-on-surface/5 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-on-surface/10 flex items-center justify-center text-[10px] font-black text-on-surface">{p.name?.substring(0, 2).toUpperCase() || 'P'}</div>
                          <span className="text-xs font-bold text-on-surface truncate">{p.name || 'Unknown'}</span>
                        </div>
                        <div className="text-center text-[10px] font-black text-on-surface/30 uppercase tracking-widest">{new Date(p.lastActive).toLocaleDateString()}</div>
                        <div className="text-right text-[10px] font-black text-red-400 uppercase tracking-widest">{days} days</div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <EmptyState icon="person" title="No Inactive Players" message="All players have been active recently." />
              )}
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