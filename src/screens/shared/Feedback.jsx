import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { db } from '../../firebase'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'

export default function Feedback() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const [type, setType] = useState('Suggestion')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!message.trim()) {
      setToast({ message: 'Please enter a message', type: 'error' })
      return
    }

    setLoading(true)
    try {
      // 1. Store feedback in 'feedback' collection
      const feedbackData = {
        uid: user?.uid || 'anonymous',
        email: user?.email || 'No email',
        userName: user?.name || 'Unknown',
        role: user?.role || 'user',
        createdBy: user?.uid || 'anonymous',
        type,
        message,
        status: 'pending',
        createdAt: serverTimestamp(),
      }
      await addDoc(collection(db, 'feedback'), feedbackData)

      // 2. Send Email via EmailJS
      if (import.meta.env.VITE_EMAILJS_SERVICE_ID && import.meta.env.VITE_EMAILJS_TEMPLATE_ID && import.meta.env.VITE_EMAILJS_PUBLIC_KEY) {
        const { default: emailjs } = await import('@emailjs/browser');
        await emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          {
            from_name: user?.name || 'Unknown User',
            from_email: user?.email || 'No email',
            role: user?.role || 'user',
            type: type,
            message: message,
          },
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY
        );
      } else {
        console.warn('EmailJS credentials missing, feedback logged to Firestore only.');
      }

      setToast({ message: 'Feedback sent successfully!', type: 'success' })
      setMessage('')
      setTimeout(() => navigate(-1), 2000)
    } catch (err) {
      console.error('Error sending feedback:', err)
      setToast({ message: 'Failed to send feedback. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col overflow-x-hidden">
      <TopBar showBack title="VITAL-CORE" trailingIcon="settings" />

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

      <main className="flex-1 flex items-center justify-center p-6 relative">
        {/* Background Accents */}
        <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px] pointer-events-none" />

        <div className="w-full max-w-[480px] bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl relative z-10 flex flex-col gap-8">
          <header className="flex flex-col gap-3 text-center">
            <div className="flex items-center justify-center gap-3">
              <h1 className="text-headline-small font-lexend font-bold text-on-surface">We value your ideas</h1>
              <span className="text-2xl">💡</span>
            </div>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              Have suggestions or improvements? Help us shape the future of high-performance analytics.
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <label className="text-label-small font-lexend uppercase tracking-[0.2em] text-primary font-bold">
                Email Address
              </label>
              <div className="relative flex items-center">
                <span className="material-symbols-outlined absolute left-4 text-on-surface-variant/70 text-[20px]">mail</span>
                <input
                  type="email"
                  value={user?.email || ''}
                  readOnly
                  className="w-full h-14 bg-surface-container-high/40 text-on-surface font-lexend pl-12 pr-4 outline-none border border-outline-variant/50 rounded-xl focus:border-primary transition-all cursor-not-allowed"
                />
              </div>
            </div>

            {/* Type Field */}
            <div className="flex flex-col gap-2">
              <label className="text-label-small font-lexend uppercase tracking-[0.2em] text-primary font-bold">
                Feedback Type
              </label>
              <div className="relative flex items-center">
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="w-full h-14 bg-surface-container-high/40 text-on-surface font-lexend px-4 outline-none border border-outline-variant/50 rounded-xl focus:border-primary appearance-none transition-all cursor-pointer"
                >
                  <option value="Suggestion">Suggestion</option>
                  <option value="Bug">Bug Report</option>
                  <option value="Feature">Feature Request</option>
                  <option value="Other">Other</option>
                </select>
                <span className="material-symbols-outlined absolute right-4 text-primary pointer-events-none">expand_more</span>
              </div>
            </div>

            {/* Message Field */}
            <div className="flex flex-col gap-2">
              <label className="text-label-small font-lexend uppercase tracking-[0.2em] text-primary font-bold">
                Your Message
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your feedback..."
                rows={5}
                className="w-full bg-surface-container-high/40 text-on-surface font-lexend p-4 outline-none border border-outline-variant/50 rounded-xl focus:border-primary transition-all resize-none placeholder:text-on-surface-variant/40"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-14 bg-primary text-on-primary font-lexend font-bold rounded-xl flex items-center justify-center gap-3 hover:bg-primary/90 active:scale-[0.98] transition-all disabled:opacity-50 disabled:scale-100 shadow-lg shadow-primary/20"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Send Feedback</span>
                  <span className="material-symbols-outlined rotate-[-45deg] text-[20px]">send</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      <footer className="py-6 text-center">
        <p className="text-[10px] font-lexend text-on-surface-variant/40 uppercase tracking-[0.3em]">
          © 2026 TACTIX BY LAKSHYA PRASHAR (9D)
        </p>
      </footer>
    </div>
  )
}
