import { Component } from 'react'

/**
 * Production-grade Error Boundary for TACTIX
 * Catches React rendering errors and shows a branded fallback UI
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null, mounted: false }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('[ErrorBoundary] Caught error:', error)
    console.error('[ErrorBoundary] Component stack:', errorInfo?.componentStack)
    this.setState({ errorInfo, mounted: true })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, mounted: false })
  }

  handleGoHome = () => {
    this.setState({ hasError: false, error: null, errorInfo: null, mounted: false })
    window.location.href = '/login'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[100dvh] bg-[#050505] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden" style={{ fontFamily: "'Lexend', sans-serif" }}>
          
          {/* Background Glow */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] rounded-full bg-red-600/10 blur-[120px] pointer-events-none animate-pulse"
          />
          
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_70%)]"></div>

          <div className="relative z-10 flex flex-col items-center max-w-md w-full animate-slide-up">
            
            {/* Icon Container */}
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-red-600 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
              <div className="w-24 h-24 rounded-full bg-[#111] border border-red-500/30 flex items-center justify-center relative z-10 shadow-[0_0_30px_rgba(220,20,60,0.2)]">
                <span 
                  className="material-symbols-outlined text-[40px] text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" 
                  style={{ fontVariationSettings:"'FILL' 1" }}
                >
                  warning
                </span>
              </div>
            </div>
            
            {/* Text content */}
            <div className="space-y-3 mb-8">
              <h1 className="text-3xl md:text-4xl font-black text-white uppercase tracking-tighter drop-shadow-lg">
                System <span className="text-red-500">Failure</span>
              </h1>
              <p className="text-sm font-lexend text-white/50 leading-relaxed max-w-[320px] mx-auto">
                An unexpected error occurred in the tactical matrix. We've logged this anomaly.
              </p>
            </div>

            {/* Error details (collapsed) */}
            {this.state.error && (
              <details className="w-full mb-8 text-left group">
                <summary className="text-white/30 text-[10px] cursor-pointer hover:text-white/60 transition-colors uppercase tracking-[0.3em] font-black outline-none flex items-center gap-2 select-none justify-center">
                  <span className="material-symbols-outlined text-[14px] group-open:rotate-90 transition-transform">chevron_right</span>
                  View Error Trace
                </summary>
                <div className="mt-4 p-4 bg-[#0A0A0A] rounded-2xl border border-white/5 shadow-inner">
                  <pre className="text-red-400/80 text-[10px] font-mono overflow-auto max-h-32 hide-scrollbar whitespace-pre-wrap break-words">
                    {this.state.error.toString()}
                  </pre>
                </div>
              </details>
            )}
            
            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 w-full">
              <button 
                onClick={this.handleRetry}
                className="group relative flex-1 h-14 rounded-2xl overflow-hidden font-lexend text-xs uppercase font-black tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(220,20,60,0.2)] hover:shadow-[0_0_30px_rgba(220,20,60,0.4)]"
              >
                <div className="absolute inset-0 bg-red-600 transition-all rounded-2xl"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="relative flex items-center justify-center gap-2 text-white h-full">
                  <span className="material-symbols-outlined text-[18px] group-hover:rotate-180 transition-transform duration-500">refresh</span>
                  Reboot System
                </div>
              </button>
              
              <button 
                onClick={this.handleGoHome}
                className="group relative flex-1 h-14 rounded-2xl overflow-hidden font-lexend text-xs uppercase font-black tracking-[0.1em] transition-all hover:scale-[1.02] active:scale-95"
              >
                <div className="absolute inset-0 bg-white/[0.03] border border-white/10 group-hover:bg-white/[0.05] group-hover:border-white/20 transition-all rounded-2xl"></div>
                <div className="relative flex items-center justify-center gap-2 text-white h-full">
                  <span className="material-symbols-outlined text-[18px]">login</span>
                  Back to Login
                </div>
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
