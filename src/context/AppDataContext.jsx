import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import { collection, query, onSnapshot, where } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const AppDataContext = createContext(null)

// ── Empty state for REAL users ───────────────────────────────────────────────
const createRealInitialData = () => ({
  profile: {
    name: '',
    class: '',
    section: '',
    sport: '',
    bio: '',
    phone: '',
    photo: '',
  },
  admin: {},
  coach: {},
  players: [],
  groups: [],
  groupLeaders: [],
  activityLogs: [],
  calendarEvents: [],
  announcements: [],
  alerts: [],
  remarks: [],
  holidays: [],
  attendanceByDate: {},
})

export function AppDataProvider({ children }) {
  const { user } = useAuth()

  const [data, setData] = useState(() => createRealInitialData())

  // ─── Real-time Sync with Firestore ─────────────────────────────
  useEffect(() => {
    if (!user?.uid) return

    // Setup Queries based on Role and School/Team for Isolation
    const role = user?.role?.toLowerCase()
    
    let qPlayers;
    let qGroups;

    if (role === 'admin' || role === 'coach') {
      if (!user.schoolId) return; // Wait until they join a school
      qPlayers = query(collection(db, 'users'), where('schoolId', '==', user.schoolId), where('role', 'in', ['player', 'student']))
      qGroups = query(collection(db, 'teams'), where('schoolId', '==', user.schoolId))
    } else if (role === 'student' || role === 'player') {
      if (!user.teamId) return; // Wait until they join a team
      qPlayers = query(collection(db, 'users'), where('teamId', '==', user.teamId), where('role', 'in', ['player', 'student']))
      qGroups = query(collection(db, 'teams'), where('teamId', '==', user.teamId)) // Usually a student only belongs to 1 team, but we fetch it to resolve teamName.
    } else {
      return; // Invalid role
    }

    // Sync Players
    const unsubPlayers = onSnapshot(qPlayers, (snapshot) => {
      const playerList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setData(prev => ({ ...prev, players: playerList }))
    }, (err) => console.error('[AppDataContext] Sync Players Error:', err))

    // Sync Teams/Groups
    const unsubGroups = onSnapshot(qGroups, (snapshot) => {
      const groupList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setData(prev => ({ ...prev, groups: groupList }))
    }, (err) => console.error('[AppDataContext] Sync Groups Error:', err))

    // Sync Holidays
    const unsubHolidays = onSnapshot(query(collection(db, 'holidays')), (snapshot) => {
      const hList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setData(prev => ({ ...prev, holidays: hList }))
    }, (err) => console.error('[AppDataContext] Sync Holidays Error:', err))

    return () => {
      unsubPlayers()
      unsubGroups()
      unsubHolidays()
    }
  }, [user?.uid])



  const updateData = useCallback((updater) => {
    setData((prev) => typeof updater === 'function' ? updater(prev) : { ...prev, ...updater })
  }, [])

  const saveProfile = useCallback((profile) => {
    setData((prev) => ({ ...prev, profile: { ...prev.profile, ...profile } }))
  }, [])

  const appendActivityLog = useCallback((message, type = 'info') => {
    setData((prev) => ({
      ...prev,
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          message,
          type,
          time: new Date().toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
        },
        ...prev.activityLogs,
      ].slice(0, 50), // cap at 50 entries
    }))
  }, [])

  const clearActivityLogs = useCallback(() => {
    setData((prev) => ({ ...prev, activityLogs: [] }))
  }, [])

  const deleteActivityLog = useCallback((logId) => {
    setData((prev) => ({ ...prev, activityLogs: prev.activityLogs.filter((l) => l.id !== logId) }))
  }, [])

  // setHoliday removed, it is now managed via Firestore addDoc/deleteDoc where needed

  const setAttendanceForDate = useCallback((dateKey, attendanceRows) => {
    setData((prev) => {
      const newAttendanceByDate = { ...prev.attendanceByDate, [dateKey]: attendanceRows }

      const updatedPlayers = prev.players.map(player => {
        let attended = 0
        let totalSessions = 0
        Object.values(newAttendanceByDate).forEach(dateRows => {
          const pRow = dateRows.find(r => r.id === player.id)
          if (pRow) {
            totalSessions++
            if (pRow.status === 'present') attended++
          }
        })
        return {
          ...player,
          attendanceStats: {
            total: totalSessions,
            attended,
            percentage: totalSessions > 0 ? Math.round((attended / totalSessions) * 100) : 0,
          },
        }
      })

      return { ...prev, attendanceByDate: newAttendanceByDate, players: updatedPlayers }
    })
  }, [])



  const value = useMemo(() => ({
    data,
    updateData,
    saveProfile,
    appendActivityLog,
    clearActivityLogs,
    deleteActivityLog,
    setAttendanceForDate,
  }), [data, updateData, saveProfile, appendActivityLog, clearActivityLogs, deleteActivityLog, setAttendanceForDate])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export const useAppData = () => {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
