import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

export default function AccessDenied() {
  const navigate = useNavigate()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-red-600/10 blur-[100px] pointer-events-none transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      />
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>

      <div className={`relative z-10 flex flex-col items-center max-w-md transition-all duration-700 ease-out transform ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        
        {/* Icon Container */}
        <div className="relative mb-8 group">
          <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
          <div className="w-28 h-28 rounded-full bg-[#111] border border-red-500/30 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(220,20,60,0.2)]">
            <span 
              className="material-symbols-outlined text-[48px] text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)] animate-pulse" 
              style={{ fontVariationSettings:"'FILL' 1" }}
            >
              gpp_bad
            </span>
          </div>
        </div>
        
        {/* Text content */}
        <div className="space-y-3 mb-10">
          <h1 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
            Access <span className="text-red-500">Restricted</span>
          </h1>
          <p className="text-sm md:text-base font-lexend text-white/50 leading-relaxed max-w-[300px] mx-auto">
            You don't have the required clearance level to view this sector.
          </p>
        </div>
        
        {/* Actions */}
        <button 
          onClick={() => navigate(-1)}
          className="group relative h-14 px-10 rounded-2xl overflow-hidden font-lexend text-sm uppercase font-black tracking-[0.2em] transition-all hover:scale-105 active:scale-95"
        >
          <div className="absolute inset-0 bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all rounded-2xl"></div>
          <div className="relative flex items-center gap-3 text-white">
            <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
            Return to Safety
          </div>
        </button>
      </div>
    </div>
  )
}
