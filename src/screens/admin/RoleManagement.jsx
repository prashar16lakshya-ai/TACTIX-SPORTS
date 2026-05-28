import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const ROLES = []

export default function RoleManagement() {
  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar trailingIcon="person_add" />
      <main className="flex-1 w-full max-w-3xl mx-auto pt-20 pb-28 px-6 flex flex-col gap-6">
        <div className="pt-4">
          <h1 className="text-headline-lg font-inter font-bold text-on-surface">Role Management</h1>
          <p className="text-body-md font-lexend text-on-surface-variant mt-1">Manage user roles and permissions across the system.</p>
        </div>
        <div className="flex flex-col gap-3">
          {ROLES.length > 0 ? ROLES.map((r, i) => (
            <div key={i} className="bg-surface-container-low border border-outline-variant rounded-xl p-4 flex items-center gap-4 hover:bg-surface-container-high transition-colors">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-inter font-bold shrink-0 ${r.color}`}>
                {r.initials}
              </div>
              <div className="flex-1">
                <p className="text-label-lg font-lexend text-on-surface">{r.name}</p>
                <p className="text-label-sm font-lexend text-on-surface-variant">{r.email}</p>
              </div>
              <select 
                defaultValue={r.role}
                className="bg-surface-container border border-outline-variant rounded-lg px-3 py-1.5 text-label-sm font-lexend text-on-surface outline-none focus:border-primary-container"
              >
                <option value="Admin">Admin</option>
                <option value="Coach">Coach</option>
                <option value="Student">Student</option>
              </select>
            </div>
          )) : (
            <div className="bg-surface-container border border-dashed border-outline-variant rounded-xl p-8 text-center">
              <span className="material-symbols-outlined text-outline text-4xl">admin_panel_settings</span>
              <p className="mt-3 text-body-md font-lexend text-on-surface-variant">No users available for role management.</p>
            </div>
          )}
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
