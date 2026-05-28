import { useState } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'

export default function AdvancedCalendar() {
  // Static mock for the design
  const [selectedDay, setSelectedDay] = useState(15)

  const calendarDays = [
    { day: 26, current: false }, { day: 27, current: false }, { day: 28, current: false }, { day: 29, current: false }, { day: 30, current: false }, { day: 1, current: true, dots: ['purple', 'blue'] }, { day: 2, current: true, dots: ['blue'] },
    { day: 3, current: true, dots: ['purple'] }, { day: 4, current: true, dots: ['green'] }, { day: 5, current: true, dots: ['blue'] }, { day: 6, current: true, dots: ['green'] }, { day: 7, current: true, dots: ['green'] }, { day: 8, current: true, dots: ['purple'] }, { day: 9, current: true, dots: ['green'] },
    { day: 10, current: true, dots: ['purple'] }, { day: 11, current: true }, { day: 12, current: true, dots: ['blue', 'blue'] }, { day: 13, current: true }, { day: 14, current: true }, { day: 15, current: true, active: true }, { day: 16, current: true, dots: ['green'] },
    { day: 17, current: true }, { day: 18, current: true }, { day: 19, current: true }, { day: 20, current: true }, { day: 21, current: true }, { day: 22, current: true, dots: ['purple'] }, { day: 23, current: true },
    { day: 24, current: true, dots: ['green', 'purple'] }, { day: 25, current: true, dots: ['purple', 'blue'] }, { day: 26, current: true, dots: ['blue'] }, { day: 27, current: true, dots: ['purple'] }, { day: 28, current: true, dots: ['purple'] }, { day: 29, current: true, dots: ['purple'] }, { day: 30, current: true, dots: ['purple'] },
    { day: 31, current: true }, { day: 1, current: false }, { day: 2, current: false }, { day: 3, current: false }, { day: 4, current: false }, { day: 5, current: false }, { day: 6, current: false },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-md mx-auto xl:max-w-5xl xl:grid xl:grid-cols-2 xl:gap-12 items-start">
        
        {/* Left Column (Calendar Grid) */}
        <div>
          <div className="flex items-center justify-between mb-8">
            <button className="text-on-surface hover:text-[#FF1493] transition-colors"><span className="material-symbols-outlined">menu</span></button>
            <h1 className="text-on-surface font-bold text-lg">Calendar</h1>
            <div className="w-6"></div>
          </div>

          <div className="flex items-center justify-between mb-8">
            <button className="text-on-surface hover:text-[#FF1493]"><span className="material-symbols-outlined">chevron_left</span></button>
            <h2 className="text-on-surface font-bold text-lg">May 2026</h2>
            <button className="text-on-surface hover:text-[#FF1493]"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>

          <div className="grid grid-cols-7 gap-y-6 text-center mb-8">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
              <div key={d} className="text-on-surface/50 text-xs font-medium">{d}</div>
            ))}
            
            {calendarDays.map((date, i) => (
              <div key={i} className="flex flex-col items-center gap-1 cursor-pointer" onClick={() => date.current && setSelectedDay(date.day)}>
                <div className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-bold transition-colors
                  ${date.active ? 'bg-green-500 text-black' : (date.current ? 'text-on-surface hover:bg-on-surface/10' : 'text-on-surface/20')}
                `}>
                  {date.day}
                </div>
                <div className="flex gap-0.5 h-1">
                  {date.dots && date.dots.map((dot, j) => (
                    <span key={j} className={`w-1.5 h-1.5 rounded-full ${
                      dot === 'green' ? 'bg-green-500' : dot === 'blue' ? 'bg-[#FF1493]' : 'bg-[#DC143C]'
                    }`}></span>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="bg-on-surface/5 border border-outline-variant/30 rounded-xl p-4 flex justify-between items-center mb-8 xl:mb-0">
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span><span className="text-green-500 text-sm font-medium">Match</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#FF1493]"></span><span className="text-[#FF1493] text-sm font-medium">Training</span></div>
            <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-[#DC143C]"></span><span className="text-[#DC143C] text-sm font-medium">Holiday</span></div>
          </div>
        </div>

        {/* Right Column (Day Details) */}
        <div className="bg-on-surface/5 border border-outline-variant/30 rounded-2xl p-6">
          <h3 className="text-on-surface font-bold mb-6">Friday, 15 May 2026</h3>
          
          <div className="space-y-4">
            {/* Event 1 */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
              <div className="w-10 h-10 rounded-lg bg-green-500/10 text-green-500 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">local_police</span>
              </div>
              <div className="flex-1">
                <h4 className="text-on-surface font-bold text-sm">Match vs Greenfield High</h4>
                <p className="text-on-surface/50 text-xs">Inter School Championship</p>
              </div>
              <span className="text-on-surface/40 text-xs font-medium">4:00 PM</span>
            </div>

            {/* Event 2 */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FF1493]"></div>
              <div className="w-10 h-10 rounded-lg bg-[#FF1493]/10 text-[#FF1493] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">fitness_center</span>
              </div>
              <div className="flex-1">
                <h4 className="text-on-surface font-bold text-sm">Training Session</h4>
                <p className="text-on-surface/50 text-xs">Endurance Training</p>
              </div>
              <span className="text-on-surface/40 text-xs font-medium">7:00 AM</span>
            </div>

            {/* Event 3 */}
            <div className="bg-[#0A0A0A] border border-white/5 rounded-xl p-4 flex items-center gap-4 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#DC143C]"></div>
              <div className="w-10 h-10 rounded-lg bg-[#DC143C]/10 text-[#DC143C] flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined">star</span>
              </div>
              <div className="flex-1">
                <h4 className="text-on-surface font-bold text-sm">Holiday</h4>
                <p className="text-on-surface/50 text-xs">Eid-ul-Fitr</p>
              </div>
              <span className="text-on-surface/40 text-xs font-medium">All Day</span>
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  )
}
