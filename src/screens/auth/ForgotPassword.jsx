import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      setLoading(true)
      const result = await resetPassword(email)
      if (result.success) {
        setSent(true)
      } else {
        setError(result.error || 'Failed to send reset email')
      }
    } catch (error) {
      setError(error.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden px-container-padding">
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute top-[-15%] left-[-10%] w-[450px] h-[450px] rounded-full animate-float opacity-60" style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.15) 0%, transparent 70%)' }}></div>
        <div className="absolute bottom-[-15%] right-[-10%] w-[380px] h-[380px] rounded-full animate-float-reverse opacity-50" style={{ background: 'radial-gradient(circle, rgba(255,20,147,0.12) 0%, transparent 70%)' }}></div>
      </div>

      <main className="relative z-10 w-full max-w-md">
        <div className="text-center mb-stack-lg">
          <div className="flex justify-center">
            <img src="/name.png" alt="TACTIX" className="h-10 object-contain drop-shadow-[0_0_10px_rgba(124,58,237,0.5)]" />
          </div>
        </div>

        <div className="bg-surface-container-low/60 backdrop-blur-xl border border-white/5 rounded-xl p-stack-lg shadow-2xl shadow-black/50">
          <div className="mb-stack-lg">
            <h2 className="font-headline-md text-headline-md text-on-background mb-stack-sm">
              Forgot Password
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              {sent
                ? "Check your inbox! We've sent instructions to reset your password."
                : "Enter your email address and we'll send you instructions to reset your password."
              }
            </p>
          </div>

          {sent ? (
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="w-16 h-16 rounded-full bg-primary-container/20 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[32px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                    mark_email_read
                  </span>
                </div>
                <p className="text-body-md font-lexend text-on-surface text-center">
                  Reset link sent to <strong>{email}</strong>
                </p>
              </div>
              <button
                onClick={() => navigate('/login')}
                className="w-full h-touch-target-min bg-primary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest rounded-lg flex items-center justify-center gap-unit transition-all hover:bg-primary shadow-[0_0_20px_rgba(12,202,117,0.2)]"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-stack-lg">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-error-container/20 border border-error/30 rounded-lg">
                  <span className="material-symbols-outlined text-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
                  <p className="text-label-sm font-lexend text-error">{error}</p>
                </div>
              )}
              <div className="flex flex-col gap-stack-sm">
                <label className="font-label-lg text-label-lg text-on-surface uppercase tracking-widest" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-unit top-1/2 -translate-y-1/2 text-outline-variant">
                    mail
                  </span>
                  <input
                    className="w-full h-touch-target-min bg-surface-container-highest border-0 border-b-2 border-outline-variant focus:border-primary-container focus:ring-0 text-on-background font-body-lg text-body-lg pl-10 pr-unit transition-colors placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="athlete@example.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  />
                </div>
              </div>
              <button
                className="w-full h-touch-target-min bg-primary-container text-on-primary-container font-label-lg text-label-lg uppercase tracking-widest rounded-lg flex items-center justify-center gap-unit transition-all hover:bg-primary shadow-[0_0_20px_rgba(12,202,117,0.2)] hover:shadow-[0_0_30px_rgba(68,231,142,0.4)] disabled:opacity-60"
                type="submit"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send reset link"}
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  arrow_forward
                </span>
              </button>
            </form>
          )}

          <div className="mt-stack-lg pt-stack-md border-t border-white/5 text-center">
            <Link
              to="/login"
              className="inline-flex items-center gap-unit text-secondary font-label-lg text-label-lg uppercase tracking-wider hover:text-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">
                arrow_back
              </span>
              Back to login
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}