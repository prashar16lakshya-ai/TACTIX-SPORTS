# Goal

Design and implement a fully functional, production-ready Player Profile Dashboard screen with real-time notifications for the Holiday system, and fix the alignment issue in the Admin Dashboard.

## User Review Required

> [!IMPORTANT]
> The real-time notification system will be implemented using Firebase Firestore (`onSnapshot`). Since we don't have a backend server (like Node.js or Cloud Functions) in this repository to process triggers, the client app will handle "fan-out" (creating notification documents for users) when an Admin/Coach creates a holiday. Please review this approach.

> [!NOTE]
> The new Dashboard layout introduces a Sidebar navigation which is different from the existing bottom navigation paradigm in the app. I will create a dedicated `DashboardLayout` for this new premium interface.

## Proposed Changes

### 1. Fix Admin Dashboard Alignment
**File:** `src/screens/admin/AdminDashboard.jsx`
- Change the flex container for `quickActions` from a wrapping row to a responsive grid (`grid grid-cols-2 md:grid-cols-4`) to ensure "Assign Coach" and "Holidays" buttons align properly on all screen sizes without overlapping.

---

### 2. Real-time Notification System & DB Schema
**Firebase & Context Integration:**
- **Choice of Real-time:** Firebase Firestore `onSnapshot` will be used. It seamlessly integrates with the existing Firebase setup, providing built-in real-time listener capabilities and offline persistence without the need to set up a custom WebSocket server.
- **Database Schema:**
  - `holidays`: `{ id, date, title, createdBy, createdAt, scope ('school' | 'team'), teamId }`
  - `notifications`: `{ id, userId, title, message, isRead, createdAt, type ('holiday' | 'alert') }`
- **Context:**
  - [NEW] `src/context/NotificationContext.jsx`: A React Context that establishes an `onSnapshot` listener on the `notifications` collection for the logged-in user. It exposes `notifications`, `unreadCount`, and a `markAsRead(id)` function.
- **Holiday Trigger Logic:**
  - Modify `src/screens/shared/Holidays.jsx` so that when a Coach/Admin marks a holiday, it saves to Firestore and batch-creates notifications for the relevant users.

---

### 3. Dashboard Layout & UI Components
**Files (New Component Architecture):**
- [NEW] `src/components/dashboard/DashboardLayout.jsx`: Shell component providing the Sidebar and Top Header. Uses the strict tokens: Background `#0A0A0A`, Text `#FFFFFF` / Gray, Accent `#00C2FF`.
- [NEW] `src/components/dashboard/DashboardSidebar.jsx`: The left navigation pane matching the screenshot (Dashboard, My Team, Matches, etc.).
- [NEW] `src/components/dashboard/DashboardHeader.jsx`: Top navigation showing School Info, Team Selector, and the Notification Bell with dropdown.
- [NEW] `src/components/dashboard/NotificationDropdown.jsx`: In-app notification UI showing the list of real-time alerts.

---

### 4. Player Profile Dashboard Screen
**File:** `src/screens/coach/PlayerProfileDashboard.jsx`
- Implement the exact left/center/right grid layout specified in the screenshots using Tailwind CSS Grid and Flexbox.
- **Styling:** Dark-themed glassmorphism (`bg-white/5 backdrop-blur-lg border border-white/10`) with 16-24px rounded corners.
- **Widgets:**
  - `PlayerCard`: Image, performance score, position, height, age.
  - `PerformanceOverview`: Progress bars and vital stats.
  - `SelectionStatus`: Status rings and coach recommendations.
  - `RecentAcheivements`: Horizontal card list.
  - `CoachInsights`: Testimonial format.
  - `TeamContext` & `PerformanceTrend` (SVG Line Chart).
- **State Management:**
  - [NEW] `src/stores/useDashboardStore.js`: A Zustand store (or React Context) to manage the mock data for all these widgets cleanly, keeping the UI components declarative.

---

### 5. Routing Updates
**File:** `src/App.jsx`
- Integrate `NotificationProvider`.
- Add the route for the new Player Profile Dashboard (`/coach/player-dashboard`).

## Verification Plan

### Automated Tests
- Start the dev server (`npm run dev`) and verify compilation succeeds.
- Check browser console for Firebase connection errors or missing imports.

### Manual Verification
1. **Alignment:** Log in as Admin and verify the Quick Actions on the dashboard align correctly on mobile and desktop views.
2. **Holiday Notifications:** Log in as Coach/Admin, navigate to Holidays, create a new holiday. Open another tab with a different user and verify the notification bell updates in real-time.
3. **Dashboard UI:** Navigate to `/coach/player-dashboard` and ensure the layout exactly matches the provided screenshots, using the requested `#0A0A0A` and `#00C2FF` color tokens and glassmorphism effects.
