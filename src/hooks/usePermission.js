import { useAuth } from '../context/AuthContext';

const PERMISSIONS = {
  student: {
    announcements: { read: 'all', write: 'none' },
    leaderboard: { read: 'all', write: 'none' },
    calendar: { read: 'all', write: 'none' },
  },
  coach: {
    announcements: { read: 'all', write: 'team', approve: true },
    leaderboard: { read: 'all', write: 'none' },
    calendar: { read: 'all', write: 'team' },
  },
  admin: {
    announcements: { read: 'all', write: 'all', approve: true, delete: true },
    leaderboard: { read: 'all', write: 'all' },
    calendar: { read: 'all', write: 'all' },
  },
};

export function usePermission() {
  const { user } = useAuth();
  const rawRole = user?.role?.toLowerCase() || 'student';
  const role = rawRole === 'player' ? 'student' : rawRole;

  const can = (module, action) => {
    const modulePermissions = PERMISSIONS[role]?.[module];
    if (!modulePermissions) return false;
    
    if (action === 'write') return modulePermissions.write !== 'none';
    return !!modulePermissions[action];
  };

  const getScope = (module) => {
    return PERMISSIONS[role]?.[module]?.write || 'none';
  };

  return { role, can, getScope, isStudent: role === 'student', isCoach: role === 'coach', isAdmin: role === 'admin' };
}
