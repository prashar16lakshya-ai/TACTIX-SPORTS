import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { useNavigate } from 'react-router-dom';

const ALERTS = {
  critical: [
    { id: 1, title: '3 players absent for 2+ days', body: 'Reyansh Raj, Aditya Chauhan, Harshit Malik', time: 'May 17, 2025 - 10:30 AM', icon: 'groups', color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 2, title: 'No attendance marked today', body: 'Please mark attendance for today', time: 'May 17, 2025 - 09:15 AM', icon: 'calendar_today', color: 'text-red-500', bg: 'bg-red-500/10' },
    { id: 3, title: 'No training assigned this week', body: 'Assign training plan to keep players on track', time: 'May 17, 2025 - 08:45 AM', icon: 'assignment', color: 'text-red-500', bg: 'bg-red-500/10' },
  ],
  warnings: [
    { id: 4, title: '2 players with low stamina', body: 'Arjun Singh, Kabir Verma', time: 'May 17, 2025 - 10:20 AM', icon: 'bolt', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 5, title: 'Performance dropping for 4 players', body: 'Check player performance trends', time: 'May 17, 2025 - 09:50 AM', icon: 'trending_down', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 6, title: 'Upcoming match in 2 days', body: 'vs Greenfield Academy', time: 'May 17, 2025 - 08:30 AM', icon: 'sports_soccer', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
    { id: 7, title: 'Incomplete player profiles', body: '3 players have incomplete information', time: 'May 16, 2025 - 06:15 PM', icon: 'person_outline', color: 'text-yellow-500', bg: 'bg-yellow-500/10' },
  ],
  resolved: [
    { id: 8, title: 'Attendance marked for May 16', body: 'All players attendance has been recorded', time: 'May 16, 2025 - 06:00 PM', icon: 'check_circle', color: 'text-green-500', bg: 'bg-green-500/10' },
  ]
};

export default function TeamAlerts() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('All Alerts');

  const counts = {
    'All Alerts': ALERTS.critical.length + ALERTS.warnings.length + ALERTS.resolved.length,
    'Critical': ALERTS.critical.length,
    'Warnings': ALERTS.warnings.length,
    'Resolved': ALERTS.resolved.length,
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full pb-20 px-4 lg:px-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="text-on-surface/60 hover:text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="text-xs font-bold uppercase tracking-widest">Back to Dashboard</span>
          </button>
        </div>

        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Team Alerts</h1>
          <p className="text-on-surface/50 text-sm">Important alerts and updates for YOUR TEAM NAME</p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
          {Object.entries(counts).map(([label, count]) => (
            <button
              key={label}
              onClick={() => setFilter(label)}
              className={`px-6 py-2.5 rounded-full font-bold text-[10px] whitespace-nowrap uppercase tracking-widest transition-all
                ${filter === label ? 'bg-[#FF1493] text-on-surface shadow-lg shadow-[#FF1493]/30' : 'bg-on-surface/5 text-on-surface/40 border border-outline-variant/30 hover:bg-on-surface/10 hover:text-primary'}`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-8">
          {/* Critical Alerts */}
          {(filter === 'All Alerts' || filter === 'Critical') && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-red-500 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                  <span className="material-symbols-outlined text-sm">error</span>
                  Critical Alerts
                </h3>
                <span className="text-red-500/60 text-[10px] font-black uppercase tracking-widest">{ALERTS.critical.length} Alerts</span>
              </div>
              <div className="flex flex-col gap-3">
                {ALERTS.critical.map((a) => (
                  <div key={a.id} className="bg-on-surface/5 border border-outline-variant/30 rounded-2xl p-6 flex items-start gap-6 hover:bg-on-surface/10 transition-all group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${a.bg} flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined ${a.color}`}>{a.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-on-surface font-bold text-sm mb-1">{a.title}</h4>
                      <p className="text-on-surface/40 text-xs font-medium mb-3">{a.body}</p>
                      <span className="text-[10px] font-black text-on-surface/20 uppercase tracking-widest">{a.time}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface/20 group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Warnings */}
          {(filter === 'All Alerts' || filter === 'Warnings') && (
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-yellow-500 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                  <span className="material-symbols-outlined text-sm">warning</span>
                  Warnings
                </h3>
                <span className="text-yellow-500/60 text-[10px] font-black uppercase tracking-widest">{ALERTS.warnings.length} Alerts</span>
              </div>
              <div className="flex flex-col gap-3">
                {ALERTS.warnings.map((a) => (
                  <div key={a.id} className="bg-on-surface/5 border border-outline-variant/30 rounded-2xl p-6 flex items-start gap-6 hover:bg-on-surface/10 transition-all group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${a.bg} flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined ${a.color}`}>{a.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-on-surface font-bold text-sm mb-1">{a.title}</h4>
                      <p className="text-on-surface/40 text-xs font-medium mb-3">{a.body}</p>
                      <span className="text-[10px] font-black text-on-surface/20 uppercase tracking-widest">{a.time}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface/20 group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Resolved */}
          {(filter === 'All Alerts' || filter === 'Resolved') && (
            <div className="flex flex-col gap-4 opacity-60 hover:opacity-100 transition-opacity">
              <div className="flex justify-between items-center px-2">
                <h3 className="text-green-500 font-bold flex items-center gap-2 uppercase tracking-widest text-xs">
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  Resolved Alerts
                </h3>
                <span className="text-green-500/60 text-[10px] font-black uppercase tracking-widest">{ALERTS.resolved.length} Alerts</span>
              </div>
              <div className="flex flex-col gap-3">
                {ALERTS.resolved.map((a) => (
                  <div key={a.id} className="bg-on-surface/5 border border-outline-variant/30 rounded-2xl p-6 flex items-start gap-6 hover:bg-on-surface/10 transition-all group cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl ${a.bg} flex items-center justify-center shrink-0`}>
                      <span className={`material-symbols-outlined ${a.color}`}>{a.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-on-surface font-bold text-sm mb-1 line-through opacity-50">{a.title}</h4>
                      <p className="text-on-surface/40 text-xs font-medium mb-3">{a.body}</p>
                      <span className="text-[10px] font-black text-on-surface/20 uppercase tracking-widest">{a.time}</span>
                    </div>
                    <span className="material-symbols-outlined text-on-surface/20 group-hover:text-primary transition-colors">chevron_right</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <button className="w-full bg-[#FF1493] hover:bg-[#C01277] text-on-surface font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            <span className="material-symbols-outlined text-xl">done_all</span>
            Mark All as Read
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}