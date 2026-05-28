import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import BottomNav from '../../components/BottomNav'
import Toast from '../../components/Toast'
import { generateParentReportPDF, sharePDF } from '../../utils/pdfShare'

const DEMO_PLAYER = { name: 'Priya Sharma', team: 'Cheetah XI', school: 'Delhi Public School, Gurugram', sport: 'Cricket', class: '11-A' }
const DEMO_ATTENDANCE = { present: 24, absent: 4, holidays: 2, total: 30, percentage: 86 }
const DEMO_PERFORMANCE = [
  { date: 'May 01', score: 78 }, { date: 'May 05', score: 82 }, { date: 'May 10', score: 85 },
  { date: 'May 15', score: 88 }, { date: 'May 20', score: 91 }, { date: 'May 25', score: 94 },
]
const DEMO_REMARKS = [
  { date: 'May 22', text: 'Excellent improvement in batting technique. Shows great potential.' },
  { date: 'May 15', text: 'Good leadership during practice. Needs to work on fielding.' },
  { date: 'May 08', text: 'Consistent performer. Recommended for district selection trials.' },
]
const DEMO_FITNESS = {
  beepTest: { score: 8.5, avg: 7.9, status: 'above' },
  pushups: { score: 30, avg: 26, status: 'above' },
  sitAndReach: { score: 32, avg: 28, status: 'above' },
}

