import React from 'react'

export default function ProgressHeader({ step, title, subtitle, totalSteps = 2 }) {
  const progressPercent = (step / totalSteps) * 100

  return (
    <div className="w-full mb-12 space-y-4">
      <div className="flex justify-between items-end">
        <div>
          <span className="font-lexend text-label-caps text-primary uppercase block mb-2 tracking-widest text-xs font-bold">
            Setup
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface text-3xl font-bold">
            {title}
          </h1>
          {subtitle && (
            <p className="font-body-md text-on-surface-variant mt-2 text-sm">{subtitle}</p>
          )}
        </div>
        <div className="text-right">
          <span className="font-lexend text-label-caps text-on-surface-variant block mb-1 uppercase tracking-widest text-xs font-bold">
            Step {step} of {totalSteps}
          </span>
        </div>
      </div>
      {/* Progress Bar */}
      <div className="h-1.5 w-full bg-surface-container-highest rounded-full overflow-hidden relative">
        <div 
          className="absolute top-0 left-0 h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(124,58,237,0.8)]"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
    </div>
  )
}
