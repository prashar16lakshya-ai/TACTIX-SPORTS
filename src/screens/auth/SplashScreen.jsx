import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function SplashScreen() {
  const navigate = useNavigate()
  const { user, loading } = useAuth()
  const [progress, setProgress] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Trigger entrance animation
    const showTimer = setTimeout(() => setVisible(true), 50)

    // Animate loading bar
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) { clearInterval(interval); return 100 }
        return p + 2
      })
    }, 40)

    // Don't navigate until auth state is resolved
    if (loading) {
      // Safety timeout: if auth takes too long (5s), go to login
      const safetyTimer = setTimeout(() => {
        console.warn('[SplashScreen] Auth loading timeout — redirecting to login')
        navigate('/login', { replace: true })
      }, 5000)
      return () => { clearInterval(interval); clearTimeout(showTimer); clearTimeout(safetyTimer) }
    }

    // Auth is ready — navigate after a short delay for the animation
    const timer = setTimeout(() => {
      if (user) {
        navigate('/dashboard', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    }, 1200)

    return () => { clearTimeout(timer); clearInterval(interval); clearTimeout(showTimer) }
  }, [loading, navigate, user])

  return (
    <div className="min-h-dvh bg-background text-on-surface flex flex-col overflow-hidden relative">

      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.18) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-[-20%] right-[-10%] w-[400px] h-[400px] rounded-full animate-float-reverse"
          style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.14) 0%, transparent 70%)' }}
        />
        <div
          className="absolute top-[40%] right-[20%] w-[250px] h-[250px] rounded-full animate-float"
          style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.10) 0%, transparent 70%)', animationDelay: '2s' }}
        />
      </div>

      {/* Noise overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay z-0"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
      />

      <main className="flex-1 w-full h-full flex flex-col relative z-10">
        {/* Top spacer */}
        <div className="flex-1" />

        {/* Center: Logo & Brand */}
        <div className="flex flex-col items-center justify-center gap-8 px-6">

          {/* Logo with glow ring */}
          <div className="relative flex items-center justify-center w-full max-w-[280px]">
            {/* Glow ring behind logo */}
            <div
              className="absolute inset-0 rounded-full animate-pulse-glow"
              style={{ filter: 'blur(20px)', background: 'rgba(220,20,60,0.12)' }}
            />
            <div className={`relative w-full mx-auto flex items-center justify-center animate-bounce-slow transition-opacity duration-700 ${visible ? 'opacity-100' : 'opacity-0'}`}>
              <img
                src="/name.png"
                alt="TACTIX Logo"
                className="w-full h-auto object-contain relative z-10"
                style={{ filter: 'drop-shadow(0 0 20px rgba(220,20,60,0.4))' }}
              />
            </div>
          </div>

          {/* Brand tagline */}
          <div
            className={`flex flex-col items-center gap-3 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '300ms' }}
          >
            <p className="text-label-lg font-lexend text-[#FF1493] uppercase tracking-[0.3em] opacity-80">
              Sports Management
            </p>
            {/* Decorative divider */}
            <div className="flex items-center gap-2">
              <div className="w-6 h-px bg-gradient-to-r from-transparent to-[#DC143C]/50" />
              <div className="w-1.5 h-1.5 rounded-full bg-[#DC143C] animate-pulse" />
              <div className="w-6 h-px bg-gradient-to-l from-transparent to-[#DC143C]/50" />
            </div>
          </div>
        </div>

        {/* Bottom: Loading bar */}
        <div className="flex-1 flex flex-col justify-end items-center pb-16 px-6 w-full max-w-md mx-auto">
          <div
            className={`w-full transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
            style={{ transitionDelay: '500ms' }}
          >
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden relative shadow-inner mb-4">
              <div
                className="absolute top-0 left-0 h-full rounded-full transition-all duration-75"
                style={{
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #DC143C, #FF1493, #DC143C)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                  boxShadow: '0 0 10px rgba(220,20,60,0.5)',
                }}
              />
            </div>
            <p className="text-center text-label-sm font-lexend text-on-surface/30 uppercase tracking-[0.25em]">
              Loading…
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
