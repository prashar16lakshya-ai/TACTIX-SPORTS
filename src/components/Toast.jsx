import { useEffect, useState } from 'react'

const ICONS = { success: 'check_circle', error: 'error', info: 'info', warning: 'warning' }

const STYLES = {
  success: {
    wrapper: 'border-[#DC143C]/30 bg-[#0F0F0F]/95 backdrop-blur-xl',
    icon: 'text-[#DC143C]',
    bar: 'bg-[#DC143C]',
  },
  error: {
    wrapper: 'border-red-500/30 bg-red-950/80 backdrop-blur-xl',
    icon: 'text-red-400',
    bar: 'bg-red-500',
  },
  info: {
    wrapper: 'border-[#FF1493]/30 bg-[#0F0F0F]/95 backdrop-blur-xl',
    icon: 'text-[#FF1493]',
    bar: 'bg-[#FF1493]',
  },
  warning: {
    wrapper: 'border-orange-500/30 bg-orange-950/80 backdrop-blur-xl',
    icon: 'text-orange-400',
    bar: 'bg-orange-500',
  },
}

export default function Toast({ message, type = 'info', onDismiss, duration = 3000 }) {
  const [exiting, setExiting] = useState(false)
  const style = STYLES[type] || STYLES.info

  useEffect(() => {
    if (!message) return
    const exitTimer = setTimeout(() => setExiting(true), duration - 350)
    const dismiss = setTimeout(() => onDismiss?.(), duration)
    return () => { clearTimeout(exitTimer); clearTimeout(dismiss) }
  }, [message, duration, onDismiss])

  const handleDismiss = () => {
    setExiting(true)
    setTimeout(() => onDismiss?.(), 300)
  }

  if (!message) return null

  return (
    <div
      className={`fixed top-20 left-4 right-4 z-[200] flex items-start gap-3 p-4 rounded-2xl border shadow-[0_8px_32px_rgba(0,0,0,0.4)] transition-all duration-300
        ${style.wrapper}
        ${exiting ? 'opacity-0 -translate-y-2 scale-95' : 'opacity-100 translate-y-0 scale-100 animate-slide-down'}`}
    >
      {/* Animated icon */}
      <span
        className={`material-symbols-outlined ${style.icon} shrink-0 animate-pop`}
        style={{ fontVariationSettings: "'FILL' 1" }}
      >
        {ICONS[type]}
      </span>

      <p className="text-sm font-lexend text-on-surface flex-1 leading-relaxed">{message}</p>

      <button
        onClick={handleDismiss}
        className="text-on-surface/30 hover:text-on-surface/70 shrink-0 transition-colors active:scale-90"
      >
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>

      {/* Progress bar that shrinks over duration */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden">
        <div
          className={`h-full ${style.bar} origin-left`}
          style={{
            animation: `fillBar ${duration}ms linear reverse both`,
          }}
        />
      </div>
    </div>
  )
}
