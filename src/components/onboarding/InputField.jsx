import React from 'react'

export default function InputField({ 
  id, 
  label, 
  icon, 
  type = "text", 
  placeholder, 
  value, 
  onChange, 
  required = true,
  error,
  helperText,
  loading,
  onTogglePassword,
  showPassword,
  minLength,
  pattern,
  autoComplete
}) {
  const currentType = id === "password" ? (showPassword ? "text" : "password") : type;

  return (
    <div className="group flex flex-col gap-1.5 w-full">
      <label
        className={`font-lexend text-[10px] uppercase tracking-[0.2em] font-black transition-colors ${
          error ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary'
        }`}
        htmlFor={id}
      >
        {label} {required && <span className="text-primary ml-0.5" aria-hidden="true">*</span>}
      </label>
      <div className={`relative flex items-center transition-all duration-200 ${error ? 'animate-shake' : ''}`}>
        <span
          className={`material-symbols-outlined absolute left-4 transition-colors pointer-events-none z-10 ${
            error ? 'text-error' : 'text-on-surface-variant group-focus-within:text-primary'
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
        <input
          id={id}
          name={id}
          type={currentType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          pattern={pattern}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`w-full bg-surface-container-highest border-b-2 transition-all placeholder:text-on-surface-variant/30 rounded-t-xl text-on-surface text-body-md font-body-md pl-12 pr-12 py-3.5 outline-none hover:bg-surface-bright/5 focus:bg-surface-bright/10 ${
            error 
              ? 'border-error/50 focus:border-error' 
              : 'border-outline-variant/30 focus:border-primary'
          }`}
        />
        
        <div className="absolute right-4 flex items-center gap-2">
          {loading && (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
          )}

          {id === "password" && (
            <button
              type="button"
              onClick={onTogglePassword}
              className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              <span className="material-symbols-outlined text-[20px]">
                {showPassword ? 'visibility_off' : 'visibility'}
              </span>
            </button>
          )}
        </div>
      </div>
      <div className="min-h-[16px]">
        {error ? (
          <p 
            id={`${id}-error`} 
            className="text-[11px] text-error font-bold font-lexend flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1"
            role="alert"
            aria-live="assertive"
          >
            <span className="material-symbols-outlined text-[14px]">error</span>
            {error}
          </p>
        ) : helperText ? (
          <p 
            id={`${id}-helper`} 
            className="text-[11px] text-on-surface-variant font-medium font-lexend flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1"
          >
            <span className="material-symbols-outlined text-[14px]">info</span>
            {helperText}
          </p>
        ) : null}
      </div>
    </div>
  )
}
