import { Component } from 'react'

/**
 * Production-grade Error Boundary for TACTIX
 * Catches React rendering errors and shows a branded fallback UI
 * Prevents frozen/blank screens in production APK
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack)
    this.setState({ errorInfo })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    window.location.href = '/login'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          className="min-h-dvh bg-background flex flex-col items-center justify-center p-6 text-center"
          style={{ fontFamily: "'Lexend', sans-serif" }}
        >
          {/* Glow orb */}
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full opacity-30 pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(220,20,60,0.2) 0%, transparent 70%)' }}
          />

          {/* Icon */}
          <div className="w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6 animate-pop">
            <span
              className="material-symbols-outlined text-error text-[40px]"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              error
            </span>
          </div>

          {/* Message */}
          <h1 className="text-xl font-bold text-on-surface mb-2">Something went wrong</h1>
          <p className="text-on-surface-variant text-sm max-w-sm mb-8 leading-relaxed">
            An unexpected error occurred. This has been logged. You can try again or return to the login screen.
          </p>

          {/* Error details (collapsed) */}
          {this.state.error && (
            <details className="w-full max-w-sm mb-6 text-left">
              <summary className="text-on-surface-variant text-xs cursor-pointer hover:text-on-surface transition-colors uppercase tracking-widest font-bold">
                Error Details
              </summary>
              <pre className="mt-2 p-3 bg-surface-container rounded-lg text-error text-[11px] overflow-auto max-h-32 border border-outline-variant/20">
                {this.state.error.toString()}
              </pre>
            </details>
          )}

          {/* Actions */}
          <div className="flex gap-3 w-full max-w-sm">
            <button
              onClick={this.handleRetry}
              className="flex-1 h-12 bg-primary text-on-primary font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all shadow-[0_4px_14px_rgba(220,20,60,0.3)] uppercase tracking-widest text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">refresh</span>
              Retry
            </button>
            <button
              onClick={this.handleGoHome}
              className="flex-1 h-12 bg-surface-container border border-outline-variant/30 text-on-surface font-bold rounded-xl flex items-center justify-center gap-2 active:scale-[0.97] transition-all uppercase tracking-widest text-sm"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
              Login
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
