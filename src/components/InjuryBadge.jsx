/**
 * InjuryBadge — Red cross overlay on player avatars for active injuries.
 * Usage: <div className="relative"><Avatar /><InjuryBadge playerId={id} injuries={injuries} /></div>
 */
export default function InjuryBadge({ playerId, injuries = [], size = 'sm' }) {
  const activeInjury = injuries.find(
    (inj) => inj.playerId === playerId && inj.status === 'active'
  )

  if (!activeInjury) return null

  const sizeClasses = size === 'md' ? 'w-5 h-5 text-[10px]' : 'w-4 h-4 text-[8px]'

  return (
    <div
      className={`absolute -top-0.5 -right-0.5 ${sizeClasses} bg-red-500 text-white rounded-full flex items-center justify-center animate-pop z-20 border border-[#0A0A0A] shadow-lg`}
      title={`Injury: ${activeInjury.bodyPart || 'Reported'} (${activeInjury.severity || 'unknown'})`}
    >
      <span className="material-symbols-outlined" style={{ fontSize: 'inherit', fontVariationSettings: "'FILL' 1" }}>
        add
      </span>
    </div>
  )
}
