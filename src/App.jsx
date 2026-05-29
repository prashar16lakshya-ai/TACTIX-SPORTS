import { useState, useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { AppDataProvider } from './context/AppDataContext'
import ProtectedRoute from "./components/ProtectedRoute"
import { NotificationProvider } from './context/NotificationContext'
import ErrorBoundary from './components/ErrorBoundary'

// Auth screens
const SplashScreen = lazy(() => import('./screens/auth/SplashScreen'))
const LoginScreen = lazy(() => import('./screens/auth/LoginScreen'))
const SignupScreen = lazy(() => import('./screens/auth/SignupScreen'))
const ForgotPassword = lazy(() => import('./screens/auth/ForgotPassword'))
const UserSetup = lazy(() => import('./screens/auth/UserSetup'))
const EnterTeamCode = lazy(() => import('./screens/auth/EnterTeamCode'))

// Admin
const AdminDashboard = lazy(() => import('./screens/admin/AdminDashboard'))
const AdminReports = lazy(() => import('./screens/admin/AdminReports'))
const AdminTeams = lazy(() => import('./screens/admin/AdminTeams'))
const AllPlayers = lazy(() => import('./screens/admin/AllPlayers'))
const CreateTeamForm = lazy(() => import('./screens/admin/CreateTeamForm'))
const RoleManagement = lazy(() => import('./screens/admin/RoleManagement'))
const CoachesPage = lazy(() => import('./screens/admin/CoachesPage'))
const SportsPage = lazy(() => import('./screens/admin/SportsPage'))

// Coach
const CoachDashboard = lazy(() => import('./screens/coach/CoachDashboard'))
const AddPlayerForm = lazy(() => import('./screens/coach/AddPlayerForm'))
const CoachSchedule = lazy(() => import('./screens/coach/CoachSchedule'))
const CoachTeams = lazy(() => import('./screens/coach/CoachTeams'))
const CoachGroups = lazy(() => import('./screens/coach/CoachGroups'))
const MarkAttendance = lazy(() => import('./screens/coach/MarkAttendance'))
const PlayerProfileDashboard = lazy(() => import('./screens/coach/PlayerProfileDashboard'))
const PlayerComparison = lazy(() => import('./screens/coach/PlayerComparison'))
const AssignTraining = lazy(() => import('./screens/coach/AssignTraining'))
const EnterSchoolCode = lazy(() => import('./screens/coach/EnterSchoolCode'))
const ReportInjury = lazy(() => import('./screens/coach/ReportInjury'))
const ParentReportCard = lazy(() => import('./screens/coach/ParentReportCard'))

// Student
const StudentDashboard = lazy(() => import('./screens/student/StudentDashboard'))
const StudentProfile = lazy(() => import('./screens/student/StudentProfile'))

// Shared
const AccessDenied = lazy(() => import('./screens/shared/AccessDenied'))
const BulkImport = lazy(() => import('./screens/shared/BulkImport'))
const Settings = lazy(() => import('./screens/shared/Settings'))
const EditProfile = lazy(() => import('./screens/shared/EditProfile'))
const Feedback = lazy(() => import('./screens/shared/Feedback'))
const Help = lazy(() => import('./screens/shared/Help'))
const PrivacyPolicy = lazy(() => import('./screens/shared/PrivacyPolicy'))
const LegalPage = lazy(() => import('./screens/shared/LegalPage'))
const Notifications = lazy(() => import('./screens/shared/Notifications'))
const Holidays = lazy(() => import('./screens/shared/Holidays'))
const Profile = lazy(() => import('./screens/shared/Profile'))

// New Pages from Images
const AttendanceSnapshot = lazy(() => import('./screens/coach/AttendanceSnapshot'))
const NeedsAttention = lazy(() => import('./screens/coach/NeedsAttention'))
const TeamAlerts = lazy(() => import('./screens/coach/TeamAlerts'))

// Unified Modules
const AnnouncementsModule = lazy(() => import('./modules/announcements/AnnouncementsModule'))
const LeaderboardModule = lazy(() => import('./modules/leaderboard/LeaderboardModule'))
const CalendarModule = lazy(() => import('./modules/calendar/CalendarModule'))
const ReportsModule = lazy(() => import('./modules/reports/ReportsModule'))
const CampaignsModule = lazy(() => import('./modules/campaigns/CampaignsModule'))

// 🔥 Role Redirect
function RoleRedirect() {
  const { user, loading, isDemo } = useAuth()
  const [isTimedOut, setIsTimedOut] = useState(false)

  // 4. LOADING STATE FIX: Timeout after 3 seconds
  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        console.warn('[RoleRedirect] Loading timeout reached');
        setIsTimedOut(true);
      }, 3000);
    } else {
      setIsTimedOut(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  console.log('[RoleRedirect] State:', { user: user?.uid, loading, role: user?.role, isTimedOut })

  if (loading && !isTimedOut) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-inverse-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-lexend animate-pulse">Loading dashboard...</p>
      </div>
    )
  }
  
  if (!user) {
    console.log('[RoleRedirect] No user, redirecting to /login')
    return <Navigate to="/login" replace />
  }

  // 3. FALLBACK HANDLING: If role is undefined or missing
  if (!user.role) {
    console.error('[RoleRedirect] Missing role for user:', user.uid);
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4 p-6 text-center">
        <span className="material-symbols-outlined text-error text-5xl">error</span>
        <h2 className="text-xl font-bold text-on-surface">Account Error</h2>
        <p className="text-on-surface-variant max-w-md">
          Your account is missing a role assignment. Please contact support or an administrator to fix your profile.
        </p>
        <button 
          onClick={() => window.location.href = '/login'}
          className="mt-4 px-6 py-2 bg-surface-container border border-outline-variant rounded-lg text-on-surface font-bold"
        >
          Return to Login
        </button>
      </div>
    )
  }

  console.log('[RoleRedirect] Navigating based on role:', user.role)
  
  // Normalize role and route correctly
  const role = String(user.role).toLowerCase().trim();
  
  if (role === 'admin') return <Navigate to="/admin/dashboard" replace />
  if (role === 'coach') {
    // Demo users skip setup
    return (isDemo || user.setupCompleted) ? <Navigate to="/coach" replace /> : <Navigate to="/coach/profile-setup" replace />
  }
  if (role === 'player' || role === 'student' || role === 'athlete') {
    // Demo users skip setup
    return (isDemo || user.setupCompleted) ? <Navigate to="/student" replace /> : <Navigate to="/student/profile-setup" replace />
  }

  // If role is something else unexpected
  console.warn('[RoleRedirect] Unknown role:', role)
  return <Navigate to="/access-denied" replace />
}

