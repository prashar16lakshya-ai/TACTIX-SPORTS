import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const EVENTS = []

const TYPE_BADGES = {
  Practice: 'bg-primary/10 text-primary border-primary/20',
  Game: 'bg-secondary-container/10 text-secondary-fixed border-secondary-container/20',
  Meeting: 'bg-tertiary/10 text-tertiary border-tertiary/20',
}

export default function CoachSchedule() {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar trailingIcon="add" />
      <main className="flex-1 w-full max-w-3xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6">
        <div className="pt-4">
          <h1 className="text-headline-lg font-inter font-bold text-on-surface">Schedule</h1>
          <p className="text-body-md font-lexend text-on-surface-variant mt-1">Upcoming practices, games, and meetings.</p>
        </div>
        <div className="flex flex-col gap-4">
          {EVENTS.length > 0 ? EVENTS.map((e, i) => (
            <div key={i} className={`flex items-center gap-4 p-4 bg-surface-container-high rounded-xl border-l-4 ${e.accent} border-t border-r border-b border-outline-variant/30 hover:bg-surface-container-highest transition-colors cursor-pointer`}>
              <div className="w-12 h-12 rounded-full bg-surface-variant flex items-center justify-center shrink-0">
                <span className={`material-symbols-outlined ${e.iconColor}`}>{e.icon}</span>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <p className="text-label-lg font-lexend text-on-surface">{e.title}</p>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-lexend font-bold uppercase tracking-wider border ${TYPE_BADGES[e.type]}`}>{e.type}</span>
                </div>
                <p className="text-label-sm font-lexend text-on-surface-variant">{e.time} · {e.location}</p>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant">chevron_right</span>
            </div>
          )) : (
            <div className="bg-surface-container rounded-xl border border-dashed border-outline-variant p-8 text-center">
              <span className="material-symbols-outlined text-outline text-4xl">event_busy</span>
              <p className="mt-3 text-body-md font-lexend text-on-surface-variant">No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
