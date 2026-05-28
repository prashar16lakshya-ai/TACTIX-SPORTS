import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'

export default function LegalPage() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <TopBar showBack title="Legal & Information" backPath={-1} />

      <main className="flex-1 pt-8 pb-16 px-6 max-w-3xl mx-auto w-full">
        <div className="bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl flex flex-col gap-8">

          <header className="flex flex-col gap-3 text-center border-b border-outline-variant/30 pb-6">
            <h1 className="text-headline-medium font-lexend font-bold text-primary">
              Legal & Information
            </h1>
            <p className="text-body-medium font-lexend text-on-surface-variant">
              Project Details and Usage Information
            </p>
          </header>

          <section className="flex flex-col gap-4">

            <h2 className="text-title-large font-lexend text-on-surface">1. Ownership</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              <img src="/name.png" alt="TACTIX" className="inline-block h-[1em] object-contain align-baseline" /> is a student-built project developed and owned by Lakshya Prashar.
              The design, concept, and implementation are part of a school initiative to improve
              sports management systems.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">2. Copyright</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed font-bold">
              © 2026 <img src="/name.png" alt="TACTIX" className="inline-block h-[1em] object-contain align-baseline" />. All rights reserved.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">3. Purpose of Application</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              <img src="/name.png" alt="TACTIX" className="inline-block h-[1em] object-contain align-baseline" /> is designed to help schools manage sports activities, track player
              performance, and organize teams efficiently.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">4. Usage</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              This application is intended for educational and demonstration purposes. Users are
              expected to use it responsibly for managing sports-related data.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">5. Data Responsibility</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              Coaches and administrators are responsible for maintaining accurate student data.
              Users should keep their account credentials secure.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">6. Disclaimer</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              This is a prototype system developed by students. While efforts have been made to
              ensure functionality and accuracy, the application is still under development and
              will continue to improve.
            </p>

          </section>

          <div className="pt-6 border-t border-outline-variant/30 text-center">
            <p className="text-sm text-on-surface-variant mb-4 font-lexend">
              Built by students to improve school sports systems.
            </p>

            <button
              onClick={() => navigate(-1)}
              className="px-6 py-3 bg-primary/10 text-primary font-lexend font-bold rounded-xl hover:bg-primary/20 transition-all"
            >
              Back
            </button>
          </div>

        </div>
      </main>
    </div>
  )
}