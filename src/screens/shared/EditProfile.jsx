import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { db } from '../../firebase'
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'

export default function EditProfile() {
  const navigate = useNavigate()
  const { user, updateSession } = useAuth()
  const { data, saveProfile, appendActivityLog } = useAppData()
  const [form, setForm] = useState({
    name: data.profile?.name || user?.name || '',
    email: user?.email || '',
    phone: data.profile?.phone || '',
    bio: data.profile?.bio || '',
    schoolName: data.profile?.schoolName || user?.schoolName || '',
  })
  const [photoURL, setPhotoURL] = useState(data.profile?.photo || '')
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef(null)

  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handlePhotoChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      setToast({ message: 'Please upload a JPEG, PNG or WebP image', type: 'error' })
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setToast({ message: 'File must be under 5MB', type: 'error' })
      return
    }

    setIsUploading(true)
    const reader = new FileReader()
    reader.onload = () => {
      setPhotoURL(String(reader.result || ''))
      setIsUploading(false)
      setToast({ message: 'Photo ready to save', type: 'success' })
    }
    reader.onerror = () => {
      setIsUploading(false)
      setToast({ message: 'Failed to read image', type: 'error' })
    }
    reader.readAsDataURL(file)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!user?.uid) return

    setLoading(true)
    try {
      const profileUpdates = {
        name: form.name,
        phone: form.phone,
        bio: form.bio,
        photo: photoURL,
        ...(user?.role === 'admin' && { schoolName: form.schoolName }),
        updatedAt: serverTimestamp()
      }

      // 1. Save to Firestore
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, profileUpdates)

      // 2. Update local state
      saveProfile(profileUpdates)
      updateSession(profileUpdates)

      appendActivityLog('Profile updated', 'success')
      setToast({ message: 'Profile updated successfully!', type: 'success' })
      navigate(-1)
    } catch (error) {
      console.error('Error updating profile:', error)
      setToast({ message: 'Failed to update profile', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar showBack title="Edit Profile" trailingIcon="person" />

      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />

      <main className="flex-1 pt-20 pb-10 px-6 max-w-2xl mx-auto w-full">
        {/* Avatar */}
        <div className="flex flex-col items-center gap-3 py-6">
          <div className="w-24 h-24 rounded-full bg-primary-container/20 border-4 border-primary-container flex items-center justify-center relative overflow-hidden">
            {photoURL ? (
              <img src={photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <span className="text-3xl font-inter font-black text-primary">{user?.initials || 'U'}</span>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary-container rounded-full flex items-center justify-center shadow-lg hover:bg-inverse-primary transition-colors z-10 disabled:opacity-50"
            >
              {isUploading ? (
                <div className="w-4 h-4 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="material-symbols-outlined text-on-primary-container text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>camera_alt</span>
              )}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/webp"
              onChange={handlePhotoChange}
            />
          </div>
          {isUploading && (
            <div className="w-full max-w-[200px]">
              <div className="h-1.5 w-full bg-on-surface/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#DC143C] rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
              </div>
              <p className="text-[10px] text-on-surface-variant text-center mt-1 font-bold">{uploadProgress}% uploaded</p>
            </div>
          )}
          <p className="text-label-sm font-lexend text-on-surface-variant">{isUploading ? 'Uploading...' : 'Tap to change photo'}</p>
        </div>

        <form onSubmit={handleSave} className="flex flex-col gap-5">
          {[
            { key: 'name', label: 'Full Name', type: 'text', placeholder: 'Your full name', readOnly: false },
            { key: 'email', label: 'Email Address', type: 'email', placeholder: 'your@email.com', readOnly: true },
            { key: 'phone', label: 'Phone Number', type: 'tel', placeholder: '+91 1234567890', readOnly: false },
            { key: 'bio', label: 'Bio', type: 'text', placeholder: 'Tell us about yourself...', readOnly: false },
            ...(user?.role === 'admin' ? [{ key: 'schoolName', label: 'School / Institution Name', type: 'text', placeholder: 'Enter your school name', readOnly: false }] : []),
          ].map(f => (
            <div key={f.key} className="flex flex-col gap-2">
              <label className="text-label-lg font-lexend text-on-surface uppercase tracking-wider" htmlFor={`edit-${f.key}`}>{f.label}</label>
              <input
                id={`edit-${f.key}`}
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                readOnly={f.readOnly}
                className={`bg-transparent border-0 border-b-2 border-outline-variant text-on-surface font-lexend text-body-md px-0 py-3 focus:ring-0 focus:border-primary-container transition-colors placeholder:text-outline-variant h-12 outline-none ${f.readOnly ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
          ))}

          <div className="flex flex-col gap-3 pt-4">
            <button id="save-profile" type="submit" disabled={loading}
              className="w-full h-12 bg-primary-container text-on-primary-container rounded-xl font-lexend text-label-lg uppercase tracking-widest hover:bg-inverse-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? (
                <div className="w-5 h-5 border-2 border-on-primary-container border-t-transparent rounded-full animate-spin" />
              ) : (
                <><span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>Save Profile</>
              )}
            </button>
            <button type="button" onClick={() => navigate(-1)} disabled={loading}
              className="w-full h-12 border-2 border-outline-variant text-on-surface-variant font-lexend text-label-lg rounded-xl hover:bg-surface-container-high hover:text-on-surface transition-all disabled:opacity-50">
              Cancel
            </button>
          </div>
        </form>
      </main>
    </div>
  )
}
