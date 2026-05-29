import { useState } from 'react'
import TopBar from '../../components/TopBar'
import BottomNav from '../../components/BottomNav'

const GROUP_COLORS = {
  'Cheetah XI': 'bg-primary/20 text-primary',
  'Thunderbolts': 'bg-yellow-500/20 text-yellow-400',
}
const PODIUM_STYLES = {
  gold: { ring: 'border-secondary-container', badge: 'bg-secondary-container text-on-secondary-container shadow-[0_0_15px_rgba(195,244,0,0.4)]', name: 'text-secondary-container', size: 'w-24 h-24', bar: 'h-24', barStyle: 'bg-gradient-to-t from-surface-container to-surface-container-high border-secondary-container' },
  silver: { ring: 'border-outline-variant', badge: 'bg-surface-container-high border-2 border-surface', name: 'text-on-background', size: 'w-16 h-16', bar: 'h-16', barStyle: 'bg-surface-container border-outline-variant opacity-80' },
  bronze: { ring: 'border-outline-variant', badge: 'bg-surface-container-high border-2 border-surface', name: 'text-on-background', size: 'w-16 h-16', bar: 'h-12', barStyle: 'bg-surface-container border-outline-variant opacity-60' },
}

export default function CoachLeaderboard({ data }) {
  const [period, setPeriod] = useState('This Week')
  const players = data?.players || []
  const podium = players.filter(p => p.podium)
  const rest = players.filter(p => !p.podium)

  return (
    <div className="min-h-dvh bg-surface-container-lowest text-on-background flex flex-col">
      <TopBar trailingIcon="settings" trailingPath="/coach/settings" />
      <main className="pt-20 pb-28 max-w-7xl mx-auto w-full">
        {/* Header & Filters */}
        <section className="px-6 py-4">
          <h1 className="text-headline-lg font-inter font-bold text-on-background mb-4">SCHOOL LEADERBOARD</h1>
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {['This Week', 'This Month', 'All Time'].map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`h-12 px-6 rounded-full font-lexend text-label-lg whitespace-nowrap transition-all active:scale-95
                  ${period === p ? 'bg-primary-container text-on-primary-container' : 'bg-surface-container text-on-surface-variant border border-outline-variant hover:bg-surface-container-high'}`}>
                {p}
              </button>
            ))}
          </div>
        </section>

        {players.length > 0 ? (
          <>
            {/* Podium */}
            <section className="px-6 py-8 flex items-end justify-center gap-4">
              {/* Rank 2 */}
              <div className="flex flex-col items-center w-1/3 max-w-[120px] mb-4">
                <div className="relative mb-3">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center font-lexend text-label-sm font-bold text-on-surface-variant z-10">2</div>
                  <div className={`w-16 h-16 rounded-full border-2 ${PODIUM_STYLES.silver.ring} overflow-hidden bg-surface-container-high flex items-center justify-center font-inter font-bold text-on-surface`}>{podium[1]?.name.split(' ').map(n => n[0]).join('')}</div>
                </div>
                <h3 className="text-label-lg font-lexend text-on-background text-center truncate w-full">{podium[1]?.name}</h3>
                <p className="text-body-md font-lexend text-primary font-bold mt-1">{podium[1]?.pts.toLocaleString()}</p>
                <div className="h-16 w-full bg-surface-container rounded-t-lg mt-3 border-t-2 border-outline-variant opacity-80" />
              </div>
              {/* Rank 1 */}
              <div className="flex flex-col items-center w-1/3 max-w-[140px] z-10">
                <div className="relative mb-4">
                  <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-secondary-container border-4 border-surface-container-lowest flex items-center justify-center font-lexend text-label-lg font-black text-on-secondary-container z-10 shadow-[0_0_15px_rgba(195,244,0,0.4)]">1</div>
                  <div className={`w-24 h-24 rounded-full border-4 border-secondary-container shadow-[0_0_20px_rgba(195,244,0,0.2)] bg-surface-container-high flex items-center justify-center font-inter font-bold text-xl text-on-surface overflow-hidden`}>{podium[0]?.name.split(' ').map(n => n[0]).join('')}</div>
                </div>
                <h3 className="text-headline-md font-inter font-bold text-secondary-container text-center truncate w-full">{podium[0]?.name}</h3>
                <p className="text-body-lg font-lexend text-on-background font-bold mt-1">{podium[0]?.pts.toLocaleString()} <span className="text-secondary-fixed text-sm">pts</span></p>
                <div className="h-24 w-full bg-gradient-to-t from-surface-container to-surface-container-high rounded-t-lg mt-3 border-t-2 border-secondary-container" />
              </div>
              {/* Rank 3 */}
              <div className="flex flex-col items-center w-1/3 max-w-[120px] mb-2">
                <div className="relative mb-3">
                  <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface flex items-center justify-center font-lexend text-label-sm font-bold text-on-surface-variant z-10">3</div>
                  <div className={`w-16 h-16 rounded-full border-2 ${PODIUM_STYLES.bronze.ring} overflow-hidden bg-surface-container-high flex items-center justify-center font-inter font-bold text-on-surface`}>{podium[2]?.name.split(' ').map(n => n[0]).join('')}</div>
                </div>
                <h3 className="text-label-lg font-lexend text-on-background text-center truncate w-full">{podium[2]?.name}</h3>
                <p className="text-body-md font-lexend text-tertiary font-bold mt-1">{podium[2]?.pts.toLocaleString()}</p>
                <div className="h-12 w-full bg-surface-container rounded-t-lg mt-3 border-t-2 border-outline-variant opacity-60" />
              </div>
            </section>

            {/* Ranked List */}
            <section className="px-6 flex flex-col gap-3 pb-6">
              {rest.map(p => (
                <div key={p.rank} className="bg-surface-container rounded-xl p-4 flex items-center gap-4 border border-outline-variant/30 hover:bg-surface-container-high transition-colors relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-surface-bright" />
                  <div className="w-8 text-center text-headline-md font-inter font-bold text-on-surface-variant">{p.rank}</div>
                  <div className="w-12 h-12 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center font-inter font-bold text-sm text-on-surface shrink-0">
                    {p.name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-label-lg font-lexend text-on-background truncate">{p.name}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="flex items-center gap-1 text-on-surface-variant text-label-sm font-lexend">
                        <span className="material-symbols-outlined text-[14px]">check_circle</span>{p.attendance}
                      </span>
                      <span className="flex items-center gap-1 text-on-surface-variant text-label-sm font-lexend">
                        <span className="material-symbols-outlined text-[14px]">star</span>{p.stars}
                      </span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-label-lg font-lexend text-on-background font-bold">{p.pts.toLocaleString()}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-lexend font-bold uppercase tracking-wider ${GROUP_COLORS[p.group] || 'bg-surface-variant text-on-surface-variant'}`}>{p.group}</span>
                  </div>
                </div>
              ))}
            </section>
          </>
        ) : (
          <section className="px-6 py-10">
            <div className="bg-surface-container rounded-xl border border-dashed border-outline-variant p-8 text-center">
              <span className="material-symbols-outlined text-outline text-4xl">leaderboard</span>
              <p className="mt-3 text-body-md font-lexend text-on-surface-variant">No leaderboard data available yet.</p>
            </div>
          </section>
        )}
      </main>
      <BottomNav />
    </div>
  )
}
