import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import InputField from '../../components/onboarding/InputField'
import ProgressHeader from '../../components/onboarding/ProgressHeader'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

export default function OnboardingStep2({ prevStep, nextStep, completeSignup, onDataChange, data }) {
  const [loading, setLoading] = useState(false)
  const [validatingEmail, setValidatingEmail] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { loginWithGoogle } = useAuth()

  // Real-time password validation
  useEffect(() => {
    if (data.password && data.password.length < 6) {
      setPasswordError('Firebase: Password should be at least 6 characters (auth/weak-password).')
    } else {
      setPasswordError('')
    }
  }, [data.password])

  // Debounced email validation removed to prevent unauthorized Firestore reads.
  // We now rely on Firebase Auth `auth/email-already-in-use` during actual submission.
  useEffect(() => {
    if (!data.email || !data.email.includes('@')) {
      setEmailError('')
    }
  }, [data.email])

  const handleGoogleSignup = async () => {
    setLoading(true)
    setError('')
    try {
      const result = await loginWithGoogle()
      if (result.success) {
        const { user } = result
        const finalData = {
          ...data,
          name: user.displayName || '',
          email: user.email || '',
          password: 'GOOGLE_AUTH_USER', // Placeholder to bypass validation
          isGoogleUser: true
        }
        onDataChange({
          name: finalData.name,
          email: finalData.email,
          password: finalData.password,
          isGoogleUser: true
        })
        nextStep()
      } else {
        setError(result.error || 'Google Sign-Up failed')
      }
    } catch (err) {
      setError('An unexpected error occurred during Google Sign-Up')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')
    if (emailError || passwordError) return
    if (!data.name || !data.email || !data.phone || (!data.isGoogleUser && !data.password)) {
      setError("Please fill all required fields")
      return
    }
    if (data.role === 'player' && !data.admissionNumber) {
      setError("Admission Number is required for students")
      return
    }
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      nextStep()
    }, 600)
  }

  return (
    <div className="w-full max-w-md mx-auto space-y-6">

      <ProgressHeader
        step={2}
        title="Your Details"
        subtitle="Enter your information to continue."
      />

      <div className="w-full bg-surface-container-low border border-outline-variant p-6 md:p-8 rounded-xl shadow-2xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="flex items-center gap-2 p-3 bg-error-container/20 border border-error/30 rounded-lg">
              <span className="material-symbols-outlined text-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <p className="text-label-sm font-lexend text-error text-sm">{error}</p>
            </div>
          )}

          <InputField
            id="name"
            label="Full Name *"
            icon="person"
            placeholder="E.g., NAME"
            value={data.name}
            minLength={2}
            autoComplete="name"
            onChange={(e) => onDataChange({ name: e.target.value })}
            required
          />

          <InputField
            id="email"
            type="email"
            label="Email Address *"
            icon="mail"
            placeholder="athlete@tactix.io"
            value={data.email}
            error={emailError}
            loading={validatingEmail}
            autoComplete="email"
            onChange={(e) => onDataChange({ email: e.target.value })}
            required
          />

          <InputField
            id="phone"
            type="tel"
            label="Mobile Number (+91) *"
            icon="call"
            placeholder="+91 99999 99999"
            value={data.phone || ''}
            onChange={(e) => onDataChange({ phone: e.target.value })}
            required
          />

          {data.role === 'player' && (
            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
              <InputField
                id="admissionNumber"
                type="text"
                label="Admission Number *"
                icon="badge"
                placeholder="e.g. 12345"
                value={data.admissionNumber || ''}
                onChange={(e) => onDataChange({ admissionNumber: e.target.value })}
                required
              />
            </div>
          )}

          {!data.isGoogleUser && (
            <InputField
              id="password"
              type="password"
              label="Password *"
              icon="lock"
              placeholder="••••••••••••"
              value={data.password}
              error={passwordError}
              minLength={6}
              autoComplete="new-password"
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(!showPassword)}
              onChange={(e) => onDataChange({ password: e.target.value })}
              required
            />
          )}

          <div className="space-y-4">
            <div className="flex items-stretch gap-3 mt-8">
              <button
                type="button"
                onClick={prevStep}
                className="w-14 flex shrink-0 items-center justify-center rounded-xl border border-outline-variant text-on-surface-variant hover:text-[#DC143C] hover:border-[#DC143C]/30 hover:bg-[#DC143C]/5 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-[22px]">arrow_back</span>
              </button>
              <button
                type="submit"
                disabled={loading || !!emailError || !!passwordError || validatingEmail}
                className="flex-1 bg-primary hover:bg-primary-fixed text-on-primary font-bold text-body-md py-4 rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(220,20,60,0.3)] disabled:opacity-60 uppercase tracking-widest"
              >
                {(loading && !data.isGoogleUser) ? (
                  <svg className="animate-spin h-5 w-5 text-on-primary" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.4 0 0 5.4 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <span>Continue</span>
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>arrow_forward</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-4 my-4">
              <div className="flex-1 h-px bg-on-surface/10"></div>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-black">Or</span>
              <div className="flex-1 h-px bg-on-surface/10"></div>
            </div>

            <div className="flex flex-col items-center">
              <button
                type="button"
                onClick={handleGoogleSignup}
                disabled={loading}
                className="w-full h-12 bg-on-surface/5 border border-outline-variant/30 text-on-surface font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-on-surface/10 transition-colors active:scale-[0.98] disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
                </svg>
                Continue with Google
              </button>
            </div>
          </div>
        </form>
      </div>

      <p className="mt-8 text-on-surface-variant font-body-md text-center">
        Already registered? <Link to="/login" className="text-primary font-bold hover:text-primary-fixed hover:underline transition-colors">Login</Link>
      </p>
    </div>
  )
}
