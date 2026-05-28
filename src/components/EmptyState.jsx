export default function EmptyState({ icon, title, description, actionLabel, onAction, children }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="w-20 h-20 rounded-full bg-surface-container flex items-center justify-center mb-6 border border-outline-variant/30 relative">
        <div className="absolute inset-0 bg-primary/5 rounded-full animate-pulse" />
        <span className="material-symbols-outlined text-[40px] text-primary relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>
          {icon || 'inbox'}
        </span>
      </div>
      <h3 className="text-headline-md font-inter font-bold text-on-surface mb-2">{title || 'No Data Found'}</h3>
      <p className="text-body-md font-lexend text-on-surface-variant max-w-xs mb-8">{description || "It looks like there's nothing here yet. Start by adding some records."}</p>
      
      {onAction && (
        <button
          onClick={onAction}
          className="h-12 px-8 rounded-full bg-primary-container text-on-primary-container font-lexend text-label-lg hover:bg-inverse-primary transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-primary/10"
        >
          {actionLabel && <span className="material-symbols-outlined text-[18px]">add</span>}
          {actionLabel || 'Get Started'}
        </button>
      )}
      
      {children}
    </div>
  )
}
