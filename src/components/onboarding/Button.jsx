import React from 'react'

export default function Button({ type = "button", onClick, loading, text, icon, disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className="w-full bg-primary hover:bg-primary-fixed text-on-primary font-headline-md text-body-md py-4 rounded-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-8 shadow-[0_4px_14px_rgba(68,231,142,0.3)] disabled:opacity-60 font-bold uppercase tracking-widest"
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 text-on-primary" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
        </svg>
      ) : (
        <>
          <span>{text}</span>
          {icon && (
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              {icon}
            </span>
          )}
        </>
      )}
    </button>
  )
}
