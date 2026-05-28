import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

import { useTheme } from '../../context/ThemeContext'
import Logo from '../../components/common/Logo'

export default function LoginScreen() {
  const navigate = useNavigate()
  const { login, loginWithGoogle, loginAsDemo } = useAuth()

  const { isDark, toggleTheme } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 🎭 DEMO LOGIN
  const handleDemoLogin = async (role) => {
    setLoading(true)
    setError('')
    
    let demoEmail = '';
    let demoPassword = '';
    
    if (role === 'admin') {
      demoEmail = 'admin@tactix.io';
      demoPassword = 'Admin@123';
    } else if (role === 'coach') {
      demoEmail = 'coach@tactix.io';
      demoPassword = 'Coach@123';
    } else if (role === 'student') {
      demoEmail = 'athlete@tactix.io';
      demoPassword = 'Athlete@123';
    }

    try {
      const result = await login(demoEmail, demoPassword)
      if (result?.success) {
        navigate('/dashboard', { replace: true })
      } else {
        setError(result?.error || 'Demo login failed.')
      }
    } catch (err) {
      setError('Demo login failed.')
    } finally {
      setLoading(false)
    }
  }

  // 🔐 EMAIL LOGIN
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('[LoginScreen] Email login clicked:', email)
    setError('')
    setLoading(true)

    try {
      const result = await login(email, password)
      console.log('[LoginScreen] Login result:', result)

      if (!result.success) {
        setError(result.error)
        setLoading(false)
        return
      }

      setLoading(false)
      navigate('/dashboard', { replace: true })

    } catch (err) {
      console.error('[LoginScreen] Unexpected error:', err)
      setError('Something went wrong. Try again.')
      setLoading(false)
    }
  }

  // 🔐 GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    console.log('[LoginScreen] Google login clicked')
    setError('')
    setLoading(true)

    try {
      const result = await loginWithGoogle()
      console.log('[LoginScreen] Google login result:', result)

      if (!result.success) {
        setError(result.error)
        setLoading(false)
        return
      }

      setLoading(false)
      navigate('/dashboard', { replace: true })

    } catch (err) {
      console.error('[LoginScreen] Google login error:', err)
      setError('Google login failed.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-[#0A0A0A] flex items-center justify-center relative overflow-hidden font-body-md text-body-md text-on-surface">

      {/* Animated background orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full animate-float opacity-60"
          style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.15) 0%, transparent 70%)' }} />
        <div className="absolute bottom-[-15%] right-[-10%] w-[380px] h-[380px] rounded-full animate-float-reverse opacity-50"
          style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.12) 0%, transparent 70%)' }} />
        <div className="absolute top-[50%] left-[60%] w-[220px] h-[220px] rounded-full animate-float opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.10) 0%, transparent 70%)', animationDelay: '3s' }} />
      </div>

      {/* Theme toggle */}
      <button
        type="button"
        onClick={toggleTheme}
        className="absolute top-5 right-5 z-20 h-10 px-3 rounded-xl bg-white/5 border border-white/10 text-on-surface flex items-center gap-2 hover:bg-white/10 hover:border-[#DC143C]/30 transition-all animate-fade-in"
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <span className="material-symbols-outlined text-[18px]">{isDark ? 'light_mode' : 'dark_mode'}</span>
        <span className="text-label-sm">{isDark ? 'Light' : 'Dark'}</span>
      </button>

      {/* Main Glassmorphism Card */}
      <main className="relative z-10 w-full max-w-[420px] mx-6 px-6 py-8 bg-white/3 backdrop-blur-2xl border border-white/8 rounded-3xl shadow-[0_32px_64px_rgba(0,0,0,0.6)] animate-fade-in-scale">
        {/* Top red accent line */}
        <div className="absolute top-0 left-8 right-8 h-px bg-gradient-to-r from-transparent via-[#DC143C]/50 to-transparent" />

        <div className="flex flex-col items-center mb-8">
          <div className="animate-bounce-slow">
            <Logo variant="header" size="lg" className="mb-2" style={{ filter: 'drop-shadow(0 0 12px rgba(220,20,60,0.3))' }} />
          </div>
          <h1 className="font-lexend text-headline-lg text-on-surface tracking-tight mt-4 animate-slide-up" style={{ animationDelay: '0.1s' }}>Welcome Back</h1>
          <p className="font-lexend text-body-md text-on-surface/50 animate-slide-up" style={{ animationDelay: '0.15s' }}>Sign in to continue your progress</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-stack-md">
          {error && (
            <div className="text-red-400 text-sm text-center mb-2 px-4 py-3 bg-red-950/60 backdrop-blur-sm rounded-xl border border-red-500/20 animate-shake flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] shrink-0" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              {error}
            </div>
          )}

          {/* Email Input Group */}
          <div className="flex flex-col gap-unit relative">
            <label className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest pl-1" htmlFor="email">Email Address</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">mail</span>
              <input 
                className="w-full h-12 bg-on-surface/5 border-0 border-b-2 border-outline-variant focus:border-[#DC143C] focus:ring-0 text-on-surface font-body-lg text-body-lg pl-12 pr-12 outline-none transition-colors placeholder:text-on-surface-variant/40 rounded-t-lg" 
                id="email" 
                placeholder="athlete@tactix.io" 
                required 
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* Password Input Group */}
          <div className="flex flex-col gap-unit relative">
            <label className="font-label-lg text-label-lg text-on-surface-variant uppercase tracking-widest pl-1" htmlFor="password">Password</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline">lock</span>
              <input 
                className="w-full h-12 bg-on-surface/5 border-0 border-b-2 border-outline-variant focus:border-[#DC143C] focus:ring-0 text-on-surface font-body-lg text-body-lg pl-12 pr-4 outline-none transition-colors placeholder:text-on-surface-variant/40 rounded-t-lg" 
                id="password" 
                placeholder="••••••••" 
                required 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-outline hover:text-[#DC143C] transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <span className="material-symbols-outlined">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
            <div className="flex justify-end mt-1">
              <Link className="font-label-sm text-label-sm text-[#FF69B4] hover:text-primary transition-colors" to="/forgot-password">Forgot Password?</Link>
            </div>
          </div>

          {/* Primary Sign In Action */}
          <button 
            className="w-full h-12 bg-[#DC143C] text-on-primary font-bold uppercase tracking-widest rounded-xl shadow-[0_4px_14px_rgba(220,20,60,0.4)] hover:bg-[#B01030] hover:shadow-[0_6px_20px_rgba(220,20,60,0.5)] transition-all active:scale-[0.98] mt-4 flex items-center justify-center gap-2 disabled:opacity-50" 
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in...' : (
              <>
                Sign In
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-on-surface/10"></div>
          <span className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-widest">Or</span>
          <div className="flex-1 h-px bg-on-surface/10"></div>
        </div>

        {/* Social Login */}
        <button 
          className="w-full h-12 bg-on-surface/5 border border-outline-variant/30 text-on-surface font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-on-surface/10 transition-colors active:scale-[0.98] disabled:opacity-50" 
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
          </svg>
          Continue with Google
        </button>

        {/* Demo Mode Section */}
        <div className="mt-10 pt-8 border-t border-outline-variant/30">
          <div className="text-center mb-6">
            <h3 className="text-on-surface font-black text-[10px] tracking-[0.3em] uppercase opacity-50">Quick Preview</h3>
            <h2 className="text-on-surface font-black text-lg uppercase tracking-tight">Try Demo Mode</h2>
          </div>
          
          <div className="flex flex-col gap-3">
            {[
              { id: 'admin',   icon: 'shield',        title: 'Administrator', desc: 'School management & oversight', color: 'from-red-600 to-rose-500' },
              { id: 'coach',   icon: 'sports_soccer', title: 'Sports Coach',  desc: 'Team performance & attendance', color: 'from-emerald-500 to-teal-500' },
              { id: 'student', icon: 'person',        title: 'Student Athlete',desc: 'Personal stats & leaderboard', color: 'from-orange-500 to-amber-500' }
            ].map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => handleDemoLogin(role.id)}
                disabled={loading}
                className="group relative flex items-center gap-4 p-4 bg-on-surface/5 border border-outline-variant/30 rounded-2xl hover:bg-on-surface/10 hover:border-outline-variant/50 transition-all active:scale-[0.98] text-left overflow-hidden"
              >
                {/* Animated Gradient Background */}
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-r ${role.color}`}></div>
                
                {/* Icon Container */}
                <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shadow-lg`}>
                  <span className="material-symbols-outlined text-on-surface text-[24px]">{role.icon}</span>
                </div>

                {/* Text Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-on-surface font-black text-xs uppercase tracking-widest">{role.title}</h4>
                  <p className="text-on-surface/40 text-[10px] uppercase tracking-wider mt-0.5 truncate">{role.desc}</p>
                </div>

                {/* Arrow */}
                <span className="material-symbols-outlined text-on-surface/20 group-hover:text-on-surface/60 transition-colors text-[20px]">chevron_right</span>
              </button>
            ))}
          </div>
          <p className="text-center text-[9px] text-on-surface/20 uppercase tracking-[0.2em] mt-6">
            Log in for full data persistence
          </p>
        </div>

        {/* Footer CTA */}
        <div className="text-center mt-6">
          <p className="font-body-md text-body-md text-on-surface-variant">
            New user? 
            <Link className="text-[#DC143C] font-bold hover:text-primary ml-1 transition-colors" to="/signup">Sign Up</Link>
          </p>
        </div>
      </main>
    </div>
  )
}