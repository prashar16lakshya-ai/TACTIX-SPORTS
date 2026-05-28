import { useMemo, useState } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import Toast from '../../components/Toast'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'

const monthLabel = (date) => date.toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
const dateKey = (date) => date.toISOString().slice(0, 10)

export default function Holidays() {
  const { data, setHoliday, appendActivityLog } = useAppData()
  const { user } = useAuth()
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [title, setTitle] = useState('')
  const [reason, setReason] = useState('')
  const [toast, setToast] = useState(null)

  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const first = new Date(year, month, 1)
    const offset = first.getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const cells = []

    for (let i = 0; i < offset; i += 1) cells.push(null)
    for (let d = 1; d <= daysInMonth; d += 1) cells.push(new Date(year, month, d))
    return cells
  }, [viewDate])

  const handleMarkHoliday = () => {
    if (!title.trim() || !reason.trim()) {
      setToast({ message: 'Title and Reason are required.', type: 'error' })
      return
    }
    const key = dateKey(selectedDate)
    
    const holidayData = {
      date: key,
      title: title,
      reason: reason,
      createdBy: user?.name || 'Admin',
      createdAt: new Date().toISOString()
    }

    setHoliday(holidayData)
    appendActivityLog(`Holiday marked: ${title} on ${selectedDate.toLocaleDateString('en-IN')}`, 'holiday')
    setToast({ message: 'Holiday broadcasted successfully!', type: 'success' })
    setTitle('')
    setReason('')
  }

  const isAdmin = user?.role?.toLowerCase() === 'admin'

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-6xl mx-auto w-full">
        <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
        
        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Holiday Management</h1>
            <p className="text-on-surface/50 text-sm">System-wide schedule overrides and breaks.</p>
          </div>
        </div>

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Calendar Section */}
          <section className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center justify-between mb-8">
              <button 
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))} 
                className="w-10 h-10 rounded-xl border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface/5 transition-colors text-on-surface"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <h2 className="text-lg font-black text-on-surface uppercase tracking-widest">{monthLabel(viewDate)}</h2>
              <button 
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))} 
                className="w-10 h-10 rounded-xl border border-outline-variant/30 flex items-center justify-center hover:bg-on-surface/5 transition-colors text-on-surface"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-[10px] font-black uppercase tracking-[0.2em] text-on-surface/20 mb-4">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => <div key={d}>{d}</div>)}
            </div>

            <div className="grid grid-cols-7 gap-2 lg:gap-3">
              {calendarDays.map((day, idx) => {
                if (!day) return <div key={`empty-${idx}`} className="aspect-square lg:h-20 rounded-xl bg-transparent" />
                const key = dateKey(day)
                const holiday = data.holidays?.find(h => h.date === key)
                const isSelected = key === dateKey(selectedDate)
                
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedDate(day)}
                    className={`aspect-square lg:h-20 rounded-xl border text-sm font-bold transition-all relative group
                      ${holiday 
                        ? 'bg-red-500/10 border-red-500/30 text-red-500 shadow-[0_0_10px_rgba(239,68,68,0.1)]' 
                        : 'bg-[#0A0A0A] border-white/5 text-on-surface/60 hover:border-outline-variant/50'
                      } 
                      ${isSelected ? 'ring-2 ring-[#FF1493] border-transparent' : ''}
                    `}
                  >
                    {day.getDate()}
                    {holiday && (
                      <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_#EF4444]"></div>
                    )}
                  </button>
                )
              })}
            </div>

            {isAdmin && (
              <div className="mt-8 pt-8 border-t border-white/5 flex flex-col gap-6">
                {/* Create Holiday Form */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Holiday Title</label>
                  <input 
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Summer Break"
                    className="w-full bg-on-surface/5 border border-outline-variant/30 text-on-surface font-bold px-4 py-3 rounded-xl focus:border-[#FF1493] outline-none transition-all placeholder:text-on-surface/10"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Reason / Description</label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Provide details about the holiday..."
                    rows={4}
                    className="w-full bg-on-surface/5 border border-outline-variant/30 text-on-surface font-medium px-4 py-3 rounded-xl focus:border-[#FF1493] outline-none transition-all placeholder:text-on-surface/10 resize-none"
                  />
                </div>

                <button 
                  onClick={handleMarkHoliday}
                  className="w-full bg-[#FF1493] hover:bg-[#C01277] text-on-surface font-black py-4 rounded-xl shadow-lg transition-all active:scale-95 uppercase tracking-widest text-xs"
                >
                  Broadcast Holiday
                </button>
              </div>
            )}
          </section>

          {/* List Section */}
          <aside className="flex flex-col gap-6">
            <h3 className="text-xs font-black text-on-surface/30 uppercase tracking-[0.3em] pl-2">Upcoming Holidays</h3>
            <div className="flex flex-col gap-3">
              {data.holidays?.length > 0 ? (
                data.holidays
                  .filter(h => h.date && new Date(h.date) >= new Date(new Date().setHours(0,0,0,0)))
                  .sort((a, b) => (a.date || '').localeCompare(b.date || ''))
                  .map((h) => (
                    <div key={h.date} className="p-4 rounded-2xl bg-on-surface/5 border border-white/5 group hover:border-red-500/30 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-red-500 text-[10px] font-black uppercase tracking-widest">Holiday</span>
                        <span className="text-on-surface/20 text-[9px] font-black uppercase tracking-widest">
                          {new Date(h.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                        </span>
                      </div>
                      <p className="font-bold text-on-surface mb-1">{h.reason}</p>
                      <p className="text-xs text-on-surface/40">
                        {new Date(h.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                  ))
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-3xl">
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface/10">No upcoming holidays</p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </DashboardLayout>
  )
}
