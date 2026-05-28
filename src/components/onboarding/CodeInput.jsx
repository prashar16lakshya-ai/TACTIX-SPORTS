import React from 'react'

export default function CodeInput({ value, onChange, label, placeholder, error, success }) {
  return (
    <div className="space-y-4">
      <label className="font-lexend text-label-caps text-on-surface-variant opacity-70 uppercase block text-xs tracking-widest font-bold">
        {label}
      </label>
      <div className="relative group">
        <input
          type="text"
          value={value}
          onChange={onChange}
          className={`w-full bg-on-surface/5 border-b-2 py-4 px-2 focus:ring-0 text-headline-md font-headline-md transition-all placeholder:text-surface-variant uppercase outline-none text-on-surface text-center tracking-widest
            ${error ? 'border-error focus:border-error shadow-[0_0_15px_rgba(255,180,171,0.4)]' : ''}
            ${success ? 'border-primary focus:border-primary shadow-[0_0_15px_rgba(124,58,237,0.4)]' : ''}
            ${!error && !success ? 'border-primary/30 focus:border-primary' : ''}
          `}
          placeholder={placeholder}
        />
        {success && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-primary">
            <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
              check_circle
            </span>
            <span className="font-lexend text-[10px] tracking-widest uppercase font-bold">Verified</span>
          </div>
        )}
      </div>
      {error && (
        <p className="text-error font-body-md italic text-sm text-center animate-pulse">
          {error}
        </p>
      )}
    </div>
  )
}
