import { useNavigate } from 'react-router-dom'

export default function AccessDenied() {
  const navigate = useNavigate()
  return (
    <div className="min-h-dvh bg-background flex flex-col items-center justify-center px-6 gap-6 text-center">
      <div className="w-24 h-24 rounded-full bg-error-container/20 flex items-center justify-center">
        <span className="material-symbols-outlined text-error text-[48px]" style={{ fontVariationSettings:"'FILL' 1" }}>lock</span>
      </div>
      <div>
        <h1 className="text-headline-lg font-inter font-bold text-on-surface">Access Denied</h1>
        <p className="text-body-md font-lexend text-on-surface-variant mt-2">You don't have permission to view this page.</p>
      </div>
      <button onClick={() => navigate(-1)}
        className="h-12 px-8 bg-primary-container text-on-primary-container rounded-xl font-lexend text-label-lg uppercase tracking-widest hover:bg-inverse-primary transition-colors flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>Go Back
      </button>
    </div>
  )
}