function AppContent({ children }) {
  return (
    <AppDataProvider>
      {children}
    </AppDataProvider>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent>
        <NotificationProvider>
          <BrowserRouter>
          <ErrorBoundary>
          <Suspense fallback={
            <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
              <div className="w-12 h-12 border-4 border-inverse-primary border-t-transparent rounded-full animate-spin"></div>
              <p className="text-on-surface-variant font-lexend animate-pulse">Loading Your Screens...</p>
            </div>
          }>
            <Routes>

            {/* Auth */}
            <Route path="/" element={<SplashScreen />} />
            <Route path="/login" element={<LoginScreen />} />
            <Route path="/signup" element={<SignupScreen />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/user-setup" element={<Navigate to="/dashboard" replace />} />
            <Route path="/coach/profile-setup" element={<ProtectedRoute allowedRoles={['coach']}><UserSetup /></ProtectedRoute>} />
            <Route path="/student/profile-setup" element={<ProtectedRoute allowedRoles={['player', 'student']}><UserSetup /></ProtectedRoute>} />
            <Route path="/enter-team-code" element={<ProtectedRoute allowedRoles={['player', 'student']}><EnterTeamCode /></ProtectedRoute>} />
            <Route path="/dashboard" element={<RoleRedirect />} />
            <Route path="/access-denied" element={<AccessDenied />} />

            {/* Public Pages */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/legal" element={<LegalPage />} />

            {/* Unified Routes */}
            <Route path="/announcements" element={<ProtectedRoute allowedRoles={['admin', 'coach', 'player', 'student']}><AnnouncementsModule /></ProtectedRoute>} />
            <Route path="/leaderboard" element={<ProtectedRoute allowedRoles={['admin', 'coach', 'player', 'student']}><LeaderboardModule /></ProtectedRoute>} />
            <Route path="/calendar" element={<ProtectedRoute allowedRoles={['admin', 'coach', 'player', 'student']}><CalendarModule /></ProtectedRoute>} />
            <Route path="/campaigns" element={<ProtectedRoute allowedRoles={['admin', 'coach', 'player', 'student']}><CampaignsModule /></ProtectedRoute>} />
            <Route path="/reports" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><ReportsModule /></ProtectedRoute>} />
            <Route path="/feedback" element={<ProtectedRoute allowedRoles={['admin', 'coach', 'player', 'student']}><Feedback /></ProtectedRoute>} />
            <Route path="/help" element={<ProtectedRoute allowedRoles={['admin', 'coach', 'player', 'student']}><Help /></ProtectedRoute>} />
            <Route path="/settings" element={<ProtectedRoute allowedRoles={['admin', 'coach', 'player', 'student']}><Settings /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><Profile /></ProtectedRoute>} />
            <Route path="/attendance-snapshot" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><AttendanceSnapshot /></ProtectedRoute>} />
            <Route path="/needs-attention" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><NeedsAttention /></ProtectedRoute>} />
            <Route path="/team-alerts" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><TeamAlerts /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/admin/notifications" element={<ProtectedRoute allowedRoles={['admin']}><Notifications /></ProtectedRoute>} />
            <Route path="/admin/reports" element={<ProtectedRoute allowedRoles={['admin']}><AdminReports /></ProtectedRoute>} />
            <Route path="/admin/teams" element={<ProtectedRoute allowedRoles={['admin']}><AdminTeams /></ProtectedRoute>} />
            <Route path="/admin/players" element={<ProtectedRoute allowedRoles={['admin']}><AllPlayers /></ProtectedRoute>} />
            <Route path="/admin/coaches" element={<ProtectedRoute allowedRoles={['admin']}><CoachesPage /></ProtectedRoute>} />
            <Route path="/admin/sports" element={<ProtectedRoute allowedRoles={['admin']}><SportsPage /></ProtectedRoute>} />
            <Route path="/bulk-import" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><BulkImport /></ProtectedRoute>} />
            <Route path="/admin/teams/create" element={<ProtectedRoute allowedRoles={['admin']}><CreateTeamForm /></ProtectedRoute>} />
            <Route path="/admin/roles" element={<ProtectedRoute allowedRoles={['admin']}><RoleManagement /></ProtectedRoute>} />
            <Route path="/admin/settings" element={<ProtectedRoute allowedRoles={['admin']}><Settings /></ProtectedRoute>} />
            <Route path="/admin/profile/edit" element={<ProtectedRoute allowedRoles={['admin']}><EditProfile /></ProtectedRoute>} />
            <Route path="/admin/feedback" element={<ProtectedRoute allowedRoles={['admin']}><Feedback /></ProtectedRoute>} />
            <Route path="/holidays" element={<ProtectedRoute allowedRoles={['admin', 'coach']}><Holidays /></ProtectedRoute>} />

            {/* Coach Routes */}
            <Route path="/coach" element={<ProtectedRoute allowedRoles={['coach']}><CoachDashboard /></ProtectedRoute>} />
            <Route path="/coach/enter-school-code" element={<ProtectedRoute allowedRoles={['coach']}><EnterSchoolCode /></ProtectedRoute>} />
            <Route path="/coach/players/add" element={<ProtectedRoute allowedRoles={['coach']}><AddPlayerForm /></ProtectedRoute>} />
            <Route path="/coach/leaderboard" element={<Navigate to="/leaderboard" replace />} />
            <Route path="/coach/notifications" element={<ProtectedRoute allowedRoles={['coach']}><Notifications /></ProtectedRoute>} />
            <Route path="/coach/training" element={<ProtectedRoute allowedRoles={['coach']}><AssignTraining /></ProtectedRoute>} />
            <Route path="/coach/schedule" element={<ProtectedRoute allowedRoles={['coach']}><CoachSchedule /></ProtectedRoute>} />
            <Route path="/coach/teams" element={<ProtectedRoute allowedRoles={['coach']}><CoachTeams /></ProtectedRoute>} />
            <Route path="/coach/groups" element={<ProtectedRoute allowedRoles={['coach']}><CoachGroups /></ProtectedRoute>} />
            <Route path="/coach/attendance" element={<ProtectedRoute allowedRoles={['coach']}><MarkAttendance /></ProtectedRoute>} />
            <Route path="/coach/settings" element={<ProtectedRoute allowedRoles={['coach']}><Settings /></ProtectedRoute>} />
            <Route path="/coach/profile/edit" element={<ProtectedRoute allowedRoles={['coach']}><EditProfile /></ProtectedRoute>} />
            <Route path="/coach/feedback" element={<ProtectedRoute allowedRoles={['coach']}><Feedback /></ProtectedRoute>} />
            <Route path="/coach/player-dashboard" element={<ProtectedRoute allowedRoles={['coach']}><PlayerProfileDashboard /></ProtectedRoute>} />
            <Route path="/coach/compare" element={<ProtectedRoute allowedRoles={['coach']}><PlayerComparison /></ProtectedRoute>} />
            <Route path="/coach/report-injury" element={<ProtectedRoute allowedRoles={['coach']}><ReportInjury /></ProtectedRoute>} />
            <Route path="/coach/player-report" element={<ProtectedRoute allowedRoles={['coach']}><ParentReportCard /></ProtectedRoute>} />
            <Route path="/coach/calendar" element={<Navigate to="/calendar" replace />} />

            {/* Student Routes */}
            <Route path="/student" element={<ProtectedRoute allowedRoles={['player', 'student']}><StudentDashboard /></ProtectedRoute>} />
            <Route path="/student/leaderboard" element={<Navigate to="/leaderboard" replace />} />
            <Route path="/student/notifications" element={<ProtectedRoute allowedRoles={['player', 'student']}><Notifications /></ProtectedRoute>} />
            <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['player', 'student']}><StudentProfile /></ProtectedRoute>} />
            <Route path="/student/settings" element={<ProtectedRoute allowedRoles={['player', 'student']}><Settings /></ProtectedRoute>} />
            <Route path="/student/profile/edit" element={<ProtectedRoute allowedRoles={['player', 'student']}><EditProfile /></ProtectedRoute>} />
            <Route path="/student/feedback" element={<ProtectedRoute allowedRoles={['player', 'student']}><Feedback /></ProtectedRoute>} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" />} />

            </Routes>
          </Suspense>
          </ErrorBoundary>
          </BrowserRouter>
        </NotificationProvider>
      </AppContent>
    </AuthProvider>
  )
}