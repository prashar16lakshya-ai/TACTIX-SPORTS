import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const BADGES = [
  { icon: 'emoji_events', label: 'Season MVP', desc: 'Top performer for the season', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', earned: false },
  { icon: 'local_fire_department', label: '30-Day Streak', desc: '30 consecutive practice days', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', earned: false },
  { icon: 'star', label: '5-Star Session', desc: 'Perfect rating from coach', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', earned: false },
  { icon: 'bolt', label: 'Speed Demon', desc: 'Top sprint time on the team', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', earned: false },
  { icon: 'lock', label: 'Iron Man', desc: '100% attendance for a month', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', earned: false },
  { icon: 'lock', label: 'Clutch Player', desc: 'Score in last 2 mins of game', color: 'text-on-surface-variant', bg: 'bg-surface-container', border: 'border-outline-variant', earned: false },
]

const STATS = [
  { label: 'Current Streak', value: '0 days', icon: 'local_fire_department', color: 'text-outline' },
  { label: 'Best Streak', value: '0 days', icon: 'emoji_events', color: 'text-outline' },
  { label: 'Badges Earned', value: '0 / 6', icon: 'military_tech', color: 'text-outline' },
]

export default function Acheivements() {
  return (
    <div className="min-h-screen bg-background text-on-surface selection:bg-primary/30 pb-24">
      <TopBar trailingIcon="notifications" />
      
      <main className="mt-20 px-container-padding space-y-stack-lg max-w-4xl mx-auto">
        {/* Hero Level Card */}
        <section className="relative overflow-hidden rounded-xl bg-surface-container p-6 border border-outline-variant/30 mt-8">
          <div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 blur-[60px] rounded-full"></div>
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-1">
              <p className="font-label-sm text-label-sm text-primary uppercase tracking-widest">Global Rank: #42</p>
              <h2 className="font-headline-xl text-headline-xl text-on-surface">Level 24</h2>
              <p className="font-body-md text-body-md text-on-surface-variant">Elite Tactician</p>
            </div>
            <div className="flex-1 max-w-md w-full space-y-3">
              <div className="flex justify-between items-end">
                <span className="font-label-lg text-label-lg text-on-surface">12,450 / 15,000 XP</span>
                <span className="font-label-sm text-label-sm text-primary">83%</span>
              </div>
              <div className="h-3 w-full bg-surface-variant rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-primary to-primary-container rounded-full w-[83%]"></div>
              </div>
              <p className="font-label-sm text-label-sm text-on-surface-variant text-right italic">2,550 XP to Level 25</p>
            </div>
          </div>
        </section>

        {/* Bento Grid Acheivements */}
        <section className="space-y-stack-md">
          <div className="flex items-baseline justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface">Recent Badges</h3>
            <span className="font-label-lg text-label-lg text-primary cursor-pointer hover:underline">View All</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
            {/* Perfect Attendance */}
            <div className="md:col-span-2 relative group overflow-hidden bg-surface-container-high rounded-xl border border-outline-variant/20 p-6 flex flex-col justify-between min-h-[220px]">
              <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[120px]" style={{ fontVariationSettings: "'FILL' 1" }}>calendar_today</span>
              </div>
              <div className="space-y-4">
                <div className="w-14 h-14 bg-primary/10 rounded-lg flex items-center justify-center text-primary border border-primary/20">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>event_available</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-surface">Perfect Attendance</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant">30 Consecutive Sessions Logged</p>
                </div>
              </div>
              <div className="font-label-sm text-label-sm text-primary uppercase tracking-tighter">Earned: Oct 12, 2023</div>
            </div>

            {/* Top Performer */}
            <div className="relative group overflow-hidden bg-surface-container-highest rounded-xl border border-primary/30 p-6 flex flex-col justify-between min-h-[220px] shadow-[0_0_20px_rgba(68,231,142,0.1)]">
              <div className="space-y-4">
                <div className="w-14 h-14 bg-primary rounded-lg flex items-center justify-center text-on-primary">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>military_tech</span>
                </div>
                <div>
                  <h4 className="font-headline-md text-headline-md text-on-surface leading-tight">Top Performer</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">MVP in Regional Finals</p>
                </div>
              </div>
              <div className="font-label-sm text-label-sm text-primary-fixed uppercase tracking-tighter">Earned: Sep 28, 2023</div>
            </div>

            {/* Most Improved */}
            <div className="relative group overflow-hidden bg-surface-container-low rounded-xl border border-outline-variant/20 p-6 flex flex-col justify-between min-h-[200px]">
              <div className="space-y-4">
                <div className="w-12 h-12 bg-tertiary-container/20 rounded-lg flex items-center justify-center text-tertiary border border-tertiary/20">
                  <span className="material-symbols-outlined text-2xl">trending_up</span>
                </div>
                <div>
                  <h4 className="font-label-lg text-label-lg text-on-surface text-lg">Most Improved</h4>
                  <p className="font-label-sm text-label-sm text-on-surface-variant">25% Increase in Efficiency</p>
                </div>
              </div>
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-tighter">Earned: Aug 15, 2023</div>
            </div>

            {/* Next Goal */}
            <div className="md:col-span-2 relative bg-surface-container rounded-xl border border-outline-variant/20 p-6 overflow-hidden">
              <div className="flex items-center gap-4 mb-4">
                <span className="material-symbols-outlined text-primary">stars</span>
                <h4 className="font-label-lg text-label-lg text-on-surface uppercase">Upcoming Achievement</h4>
              </div>
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                  <h5 className="font-headline-md text-headline-md text-on-surface">Marathon Master</h5>
                  <p className="font-body-md text-body-md text-on-surface-variant mb-4">Complete 100 total hours of logged play.</p>
                  <div className="h-2 w-full bg-surface-variant rounded-full">
                    <div className="h-full bg-primary rounded-full w-[92%]"></div>
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="font-label-sm text-label-sm text-on-surface-variant">92 / 100 Hours</span>
                    <span className="font-label-sm text-label-sm text-primary">+500 XP Reward</span>
                  </div>
                </div>
                <div className="hidden md:block w-32 h-32 opacity-20">
                  <img loading="lazy" 
                    alt="Medal" 
                    className="w-full h-full object-cover rounded-lg grayscale" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDAE9eqVHfjifhp7-uOV27xK0pGqJ-2LuZxUdpOEmpDiJt5XW4YVfU94aFiXNuCuw8UjH_XGXVIMwk8xU3voVj6F184k3u0NThEWfNJDe1VJXeYTFU6022R2KVYdbKf2HG-UJEZvijPKS6DXHrhPEAw-ZSBapW94umN7BbAn9--Ribv5tOB-Ziqls94H48CLkXKoOBMsrZLswCT96XmYoWcSeUPtiKwQS-8iDYI1hsQbsuoWMDMcMBGj7mgUnLfztXgGPlKHuxs1OxE"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-12">
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Total Badges</p>
            <p className="font-headline-md text-headline-md text-primary">18</p>
          </div>
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Rare Badges</p>
            <p className="font-headline-md text-headline-md text-tertiary">3</p>
          </div>
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Season Points</p>
            <p className="font-headline-md text-headline-md text-on-surface">2,480</p>
          </div>
          <div className="bg-surface-container rounded-xl p-4 border border-outline-variant/10">
            <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Streak</p>
            <div className="flex items-center gap-1">
              <p className="font-headline-md text-headline-md text-primary">12</p>
              <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>local_fire_department</span>
            </div>
          </div>
        </section>
      </main>

      <BottomNav />
    </div>
  )
}
