import React from 'react'

export default function RoleCard({ role, title, description, hint, icon, isSelected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`relative group cursor-pointer border-2 rounded-xl p-6 flex flex-col items-center text-center transition-all duration-300 ${
        isSelected
          ? 'bg-surface-container border-primary-container shadow-[0_0_20px_rgba(124,58,237,0.2)]'
          : 'bg-surface-container border-outline-variant hover:border-outline hover:bg-surface-container-high'
      }`}
    >
      {isSelected && (
        <div className="absolute top-4 right-4 text-primary-container">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            check_circle
          </span>
        </div>
      )}
      <div
        className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${
          isSelected ? 'bg-primary-container/20' : 'bg-surface-container-highest'
        }`}
      >
        <span
          className={`material-symbols-outlined text-4xl ${
            isSelected ? 'text-primary' : 'text-on-surface-variant'
          }`}
          style={{ fontVariationSettings: "'FILL' 1" }}
        >
          {icon}
        </span>
      </div>
      <h2 className="font-headline-md text-headline-md text-on-surface mb-2">{title}</h2>
      <p className="font-body-md text-body-md text-on-surface-variant text-sm mb-4">{description}</p>
      {hint && (
        <div className={`mt-auto py-2 px-4 rounded-lg text-xs font-bold tracking-wider uppercase ${
          isSelected ? 'bg-primary/10 text-primary' : 'bg-surface-container-highest text-on-surface-variant'
        }`}>
          {hint}
        </div>
      )}
    </div>
  )
}
