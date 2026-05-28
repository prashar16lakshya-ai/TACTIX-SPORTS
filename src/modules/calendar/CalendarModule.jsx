import { useState, useMemo } from 'react'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'

// ─── Types ─────────────────────────────────────────────────────────────────
const EVENT_TYPES = {
  match:    { label: 'Match',    color: 'bg-[#FF1493]',  dot: 'bg-[#FF1493]',  text: 'text-[#0A0A0A]', icon: 'sports'          },
  training: { label: 'Training', color: 'bg-[#FF1493]',  dot: 'bg-[#FF1493]',  text: 'text-on-surface',      icon: 'fitness_center'  },
  deadline: { label: 'Deadline', color: 'bg-red-500',    dot: 'bg-red-500',    text: 'text-on-surface',      icon: 'assignment_late' },
  holiday:  { label: 'Holiday',  color: 'bg-orange-400', dot: 'bg-orange-400', text: 'text-on-surface',      icon: 'celebration'     },
  event:    { label: 'Event',    color: 'bg-emerald-500',dot: 'bg-emerald-500',text: 'text-on-surface',      icon: 'event'           },
}

const DAYS_OF_WEEK = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const toDateKey = (date) => {
  const d = new Date(date)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const todayKey = toDateKey(new Date())

// ─── Add Event Modal ────────────────────────────────────────────────────────
function AddEventModal({ initialDate, onClose, onAdd }) {
  const [form, setForm] = useState({
    title: '',
    type: 'event',
    date: initialDate || todayKey,
    endDate: '',
    time: '',
    description: '',
    team: '',
  })
  const [error, setError] = useState('')

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = () => {
    if (!form.title.trim()) return setError('Event title is required.')
    if (!form.date) return setError('Please select a start date.')
    if (form.endDate && form.endDate < form.date) return setError('End date cannot be before start date.')
    setError('')
    onAdd({ ...form, id: `evt-${Date.now()}`, title: form.title.trim(), endDate: form.endDate || form.date })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#0D0D1A] border border-outline-variant/30 rounded-3xl p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF1493]/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-[#FF1493] text-[20px]">add_circle</span>
            </div>
            <div>
              <h2 className="text-on-surface font-bold text-lg leading-none">Add to Calendar</h2>
              <p className="text-on-surface/40 text-xs mt-0.5">Create event or holiday</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-on-surface/5 hover:bg-on-surface/10 rounded-xl flex items-center justify-center text-on-surface/40 hover:text-primary transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Type Selector */}
        <div className="mb-5">
          <p className="text-on-surface/50 text-xs uppercase tracking-widest mb-2">Type</p>
          <div className="grid grid-cols-5 gap-2">
            {Object.entries(EVENT_TYPES).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => set('type', key)}
                className={`flex flex-col items-center gap-1.5 py-2 rounded-xl border transition-all text-xs font-bold
                  ${form.type === key
                    ? `${cfg.color} border-transparent text-[#0A0A0A] shadow-lg`
                    : 'bg-on-surface/5 border-outline-variant/30 text-on-surface/40 hover:border-outline-variant/50 hover:text-primary'
                  }`}
              >
                <span className="material-symbols-outlined text-[18px]">{cfg.icon}</span>
                <span className="text-[9px] uppercase tracking-wide leading-none">{cfg.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          {/* Title */}
          <div>
            <label className="text-on-surface/50 text-xs uppercase tracking-widest mb-1.5 block">Title *</label>
            <input
              autoFocus
              type="text"
              placeholder={form.type === 'holiday' ? 'e.g. Diwali Break' : 'e.g. District Match vs. KV'}
              value={form.title}
              onChange={e => set('title', e.target.value)}
              className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface text-sm placeholder:text-on-surface/20 focus:outline-none focus:border-[#FF1493]/60 transition-colors"
            />
          </div>

          {/* Date Range */}
          <div className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-on-surface/50 text-xs uppercase tracking-widest mb-1.5 block">Start Date *</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={e => {
                    set('date', e.target.value)
                    if (form.endDate && e.target.value > form.endDate) set('endDate', e.target.value)
                  }}
                  className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-[#FF1493]/60 transition-colors [color-scheme:dark]"
                />
              </div>
              <div>
                <label className="text-on-surface/50 text-xs uppercase tracking-widest mb-1.5 block">End Date</label>
                <input
                  type="date"
                  value={form.endDate}
                  min={form.date}
                  onChange={e => set('endDate', e.target.value)}
                  className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-[#FF1493]/60 transition-colors [color-scheme:dark]"
                />
              </div>
            </div>
            {/* Duration hint */}
            {form.endDate && form.endDate !== form.date && (
              <div className="flex items-center gap-2 px-3 py-2 bg-[#FF1493]/10 border border-[#FF1493]/20 rounded-xl">
                <span className="material-symbols-outlined text-[#FF1493] text-[16px]">date_range</span>
                <p className="text-[#FF1493] text-xs font-medium">
                  {(() => {
                    const diff = Math.round((new Date(form.endDate) - new Date(form.date)) / 86400000)
                    return `${diff + 1} day${diff > 0 ? 's' : ''} total`
                  })()}
                </p>
              </div>
            )}
            <div>
              <label className="text-on-surface/50 text-xs uppercase tracking-widest mb-1.5 block">Start Time <span className="text-on-surface/20 normal-case tracking-normal">(optional)</span></label>
              <input
                type="time"
                value={form.time}
                onChange={e => set('time', e.target.value)}
                className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface text-sm focus:outline-none focus:border-[#FF1493]/60 transition-colors [color-scheme:dark]"
              />
            </div>
          </div>

          {/* Team (optional) */}
          <div>
            <label className="text-on-surface/50 text-xs uppercase tracking-widest mb-1.5 block">Team / Group <span className="text-on-surface/20 normal-case tracking-normal">(optional)</span></label>
            <input
              type="text"
              placeholder="e.g. Cheetah XI, All Teams"
              value={form.team}
              onChange={e => set('team', e.target.value)}
              className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface text-sm placeholder:text-on-surface/20 focus:outline-none focus:border-[#FF1493]/60 transition-colors"
            />
          </div>

          {/* Description (optional) */}
          <div>
            <label className="text-on-surface/50 text-xs uppercase tracking-widest mb-1.5 block">Notes <span className="text-on-surface/20 normal-case tracking-normal">(optional)</span></label>
            <textarea
              rows={2}
              placeholder="Any additional details..."
              value={form.description}
              onChange={e => set('description', e.target.value)}
              className="w-full bg-on-surface/5 border border-outline-variant/30 rounded-xl px-4 py-3 text-on-surface text-sm placeholder:text-on-surface/20 focus:outline-none focus:border-[#FF1493]/60 transition-colors resize-none"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-400 text-sm mt-4 px-1">{error}</p>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-on-surface/5 hover:bg-on-surface/10 border border-outline-variant/30 text-on-surface/60 font-bold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-3 rounded-xl bg-[#FF1493] hover:bg-[#C01277] text-on-surface font-bold transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] active:scale-[0.98]"
          >
            Add to Calendar
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Day Detail Panel ───────────────────────────────────────────────────────
function DayPanel({ dateKey, events, onClose, onAdd, onDelete, canEdit }) {
  const date = new Date(dateKey + 'T00:00:00')
  const label = date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })
  const isToday = dateKey === todayKey

  return (
    <div className="bg-on-surface/5 border border-outline-variant/30 rounded-2xl p-5 flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className={`text-xs uppercase tracking-widest font-bold mb-0.5 ${isToday ? 'text-[#FF1493]' : 'text-on-surface/40'}`}>
            {isToday ? '🟣 Today' : 'Selected Day'}
          </p>
          <h3 className="text-on-surface font-bold text-base leading-tight">{label}</h3>
        </div>
        <div className="flex items-center gap-2">
          {canEdit && (
            <button
              onClick={onAdd}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#FF1493]/20 hover:bg-[#FF1493]/30 border border-[#FF1493]/30 rounded-xl text-[#FF1493] text-xs font-bold transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">add</span>
              Add
            </button>
          )}
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center text-on-surface/30 hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>

      {/* Events */}
      {events.length === 0 ? (
        <div className="flex flex-col items-center py-6 text-center gap-2">
          <span className="material-symbols-outlined text-on-surface/10 text-4xl">event_available</span>
          <p className="text-on-surface/30 text-sm">No events on this day.</p>
          {canEdit && (
            <button
              onClick={onAdd}
              className="mt-1 text-[#FF1493] text-xs font-bold hover:underline"
            >
              + Add first event
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map(ev => {
            const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.event
            const isMultiDay = ev.date !== (ev.endDate || ev.date)
            return (
              <div key={ev.id} className="flex items-start gap-3 group">
                <div className={`w-2 h-full min-h-[40px] rounded-full ${cfg.dot} flex-shrink-0 mt-1`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wide ${cfg.color} ${cfg.text}`}>
                      {cfg.label}
                    </span>
                    {ev.time && <span className="text-on-surface/30 text-xs">{ev.time}</span>}
                  </div>
                  <p className="text-on-surface font-bold text-sm mt-1">{ev.title}</p>
                  {/* Date range */}
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="material-symbols-outlined text-on-surface/30 text-[14px]">date_range</span>
                    <span className="text-on-surface/40 text-xs font-medium">
                      {formatDateRange(ev.date, ev.endDate)}
                      {isMultiDay && (() => {
                        const diff = Math.round((new Date(ev.endDate) - new Date(ev.date)) / 86400000)
                        return <span className="ml-1 text-on-surface/20">({diff + 1} days)</span>
                      })()}
                    </span>
                  </div>
                  {ev.team && <p className="text-on-surface/40 text-xs mt-0.5">{ev.team}</p>}
                  {ev.description && <p className="text-on-surface/30 text-xs mt-1 italic">{ev.description}</p>}
                </div>
                {canEdit && !ev.id?.startsWith('h-') && (
                  <button
                    onClick={() => onDelete(ev.id)}
                    className="opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all flex-shrink-0"
                  >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatDateRange(startDate, endDate) {
  const s = new Date(startDate + 'T00:00:00')
  const e = new Date((endDate || startDate) + 'T00:00:00')
  const sLabel = s.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  const eLabel = e.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  if (startDate === (endDate || startDate)) return sLabel
  return `${sLabel} → ${eLabel}`
}

function isInRange(dateKey, startDate, endDate) {
  const end = endDate || startDate
  return dateKey >= startDate && dateKey <= end
}
export default function CalendarModule() {
  const { data, setHoliday, updateData } = useAppData()
  const { user } = useAuth()
  const canEdit = user?.role === 'admin' || user?.role === 'coach'

  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [modalDate, setModalDate] = useState(null)

  // ── Merge holidays + custom events ──
  const allEvents = useMemo(() => {
    const holidayEvents = (data.holidays || []).map(h => ({
      id: `h-${h.date}`,
      title: h.title || h.reason || 'School Holiday',
      type: 'holiday',
      date: h.date,
      endDate: h.endDate || h.date,
      time: 'Full Day',
      team: 'All',
    }))
    const customEvents = (data.calendarEvents || []).map(e => ({ ...e, endDate: e.endDate || e.date }))
    return [...holidayEvents, ...customEvents].sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  }, [data.holidays, data.calendarEvents])

  // ── Calendar grid ──
  const calendarDays = useMemo(() => {
    const year = viewDate.getFullYear()
    const month = viewDate.getMonth()
    const firstDay = new Date(year, month, 1).getDay()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const days = []
    for (let i = 0; i < firstDay; i++) days.push(null)
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i))
    return days
  }, [viewDate])

  const monthName = viewDate.toLocaleString('default', { month: 'long' })
  const year = viewDate.getFullYear()

  const navigate = (dir) => {
    const d = new Date(viewDate)
    d.setMonth(d.getMonth() + dir)
    setViewDate(d)
  }

  const handleAddEvent = (eventData) => {
    if (eventData.type === 'holiday') {
      setHoliday({ date: eventData.date, endDate: eventData.endDate, title: eventData.title, reason: eventData.description || eventData.title })
    } else {
      updateData(prev => ({
        ...prev,
        calendarEvents: [...(prev.calendarEvents || []), eventData],
      }))
    }
    setSelectedDate(eventData.date)
  }

  const handleDeleteEvent = (id) => {
    updateData(prev => ({
      ...prev,
      calendarEvents: (prev.calendarEvents || []).filter(e => e.id !== id),
    }))
  }

  const selectedEvents = selectedDate
    ? allEvents.filter(e => isInRange(selectedDate, e.date, e.endDate))
    : []

  // Upcoming events list (next 30 days) — include multi-day events that overlap
  const upcomingEvents = useMemo(() => {
    const now = todayKey
    const cutoff = toDateKey(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000))
    return allEvents
      .filter(e => (e.endDate || e.date) >= now && e.date <= cutoff)
      .slice(0, 8)
  }, [allEvents])

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 pb-20">

        {/* ── Header ────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-on-surface tracking-tight">Sports Calendar</h1>
            <p className="text-on-surface/40 text-sm mt-1">Upcoming matches, trainings, events & holidays.</p>
          </div>
          <div className="flex items-center gap-3">
            {canEdit && (
              <button
                onClick={() => { setModalDate(todayKey); setShowModal(true) }}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#FF1493] hover:bg-[#C01277] text-on-surface text-sm font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">add</span>
                Add Event
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-8">
          {/* ── Left: Calendar ─────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Month nav */}
            <div className="flex items-center justify-between bg-on-surface/5 border border-outline-variant/30 rounded-2xl px-4 py-3">
              <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-on-surface/10 text-on-surface transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <div className="text-center">
                <p className="text-on-surface font-black text-base uppercase tracking-widest">{monthName}</p>
                <p className="text-on-surface/30 text-xs">{year}</p>
              </div>
              <button onClick={() => navigate(1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-on-surface/10 text-on-surface transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>

            {/* Grid */}
            <div className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl overflow-hidden">
              {/* Day headers */}
              <div className="grid grid-cols-7 border-b border-outline-variant/30 bg-white/[0.03]">
                {DAYS_OF_WEEK.map(d => (
                  <div key={d} className="py-4 text-center text-[10px] font-black text-on-surface/30 uppercase tracking-[0.2em]">{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div className="grid grid-cols-7">
                {calendarDays.map((date, i) => {
                  if (!date) return <div key={`e-${i}`} className="aspect-square border-r border-b border-white/5 bg-black/10" />

                  const dk = toDateKey(date)
                  // Events whose range covers this day
                  const dayEvts = allEvents.filter(e => isInRange(dk, e.date, e.endDate))
                  // Events that START on this day (for pills)
                  const startEvts = allEvents.filter(e => e.date === dk)
                  const isToday = dk === todayKey
                  const isSelected = dk === selectedDate

                  return (
                    <button
                      key={dk}
                      onClick={() => setSelectedDate(prev => prev === dk ? null : dk)}
                      className={`aspect-square p-1.5 md:p-2 border-r border-b border-white/5 hover:bg-on-surface/5 transition-colors relative flex flex-col items-start
                        ${isSelected ? 'bg-[#FF1493]/10 border-[#FF1493]/20' : ''}
                      `}
                    >
                      {/* Date number */}
                      <span className={`w-6 h-6 md:w-7 md:h-7 flex items-center justify-center rounded-lg text-xs font-bold transition-all z-10 relative
                        ${isToday ? 'bg-[#FF1493] text-on-surface shadow-lg shadow-[#FF1493]/40' :
                          isSelected ? 'bg-[#FF1493]/30 text-on-surface' : 'text-on-surface/40 hover:text-primary'}
                      `}>
                        {date.getDate()}
                      </span>

                      {/* Multi-day range bands */}
                      <div className="absolute inset-0 flex flex-col gap-[2px] pt-8 px-0.5 pb-0.5 pointer-events-none">
                        {dayEvts.slice(0, 3).map((ev, idx) => {
                          const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.event
                          const isStart = ev.date === dk
                          const isEnd = (ev.endDate || ev.date) === dk
                          const isMultiDay = ev.date !== (ev.endDate || ev.date)
                          return (
                            <div
                              key={idx}
                              className={`h-1.5 ${cfg.dot} opacity-80
                                ${isMultiDay ? (
                                  isStart ? 'rounded-l-full mr-0' :
                                  isEnd   ? 'rounded-r-full ml-0' :
                                            'rounded-none mx-0'
                                ) : 'rounded-full mx-0.5'}
                              `}
                            />
                          )
                        })}
                      </div>

                      {/* Event pills on start day (larger screens) */}
                      <div className="hidden lg:flex flex-col gap-0.5 w-full mt-1 z-10 relative">
                        {startEvts.slice(0, 2).map((ev, idx) => {
                          const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.event
                          return (
                            <div key={idx} className={`px-1.5 py-0.5 rounded-md text-[9px] font-bold truncate ${cfg.color} ${cfg.text} w-full text-left`}>
                              {ev.title}
                            </div>
                          )
                        })}
                        {startEvts.length > 2 && (
                          <span className="text-[9px] text-on-surface/30 font-bold px-1">+{startEvts.length - 2} more</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Legend */}
            <div className="flex flex-wrap items-center gap-4 px-1">
              {Object.entries(EVENT_TYPES).map(([type, cfg]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
                  <span className="text-[10px] font-bold text-on-surface/30 uppercase tracking-widest">{cfg.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Right: Panel ───────────────────────────────────── */}
          <div className="flex flex-col gap-6">
            {/* Selected Day Panel */}
            {selectedDate ? (
              <DayPanel
                dateKey={selectedDate}
                events={selectedEvents}
                onClose={() => setSelectedDate(null)}
                onAdd={() => { setModalDate(selectedDate); setShowModal(true) }}
                onDelete={handleDeleteEvent}
                canEdit={canEdit}
              />
            ) : (
              <div className="bg-on-surface/5 border border-dashed border-outline-variant/30 rounded-2xl p-6 flex flex-col items-center justify-center text-center gap-3">
                <span className="material-symbols-outlined text-on-surface/10 text-5xl">touch_app</span>
                <p className="text-on-surface/30 text-sm">Click any day on the calendar to see or add events.</p>
              </div>
            )}

            {/* Upcoming Events */}
            <div className="bg-on-surface/5 border border-outline-variant/30 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#FF1493] text-[20px]">upcoming</span>
                  <h3 className="text-on-surface font-bold">Upcoming (30 days)</h3>
                </div>
                <span className="text-on-surface/30 text-xs font-bold">{upcomingEvents.length} events</span>
              </div>

              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center py-6 gap-2 text-center">
                  <span className="material-symbols-outlined text-on-surface/10 text-4xl">event_busy</span>
                  <p className="text-on-surface/30 text-sm">No upcoming events.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {upcomingEvents.map(ev => {
                    const cfg = EVENT_TYPES[ev.type] || EVENT_TYPES.event
                    const d = new Date(ev.date + 'T00:00:00')
                    const dayNum = d.getDate()
                    const mon = d.toLocaleString('default', { month: 'short' }).toUpperCase()
                    const isMultiDay = ev.date !== (ev.endDate || ev.date)
                    return (
                      <button
                        key={ev.id}
                        onClick={() => setSelectedDate(ev.date)}
                        className="flex items-center gap-3 hover:bg-on-surface/5 rounded-xl p-2 transition-colors w-full text-left group"
                      >
                        {/* Date chip — shows range for multi-day */}
                        <div className="flex-shrink-0">
                          {isMultiDay ? (
                            <div className="h-11 px-3 rounded-xl bg-on-surface/5 border border-outline-variant/30 flex flex-col items-center justify-center">
                              <span className="text-[#FF1493] text-[9px] font-black uppercase tracking-widest leading-none">Range</span>
                              <span className="text-on-surface text-[10px] font-bold mt-0.5">{formatDateRange(ev.date, ev.endDate)}</span>
                            </div>
                          ) : (
                            <div className="w-11 h-11 rounded-xl bg-on-surface/5 border border-outline-variant/30 flex flex-col items-center justify-center">
                              <span className="text-on-surface font-black text-sm leading-none">{dayNum}</span>
                              <span className="text-on-surface/30 text-[9px] font-bold">{mon}</span>
                            </div>
                          )}
                        </div>
                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-on-surface text-sm font-semibold truncate">{ev.title}</p>
                          <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                            <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold ${cfg.color} ${cfg.text}`}>{cfg.label}</span>
                            {ev.time && <span className="text-on-surface/30 text-xs">{ev.time}</span>}
                            {isMultiDay && (
                              <span className="text-on-surface/20 text-[9px] font-bold">
                                {Math.round((new Date(ev.endDate) - new Date(ev.date)) / 86400000) + 1} days
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="material-symbols-outlined text-on-surface/20 group-hover:text-on-surface/40 text-[18px] transition-colors">chevron_right</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Add Event Modal ────────────────────────────────────── */}
      {showModal && (
        <AddEventModal
          initialDate={modalDate}
          onClose={() => setShowModal(false)}
          onAdd={handleAddEvent}
        />
      )}
    </DashboardLayout>
  )
}
