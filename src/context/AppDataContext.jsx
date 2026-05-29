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
  holidays: [
    { date: '2026-01-26', reason: 'Republic Day Celebration',  title: 'Republic Day' },
    { date: '2026-03-14', reason: 'Festival of Colors',        title: 'Holi' },
    { date: '2026-08-15', reason: 'Independence Day Ceremony', title: 'Independence Day' },
    { date: '2026-10-02', reason: 'Gandhi Jayanti',            title: 'Gandhi Jayanti' },
    { date: '2026-11-01', reason: 'Festival of Lights',        title: 'Diwali' },
    { date: '2026-12-25', reason: 'Christmas Break',           title: 'Christmas' },
  ],
  attendanceByDate: {},
})

export function AppDataProvider({ children }) {
  const { user } = useAuth()

  const [data, setData] = useState(() => createRealInitialData())

  // ─── Real-time Sync with Firestore ─────────────────────────────
  useEffect(() => {
    if (!user?.uid) return

    // In demo mode, provide mock data instead of Firestore queries
    if (user?.isDemo) {
      setData(prev => ({
        ...prev,
        players: [
          { id: 'demo-p1', name: 'Arjun Sharma', role: 'player', sport: 'Football', teamId: 'DEMO-TEAM', schoolId: 'DEMO-SCHOOL', initials: 'AS', attendanceStats: { total: 20, attended: 18, percentage: 90 } },
          { id: 'demo-p2', name: 'Priya Singh', role: 'player', sport: 'Football', teamId: 'DEMO-TEAM', schoolId: 'DEMO-SCHOOL', initials: 'PS', attendanceStats: { total: 20, attended: 16, percentage: 80 } },
          { id: 'demo-p3', name: 'Rahul Kumar', role: 'player', sport: 'Football', teamId: 'DEMO-TEAM', schoolId: 'DEMO-SCHOOL', initials: 'RK', attendanceStats: { total: 20, attended: 14, percentage: 70 } },
          { id: 'demo-p4', name: 'Ananya Patel', role: 'player', sport: 'Football', teamId: 'DEMO-TEAM', schoolId: 'DEMO-SCHOOL', initials: 'AP', attendanceStats: { total: 20, attended: 19, percentage: 95 } },
          { id: 'demo-p5', name: 'Vikram Rao', role: 'player', sport: 'Football', teamId: 'DEMO-TEAM', schoolId: 'DEMO-SCHOOL', initials: 'VR', attendanceStats: { total: 20, attended: 12, percentage: 60 } },
        ],
        groups: [
          { id: 'DEMO-TEAM', name: 'Demo Team', sport: 'Football', schoolId: 'DEMO-SCHOOL', teamId: 'DEMO-TEAM' },
        ],
      }))
      return // Don't set up Firestore listeners in demo mode
    }


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

    return () => {
      unsubPlayers()
      unsubGroups()
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

  const setHoliday = useCallback((holidayData) => {
    setData((prev) => {
      const exists = prev.holidays.findIndex(h => h.date === holidayData.date)
      if (exists !== -1) {
        const newHolidays = [...prev.holidays]
        newHolidays[exists] = holidayData
        return { ...prev, holidays: newHolidays }
      }
      return { ...prev, holidays: [...prev.holidays, holidayData] }
    })
  }, [])

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
    setHoliday,
    setAttendanceForDate,
  }), [data, updateData, saveProfile, appendActivityLog, clearActivityLogs, deleteActivityLog, setHoliday, setAttendanceForDate])

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export const useAppData = () => {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
