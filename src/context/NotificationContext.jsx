import { createContext, useContext, useEffect, useState } from 'react'
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { useAuth } from './AuthContext'

const NotificationContext = createContext(null)

export function NotificationProvider({ children }) {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!user) {
      setNotifications([])
      setUnreadCount(0)
      return
    }

    // 1. Personal Notifications
    const personalQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )

    // 2. School/Team Holidays (Broadcast)
    const holidaysQuery = query(
      collection(db, 'holidays'),
      orderBy('date', 'desc')
    )

    const unsubPersonal = onSnapshot(personalQuery, (snapshot) => {
      const personalNotifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'personal' }))
      updateCombinedNotifications(personalNotifs, null)
    })

    const unsubHolidays = onSnapshot(holidaysQuery, (snapshot) => {
      const schoolId = user.schoolId
      const teamId = user.teamId
      
      const holidayNotifs = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data(), type: 'holiday' }))
        .filter(h => (h.schoolId && h.schoolId === schoolId) || (h.teamId && h.teamId === teamId))
      
      updateCombinedNotifications(null, holidayNotifs)
    })

    let currentPersonal = []
    let currentHolidays = []

    const updateCombinedNotifications = (p, h) => {
      if (p) currentPersonal = p
      if (h) currentHolidays = h

      const combined = [
        ...currentPersonal,
        ...currentHolidays.map(holiday => ({
          id: holiday.id,
          title: `Holiday: ${holiday.title}`,
          message: `Scheduled for ${new Date(holiday.date).toLocaleDateString()}`,
          type: 'holiday',
          isRead: false, // We'd need a way to track read status for broadcasts if needed
          createdAt: holiday.createdAt || { seconds: Date.now() / 1000 }
        }))
      ].sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0
        const timeB = b.createdAt?.seconds || 0
        return timeB - timeA
      })

      setNotifications(combined)
      setUnreadCount(combined.filter(n => !n.isRead).length)
    }

    return () => {
      unsubPersonal()
      unsubHolidays()
    }
  }, [user])

  const markAsRead = async (notificationId) => {
    try {
      const notifRef = doc(db, 'notifications', notificationId)
      await updateDoc(notifRef, { isRead: true })
    } catch (error) {
      console.error('[NotificationProvider] Failed to mark as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifs = notifications.filter(n => !n.isRead)
      await Promise.all(unreadNotifs.map(n => updateDoc(doc(db, 'notifications', n.id), { isRead: true })))
    } catch (error) {
      console.error('[NotificationProvider] Failed to mark all as read:', error)
    }
  }

  // Simulated Fan-Out function for this context
  const sendNotification = async ({ userIds, title, message, type }) => {
    try {
      const batchPromises = userIds.map(uid => 
        addDoc(collection(db, 'notifications'), {
          userId: uid,
          title,
          message,
          type,
          isRead: false,
          createdAt: serverTimestamp()
        })
      )
      await Promise.all(batchPromises)
    } catch (error) {
      console.error('[NotificationProvider] Failed to send notifications:', error)
    }
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, markAsRead, markAllAsRead, sendNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}

export const useNotification = () => {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotification must be used within NotificationProvider')
  return ctx
}
