import React, { useState } from 'react';
import DashboardLayout from '../../components/dashboard/DashboardLayout';
import { usePermission } from '../../hooks/usePermission';
import { useAppData } from '../../context/AppDataContext';
import { useAuth } from '../../context/AuthContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';

const REPORT_TYPES = [
  { id: 'attendance', label: 'Attendance Report', icon: 'how_to_reg', color: 'text-[#FF1493]' },
  { id: 'performance', label: 'Performance Report', icon: 'trending_up', color: 'text-[#DC143C]' },
  { id: 'match', label: 'Match Report', icon: 'sports_soccer', color: 'text-green-500' },
  { id: 'training', label: 'Training Report', icon: 'fitness_center', color: 'text-yellow-500' },
  { id: 'progress', label: 'Player Progress Report', icon: 'analytics', color: 'text-orange-500' },
  { id: 'announcement', label: 'Announcement Report', icon: 'campaign', color: 'text-pink-500' },
];

export default function ReportsModule() {
  const { isAdmin, isCoach } = usePermission();
  const { data } = useAppData();
  const { user } = useAuth();
  
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [selectedTeam, setSelectedTeam] = useState('All Teams');
  const [selectedPlayer, setSelectedPlayer] = useState('All Players');

  const generateReportData = (type) => {
    if (type === 'attendance') {
      return (data?.players || []).map(p => ({
        name: p.name || 'Unknown',
        team: p.team || p.groupName || 'No Team',
        sessions: p.attendanceStats?.total || 0,
        attended: p.attendanceStats?.present || 0,
        percentage: `${p.attendanceStats?.percentage || 0}%`
      }));
    }
    if (type === 'performance') {
      return (data?.players || []).map(p => ({
        name: p.name || 'Unknown',
        team: p.team || p.groupName || 'No Team',
        score: p.performanceScore || p.score || 0,
        sport: p.sport || 'Unknown'
      }));
    }
    if (type === 'match') {
      return (data?.matches || []).map(m => ({
        title: m.title || 'Match',
        date: m.date || 'Unknown',
        result: m.result || 'Pending',
        score: m.score || '-'
      }));
    }
    if (type === 'training') {
      return (data?.trainings || []).map(t => ({
        title: t.title || 'Training',
        date: t.date || 'Unknown',
        focus: t.focus || t.type || 'General'
      }));
    }
    if (type === 'progress') {
      return (data?.players || []).map(p => ({
        name: p.name || 'Unknown',
        team: p.team || p.groupName || 'No Team',
        improvements: p.improvements || 'Steady',
        status: p.status || 'Active'
      }));
    }
    if (type === 'announcement') {
      return (data?.announcements || []).map(a => ({
        title: a.title || 'Announcement',
        date: a.date || 'Unknown',
        audience: a.audience || 'All'
      }));
    }
    return [];
  }

  const handleDownloadPdf = (reportLabel, dataList) => {
    const doc = new jsPDF();
    doc.text(`${reportLabel}`, 14, 15);
    
    if(dataList && dataList.length > 0) {
      const headers = Object.keys(dataList[0]).map(k => k.toUpperCase());
      const rows = dataList.map(d => Object.values(d));
      
      doc.autoTable({
        head: [headers],
        body: rows,
        startY: 20,
      });
    }
    doc.save(`${reportLabel.replace(/ /g, '_')}.pdf`);
  }

  const handleDownloadExcel = (reportLabel, dataList) => {
    const worksheet = XLSX.utils.json_to_sheet(dataList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
    XLSX.writeFile(workbook, `${reportLabel.replace(/ /g, '_')}.xlsx`);
  }

  const teamsList = [...new Set((data?.players || []).map(p => p.team).filter(Boolean))];
  const playersList = (data?.players || []).map(p => p.name).filter(Boolean);

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-7xl mx-auto w-full">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Broadcast & Reports</h1>
            <p className="text-on-surface/50 text-sm">System-wide tactical data and performance insights.</p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-3 bg-on-surface/5 p-2 rounded-2xl border border-outline-variant/30">
            <div className="relative">
              <select 
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="bg-[#0A0A0A] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-on-surface outline-none focus:border-[#FF1493] appearance-none cursor-pointer pr-10"
              >
                <option>Today</option>
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>This Season</option>
              </select>
              <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/30 pointer-events-none text-sm">expand_more</span>
            </div>

            {(isAdmin || isCoach) && (
              <div className="relative">
                <select 
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="bg-[#0A0A0A] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-on-surface outline-none focus:border-[#FF1493] appearance-none cursor-pointer pr-10"
                >
                  <option>All Teams</option>
                  {teamsList.map(t => <option key={t}>{t}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/30 pointer-events-none text-sm">expand_more</span>
              </div>
            )}

            {isCoach && (
              <div className="relative">
                <select 
                  value={selectedPlayer}
                  onChange={(e) => setSelectedPlayer(e.target.value)}
                  className="bg-[#0A0A0A] border border-outline-variant/30 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-on-surface outline-none focus:border-[#FF1493] appearance-none cursor-pointer pr-10"
                >
                  <option>All Players</option>
                  {playersList.map(p => <option key={p}>{p}</option>)}
                </select>
                <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface/30 pointer-events-none text-sm">expand_more</span>
              </div>
            )}
          </div>
        </div>

        {/* Report Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {REPORT_TYPES.map((report) => (
            <div 
              key={report.id}
              className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-6 lg:p-8 hover:border-[#FF1493]/30 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-on-surface/5 flex items-center justify-center border border-outline-variant/30 group-hover:bg-[#FF1493]/10 transition-colors">
                  <span className={`material-symbols-outlined text-3xl ${report.color}`}>{report.icon}</span>
                </div>
                <div className="flex gap-2 relative z-20">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const dataList = generateReportData(report.id);
                      handleDownloadPdf(report.label, dataList);
                    }}
                    className="bg-on-surface/5 hover:bg-[#FF1493]/20 text-[#FF1493] px-3 py-2 rounded-xl border border-outline-variant/30 transition-all active:scale-95 flex items-center justify-center gap-1"
                    title="Download PDF"
                  >
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                    <span className="text-[10px] font-black uppercase">PDF</span>
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const dataList = generateReportData(report.id);
                      handleDownloadExcel(report.label, dataList);
                    }}
                    className="bg-on-surface/5 hover:bg-green-500/20 text-green-500 px-3 py-2 rounded-xl border border-outline-variant/30 transition-all active:scale-95 flex items-center justify-center gap-1"
                    title="Download Excel"
                  >
                    <span className="material-symbols-outlined text-[16px]">table_chart</span>
                    <span className="text-[10px] font-black uppercase">XLS</span>
                  </button>
                </div>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-xl font-black text-on-surface mb-2 uppercase tracking-tight">{report.label}</h3>
                <p className="text-[10px] text-on-surface/30 leading-relaxed uppercase tracking-[0.2em] font-black">
                  {isAdmin ? 'System-wide analytics' : 'Team-level tactical data'}
                </p>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/5 flex justify-between items-center relative z-10">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black uppercase tracking-[0.2em] text-on-surface/20">Status</span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Live Sync</span>
                </div>
                <button className="text-[#FF1493] text-[10px] font-black uppercase tracking-[0.3em] hover:underline">View Live</button>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State / Info */}
        <div className="mt-8 p-8 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center justify-center gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-on-surface/5 flex items-center justify-center">
            <span className="material-symbols-outlined text-3xl text-on-surface/10">analytics</span>
          </div>
          <p className="text-on-surface/30 text-sm max-w-md leading-relaxed">
            Select a report category to view detailed analytics. Reports are automatically synchronized with latest system activity.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
