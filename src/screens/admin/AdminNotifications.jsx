import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const NOTIFS = []

export default function AdminNotifications() {
  return (
    <div className="min-h-dvh bg-[#0A0E1A] text-on-background flex flex-col">
      <TopBar trailingIcon="settings" trailingPath="/admin/settings" />
      <main className="flex-1 w-full max-w-3xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6">
        <div className="flex items-end justify-between pt-4">
          <div>
            <h1 className="text-headline-xl font-inter font-black text-on-background">Notifications</h1>
            <p className="text-body-md font-lexend text-on-surface-variant mt-2">{NOTIFS.filter(n=>n.unread).length} unread alerts.</p>
          </div>
          <button className="flex items-center gap-2 text-primary font-lexend text-label-lg px-3 py-2 rounded-lg hover:bg-surface-variant/50 transition-colors">
            <span className="material-symbols-outlined text-[18px]">done_all</span>Mark all read
          </button>
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {['All Alerts', 'Team Updates', 'System'].map((f, i) => (
            <button key={f} className={`px-6 py-2.5 rounded-full font-lexend text-label-lg whitespace-nowrap min-h-[48px] transition-colors
              ${i === 0 ? 'bg-primary-container text-on-primary-container shadow-[0_4px_12px_rgba(0,82,255,0.2)]' : 'bg-[#121826] text-on-surface-variant border border-[#1E2638] hover:bg-surface-variant/50'}`}>
              {f}
            </button>
          ))}
        </div>

        {/* Notification Cards */}
        <div className="flex flex-col gap-4">
          {NOTIFS.length > 0 ? NOTIFS.map((n, i) => (
            <div key={i} className={`relative bg-[#121826] p-6 rounded-xl border border-[#1E2638] flex gap-5 items-start hover:border-outline-variant transition-colors cursor-pointer shadow-lg shadow-black/20
              ${!n.unread ? 'opacity-70 hover:opacity-100' : ''}`}>
              {n.unread && <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-primary-container shadow-[0_0_12px_rgba(12,202,117,0.6)]" />}
              <div className={`w-12 h-12 rounded-full ${n.bg} flex items-center justify-center shrink-0 border ${n.border}`}>
                <span className="material-symbols-outlined" style={{ fontVariationSettings:"'FILL' 1" }}>{n.icon}</span>
              </div>
              <div className="flex-1 pr-4">
                <div className="flex items-center gap-3 mb-1 flex-wrap">
                  <h3 className="text-label-lg font-lexend text-on-surface">{n.title}</h3>
                  {n.tag && <span className={`px-2 py-0.5 rounded text-[10px] font-lexend font-bold uppercase tracking-wider ${n.tagColor}`}>{n.tag}</span>}
                </div>
                <p className="text-body-md font-lexend text-on-surface-variant mb-3 line-clamp-2">{n.body}</p>
                <span className="text-label-sm font-lexend text-outline flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">schedule</span>{n.time}
                </span>
              </div>
            </div>
          )) : (
            <div className="bg-[#121826] border border-dashed border-[#1E2638] rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-outline text-4xl">notifications_off</span>
              <p className="mt-3 text-body-md font-lexend text-on-surface-variant">No notifications yet.</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
