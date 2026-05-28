import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'

export default function PrivacyPolicy() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background text-on-background flex flex-col">
      <TopBar showBack title="Privacy Policy" backPath={-1} />

      <main className="flex-1 pt-8 pb-16 px-6 max-w-3xl mx-auto w-full">
        <div className="bg-surface-container/60 backdrop-blur-xl border border-outline-variant/30 rounded-3xl p-8 shadow-2xl flex flex-col gap-8">

          <header className="flex flex-col gap-3 text-center border-b border-outline-variant/30 pb-6">
            <h1 className="text-headline-medium font-lexend font-bold text-primary">
              Privacy Policy
            </h1>
            <p className="text-body-medium font-lexend text-on-surface-variant">
              Last updated: April 2026
            </p>
          </header>

          <section className="flex flex-col gap-4">

            <h2 className="text-title-large font-lexend text-on-surface">1. Introduction</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              <img src="/name.png" alt="TACTIX" className="inline-block h-[1em] object-contain align-baseline" /> is a student-built project designed to help schools manage sports activities
              and track player performance. We respect user privacy and aim to handle data responsibly
              within the scope of this application.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">2. Data Collection</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              The application may collect the following information:
            </p>
            <ul className="list-disc pl-6 text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              <li>Name and role (Admin, Coach, Student)</li>
              <li>Email address</li>
              <li>Sports-related data such as team assignments, performance statistics, and attendance</li>
            </ul>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">3. Purpose of Data</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              The collected data is used only for:
            </p>
            <ul className="list-disc pl-6 text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              <li>Managing teams and player records</li>
              <li>Displaying performance insights</li>
              <li>Improving the functionality of the application</li>
            </ul>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">4. Data Sharing</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              Data is not sold or shared with external parties. It is only accessible within the
              application by authorized users such as coaches and administrators.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">5. Data Security</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              Basic security measures are implemented using Firebase services. Access to data is
              restricted based on user roles.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">6. Educational Use</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              This application is a prototype developed by students for demonstration and educational
              purposes and is not intended for large-scale production use at this stage.
            </p>

            <h2 className="text-title-large font-lexend text-on-surface mt-4">7. Contact</h2>
            <p className="text-body-medium font-lexend text-on-surface-variant leading-relaxed">
              For any questions, please contact:{" "}
              <a href="mailto:Tactixsport@gmail.com" className="text-primary hover:underline">
                Tactixsport@gmail.com
              </a>
            </p>

          </section>

          <div className="pt-6 border-t border-outline-variant/30 text-center">
            <p className="text-sm text-on-surface-variant mb-4 font-lexend">
              No sensitive personal data (such as passwords or financial information) is stored.
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