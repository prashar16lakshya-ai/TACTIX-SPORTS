import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const REPORT_STATS = []

export default function AdminReports() {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar trailingIcon="download" />
      <main className="flex-1 w-full max-w-3xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6">
        <div className="pt-4">
          <h1 className="text-headline-lg font-inter font-bold text-on-surface">Reports</h1>
          <p className="text-body-md font-lexend text-on-surface-variant mt-1">Download and review performance & attendance data.</p>
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex flex-col gap-4">
          <h2 className="text-label-lg font-lexend text-on-surface-variant uppercase tracking-widest">Filter Reports</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <label className="text-label-sm font-lexend text-on-surface-variant uppercase tracking-wider">Team</label>
              <select className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md font-lexend text-on-surface outline-none">
                <option>All Teams</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-label-sm font-lexend text-on-surface-variant uppercase tracking-wider">Period</label>
              <select className="bg-surface-container-low border border-outline-variant rounded-lg px-3 py-2 text-body-md font-lexend text-on-surface outline-none">
                <option>This Month</option>
                <option>Last Month</option>
              </select>
            </div>
          </div>
          <button className="w-full h-12 bg-primary-container text-on-primary-container rounded-xl font-lexend text-label-lg uppercase tracking-widest hover:bg-inverse-primary transition-colors flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">search</span>Generate Report
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {REPORT_STATS.length > 0 ? REPORT_STATS.map(s => (
            <div key={s.label} className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex flex-col gap-2">
              <div className="flex items-center gap-2">
                <span className={`material-symbols-outlined text-[18px] ${s.color}`}>{s.icon}</span>
                <span className="text-label-sm font-lexend text-on-surface-variant uppercase">{s.label}</span>
              </div>
              <span className="text-headline-md font-inter font-bold text-on-surface">{s.value}</span>
            </div>
          )) : (
            <div className="col-span-2 bg-surface-container border border-dashed border-outline-variant rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-outline text-4xl">analytics</span>
              <p className="mt-3 text-body-md font-lexend text-on-surface-variant">No report metrics available yet.</p>
            </div>
          )}
        </div>
        <div className="bg-surface-container border border-outline-variant rounded-xl p-4 flex items-center justify-between">
          <div>
            <p className="text-label-lg font-lexend text-on-surface">Export Full Report</p>
            <p className="text-label-sm font-lexend text-on-surface-variant mt-0.5">Download as CSV</p>
          </div>
          <button className="flex items-center gap-2 bg-primary-container text-on-primary-container px-4 py-2 rounded-lg font-lexend text-label-lg hover:bg-inverse-primary transition-colors">
            <span className="material-symbols-outlined text-[18px]">download</span>Export
          </button>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
