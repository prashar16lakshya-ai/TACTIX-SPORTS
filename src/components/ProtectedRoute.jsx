import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading, isDemo } = useAuth();
  const [isTimedOut, setIsTimedOut] = useState(false);

  useEffect(() => {
    let timer;
    if (loading) {
      timer = setTimeout(() => {
        console.warn('[ProtectedRoute] Loading timeout reached');
        setIsTimedOut(true);
      }, 3000);
    } else {
      setIsTimedOut(false);
    }
    return () => clearTimeout(timer);
  }, [loading]);

  console.log('[ProtectedRoute] Check - user:', user?.uid, 'loading:', loading, 'allowedRoles:', allowedRoles);

  if (loading && !isTimedOut) {
    console.log('[ProtectedRoute] Still loading, returning UI');
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="w-12 h-12 border-4 border-inverse-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-on-surface-variant font-lexend animate-pulse">Checking authentication...</p>
      </div>
    )
  }

  if (!user) {
    console.log('[ProtectedRoute] No user, redirecting to /login');
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.some(r => r.toLowerCase().trim() === String(user.role).toLowerCase().trim())) {
    // In demo mode, allow 'athlete' role to access 'player'/'student' routes
    const isPlayerRoute = allowedRoles.some(r => ['player', 'student'].includes(r.toLowerCase()));
    const isDemoAthlete = isDemo && user.role === 'player';
    if (!(isPlayerRoute && isDemoAthlete)) {
      console.warn('[ProtectedRoute] Role mismatch. User role:', user.role, 'Allowed:', allowedRoles);
      return <Navigate to="/access-denied" replace />;
    }
  }

  console.log('[ProtectedRoute] Access granted');
  return children;
}
