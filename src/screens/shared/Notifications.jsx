import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import Toast from '../../components/Toast'
import { collection, query, onSnapshot, orderBy, addDoc, serverTimestamp, where } from 'firebase/firestore'
import { db } from '../../firebase'

export default function Notifications() {
  const { user } = useAuth()
  const { appendActivityLog, clearActivityLogs, deleteActivityLog } = useAppData()
  const [notifications, setNotifications] = useState([])
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [target, setTarget] = useState('')
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  const isAdmin = user?.role?.toLowerCase() === 'admin'
  const isCoach = user?.role?.toLowerCase() === 'coach'
  const canSend = isAdmin || isCoach

  useEffect(() => {
    // Real-time listener for notifications
    let q;
    if (isAdmin) {
      q = query(collection(db, 'notifications'), orderBy('createdAt', 'desc'));
    } else if (isCoach) {
      // Coach sees notifications they sent OR global ones
      q = query(
        collection(db, 'notifications'), 
        where('target', 'in', ['all', 'coaches', user?.teamId || '']),
        orderBy('createdAt', 'desc')
      );
    } else {
      // Student sees global OR their team's notifications
      q = query(
        collection(db, 'notifications'), 
        where('target', 'in', ['all', user?.teamId || '']),
        orderBy('createdAt', 'desc')
      );
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        time: doc.data().createdAt?.toDate()?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || 'Just now'
      }));
      setNotifications(fetched);
    });

    return () => unsubscribe();
  }, [isAdmin, isCoach, user?.teamId]);

  const handleSend = async (e) => {
    e.preventDefault()
    if (!title.trim() || !message.trim() || !target) {
      setToast({ message: 'Please fill out all fields.', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const notificationData = {
        title: title.trim(),
        message: message.trim(),
        target: target === 'students' ? user?.teamId : target,
        senderId: user?.uid,
        senderName: user?.name,
        senderRole: user?.role,
        createdAt: serverTimestamp(),
        type: 'broadcast'
      }

      await addDoc(collection(db, 'notifications'), notificationData)
      
      setToast({ message: 'Broadcast sent successfully!', type: 'success' })
      setTitle('')
      setMessage('')
      setTarget('')
    } catch (error) {
      console.error('Error sending notification:', error)
      setToast({ message: 'Failed to broadcast. Check permissions.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
        <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

        {/* Header */}
        <div className="flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Broadcast Center</h1>
            <p className="text-on-surface/50 text-sm">System updates and team notifications.</p>
          </div>
        </div>

        {/* Send Section (Admin & Coach only) */}
        {canSend && (
          <form onSubmit={handleSend} className="bg-on-surface/5 border border-outline-variant/30 rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-[#FF1493]/5 to-transparent opacity-50"></div>
            
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Audience */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Audience</label>
                <select 
                  value={target}
                  onChange={(e) => setTarget(e.target.value)}
                  className="w-full bg-[#0A0A0A] border border-outline-variant/30 text-on-surface font-bold px-4 h-14 rounded-2xl focus:border-[#FF1493] outline-none transition-all appearance-none cursor-pointer"
                >
                  <option value="">Select Audience</option>
                  {isAdmin && (
                    <>
                      <option value="all">Everyone (All Schools)</option>
                      <option value="coaches">All Coaches</option>
                      <option value="students">All Students</option>
                    </>
                  )}
                  {isCoach && (
                    <option value={user?.teamId}>My Team (Students Only)</option>
                  )}
                </select>
              </div>

              {/* Title */}
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Notification Title</label>
                <input 
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Schedule Change"
                  className="w-full bg-[#0A0A0A] border border-outline-variant/30 text-on-surface font-bold px-4 h-14 rounded-2xl focus:border-[#FF1493] outline-none transition-all placeholder:text-on-surface/10"
                />
              </div>

              {/* Message */}
              <div className="md:col-span-2 flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-on-surface/30 ml-1">Message</label>
                <textarea 
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Enter broadcast details..."
                  rows={3}
                  className="w-full bg-[#0A0A0A] border border-outline-variant/30 text-on-surface font-medium p-4 rounded-2xl focus:border-[#FF1493] outline-none transition-all placeholder:text-on-surface/10 resize-none"
                />
              </div>

              <div className="md:col-span-2 flex justify-end">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-[#FF1493] hover:bg-[#C01277] text-on-surface font-black px-10 py-4 rounded-2xl shadow-lg transition-all active:scale-95 disabled:opacity-50 disabled:scale-100 uppercase tracking-widest text-xs flex items-center gap-2"
                >
                  {loading ? (
                    <span className="material-symbols-outlined animate-spin">sync</span>
                  ) : (
                    <span className="material-symbols-outlined">send</span>
                  )}
                  {loading ? 'Sending...' : 'Broadcast Message'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Notifications Feed */}
        <div className="flex flex-col gap-6">
          <div className="flex justify-between items-center px-2">
            <h2 className="text-xs font-black text-on-surface/30 uppercase tracking-[0.3em]">Recent Feed</h2>
            <button 
              onClick={() => {
                clearActivityLogs()
                setToast({ message: 'Feed cleared.', type: 'success' })
              }}
              className="text-red-500 text-[10px] font-black uppercase tracking-widest hover:underline"
            >
              Clear Feed
            </button>
          </div>

          <div className="flex flex-col gap-3">
            {notifications.length === 0 ? (
              <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl flex flex-col items-center gap-4">
                <span className="material-symbols-outlined text-4xl text-on-surface/5">notifications_off</span>
                <p className="text-xs font-black uppercase tracking-widest text-on-surface/20">No active broadcasts</p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div key={notif.id} className="bg-on-surface/5 border border-white/5 rounded-2xl p-5 hover:border-outline-variant/50 transition-all group">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-[#FF1493]/10 flex items-center justify-center border border-[#FF1493]/20">
                        <span className="material-symbols-outlined text-[18px] text-[#FF1493]">
                          {notif.type === 'holiday' ? 'event_busy' : 'notifications'}
                        </span>
                      </div>
                      <h3 className="font-bold text-on-surface">{notif.title || 'System Update'}</h3>
                    </div>
                    <span className="text-[9px] font-black text-on-surface/20 uppercase tracking-widest">
                      {notif.time || 'Just now'}
                    </span>
                  </div>
                  <p className="text-sm text-on-surface/60 leading-relaxed mb-4">{notif.message || notif.text}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-white/5">
                    <span className="bg-on-surface/5 text-on-surface/30 text-[8px] font-black px-2 py-1 rounded uppercase tracking-[0.2em]">
                      {notif.type || 'System'}
                    </span>
                    <button
                      onClick={() => deleteActivityLog(notif.id)}
                      className="text-on-surface/20 hover:text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
