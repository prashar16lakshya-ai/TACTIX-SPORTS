import { useState } from 'react'

export default function StarRating({ value = 0, onChange, disabled = false }) {
  const [hovered, setHovered] = useState(0)

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value)
        return (
          <button
            key={star}
            type="button"
            disabled={disabled}
            onClick={() => !disabled && onChange && onChange(star)}
            onMouseEnter={() => !disabled && setHovered(star)}
            onMouseLeave={() => !disabled && setHovered(0)}
            className={`transition-transform ${disabled ? 'cursor-default opacity-40' : 'hover:scale-110 active:scale-95 cursor-pointer'}`}
            aria-label={`${star} star${star !== 1 ? 's' : ''}`}
          >
            <span
              className={`material-symbols-outlined text-[20px] ${filled ? 'text-secondary-fixed' : 'text-surface-container-highest'}`}
              style={{ fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0" }}
            >
              star
            </span>
          </button>
        )
      })}
    </div>
  )
}
