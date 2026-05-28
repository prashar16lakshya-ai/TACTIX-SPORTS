import { useState, useRef, useEffect } from 'react'
import { useNotification } from '../../context/NotificationContext'

export default function NotificationDropdown() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotification()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 flex items-center justify-center text-on-surface hover:bg-on-surface/10 rounded-full transition-colors"
      >
        <span className="material-symbols-outlined">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute top-1 right-2 w-2 h-2 bg-red-500 rounded-full ring-2 ring-[#0A0A0A]"></span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-[#121212] border border-outline-variant/30 rounded-2xl shadow-2xl z-50 overflow-hidden">
          <div className="p-4 border-b border-outline-variant/30 flex justify-between items-center bg-on-surface/5">
            <h3 className="text-on-surface font-bold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <button 
                onClick={markAllAsRead}
                className="text-xs text-[#FF1493] hover:text-primary transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>
          
          <div className="max-h-96 overflow-y-auto hide-scrollbar">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-on-surface/40 text-sm">
                No notifications yet
              </div>
            ) : (
              notifications.map((notif) => (
                <div 
                  key={notif.id}
                  onClick={() => !notif.isRead && markAsRead(notif.id)}
                  className={`p-4 border-b border-white/5 cursor-pointer transition-colors hover:bg-on-surface/5 ${
                    !notif.isRead ? 'bg-[#FF1493]/10' : ''
                  }`}
                >
                  <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#FF1493]/20 flex items-center justify-center flex-shrink-0 text-[#FF1493]">
                      <span className="material-symbols-outlined text-sm">
                        {notif.type === 'holiday' ? 'celebration' : 'notifications'}
                      </span>
                    </div>
                    <div>
                      <p className={`text-sm ${!notif.isRead ? 'text-on-surface font-semibold' : 'text-on-surface/70'}`}>
                        {notif.title}
                      </p>
                      <p className="text-xs text-on-surface/50 mt-1 line-clamp-2">
                        {notif.message}
                      </p>
                      <p className="text-[10px] text-[#FF1493] mt-2">
                        {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : 'Just now'}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