export default function ParentReportCard() {
  const [searchParams] = useSearchParams()
  const { user } = useAuth()
  const { isDemoMode } = useAppData()
  const [toast, setToast] = useState(null)
  const [generating, setGenerating] = useState(false)

  const player = DEMO_PLAYER
  const attendance = DEMO_ATTENDANCE
  const performance = DEMO_PERFORMANCE
  const remarks = DEMO_REMARKS
  const fitness = DEMO_FITNESS

  const attColor = attendance.percentage > 75 ? 'text-green-500' : attendance.percentage > 50 ? 'text-yellow-500' : 'text-red-500'
  const attBg = attendance.percentage > 75 ? 'bg-green-500' : attendance.percentage > 50 ? 'bg-yellow-500' : 'bg-red-500'

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const doc = generateParentReportPDF({
        playerName: player.name,
        teamName: player.team,
        schoolName: player.school,
        attendanceData: attendance,
        performanceData: performance,
        remarks,
        fitnessResults: fitness,
      })

      const result = await sharePDF(doc, `${player.name.replace(/\s+/g, '_')}_report_${new Date().toISOString().slice(0, 10)}.pdf`)

      if (result.shared) {
        setToast({ message: 'PDF shared successfully!', type: 'success' })
      } else if (result.downloaded) {
        setToast({ message: 'PDF downloaded!', type: 'success' })
      }
    } catch (error) {
      console.error('PDF generation error:', error)
      setToast({ message: 'Failed to generate PDF', type: 'error' })
    } finally {
      setGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 max-w-3xl mx-auto w-full">
        <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-on-surface uppercase tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-[#FF1493] text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>description</span>
            Parent Report Card
          </h1>
          <p className="text-on-surface/40 text-sm mt-1">Preview and generate a shareable PDF report</p>
        </div>

        {/* Report Preview Card */}
        <div className="bg-on-surface/5 backdrop-blur-xl border border-outline-variant/30 rounded-2xl overflow-hidden">
          {/* Report Header */}
          <div className="bg-gradient-to-r from-[#DC143C] to-[#FF1493] p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white font-black text-xl tracking-tight">TACTIX SPORT</h2>
                <p className="text-white/70 text-xs mt-1">{player.school}</p>
                <p className="text-white/50 text-[10px] uppercase tracking-widest mt-2">Student Performance Report Card</p>
              </div>
              <div className="text-right">
                <p className="text-white/50 text-[10px] uppercase tracking-widest">Generated</p>
                <p className="text-white text-sm font-bold">{new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</p>
              </div>
            </div>
          </div>

          <div className="p-6 flex flex-col gap-6">
            {/* Player Info */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-[#DC143C]/20 border-2 border-[#DC143C]/30 flex items-center justify-center text-[#DC143C] font-black text-xl">
                {player.name.split(' ').map(n => n[0]).join('')}
              </div>
              <div>
                <h3 className="text-on-surface font-black text-lg">{player.name}</h3>
                <p className="text-on-surface/50 text-xs">{player.team} · {player.sport} · Class {player.class}</p>
              </div>
            </div>

            {/* Attendance */}
            <div>
              <h4 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF1493] text-[18px]">how_to_reg</span>
                Attendance (Last 30 Days)
              </h4>
              <div className="grid grid-cols-4 gap-3 mb-4">
                {[
                  { label: 'Present', value: attendance.present, color: 'text-green-500' },
                  { label: 'Absent', value: attendance.absent, color: 'text-red-500' },
                  { label: 'Holidays', value: attendance.holidays, color: 'text-yellow-500' },
                  { label: 'Rate', value: `${attendance.percentage}%`, color: attColor },
                ].map(s => (
                  <div key={s.label} className="bg-[#0A0A0A]/50 border border-white/5 rounded-xl p-3 text-center">
                    <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-on-surface/40 uppercase tracking-wider font-bold mt-1">{s.label}</p>
                  </div>
                ))}
              </div>
              {/* Attendance bar */}
              <div className="h-3 w-full bg-on-surface/10 rounded-full overflow-hidden">
                <div className={`h-full ${attBg} rounded-full transition-all animate-fill-bar`} style={{ width: `${attendance.percentage}%` }} />
              </div>
            </div>

            {/* Performance Trend */}
            <div>
              <h4 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500 text-[18px]">trending_up</span>
                Performance Trend
              </h4>
              <div className="flex items-end gap-2 h-24 px-2">
                {performance.map((p, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <div
                      className="w-full bg-gradient-to-t from-[#DC143C] to-[#FF1493] rounded-t-lg transition-all animate-fill-bar"
                      style={{ height: `${p.score}%`, maxHeight: '100%' }}
                    />
                    <span className="text-[8px] text-on-surface/30 font-bold">{p.date.split(' ')[1]}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-3 text-[10px]">
                <span className="text-on-surface/40">Avg: <strong className="text-on-surface">{Math.round(performance.reduce((a, b) => a + b.score, 0) / performance.length)}/100</strong></span>
                <span className="text-green-500 font-bold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[12px]">trending_up</span> Improving
                </span>
              </div>
            </div>

            {/* Coach Remarks */}
            <div>
              <h4 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#FF1493] text-[18px]">format_quote</span>
                Coach Remarks
              </h4>
              <div className="flex flex-col gap-3">
                {remarks.map((r, i) => (
                  <div key={i} className="bg-[#0A0A0A]/50 border border-white/5 rounded-xl p-4">
                    <p className="text-on-surface/70 text-sm italic">"{r.text}"</p>
                    <p className="text-on-surface/30 text-[10px] mt-2 font-bold">{r.date}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Fitness Results */}
            <div>
              <h4 className="text-on-surface font-bold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-[#DC143C] text-[18px]">fitness_center</span>
                Fitness Test Results
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {Object.entries(fitness).map(([key, val]) => {
                  const label = key === 'beepTest' ? 'Beep Test Level' : key === 'pushups' ? 'Push-up Count' : 'Sit & Reach (cm)'
                  const statusColor = val.status === 'above' ? 'text-green-500 bg-green-500/10 border-green-500/20' : val.status === 'below' ? 'text-red-500 bg-red-500/10 border-red-500/20' : 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20'
                  const statusLabel = val.status === 'above' ? 'Above Avg' : val.status === 'below' ? 'Below Avg' : 'Average'
                  return (
                    <div key={key} className="bg-[#0A0A0A]/50 border border-white/5 rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <p className="text-on-surface font-bold text-sm">{label}</p>
                        <p className="text-on-surface/40 text-xs mt-0.5">Team Avg: {val.avg}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-on-surface font-black text-lg">{val.score}</span>
                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border ${statusColor}`}>{statusLabel}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-white/5 pt-4 flex justify-between text-[10px] text-on-surface/20">
              <span>Generated by TACTIX Sport</span>
              <span>Confidential</span>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="w-full h-14 bg-[#DC143C] text-on-surface font-black uppercase tracking-widest text-sm rounded-xl hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 animate-pulse-glow"
        >
          {generating ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Generating PDF...
            </>
          ) : (
            <>
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>picture_as_pdf</span>
              Generate & Share PDF
            </>
          )}
        </button>
      </div>
      <BottomNav />
    </DashboardLayout>
  )
}
