import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { db } from '../../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import Logo from '../../components/common/Logo'

const CLASS_OPTIONS = ['LKG', 'UKG', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12']
const SECTION_OPTIONS = ['A', 'B', 'C', 'D', 'E', 'F']
const SPORTS_LIST = [
  'Cricket', 'Athletics', 'Badminton', 'Basketball', 'Football',
  'Tennis', 'Table Tennis', 'Swimming', 'Volleyball', 'Kabaddi', 'Hockey'
]

export default function UserSetup() {
  const { user, updateSession } = useAuth()
  const { data, saveProfile } = useAppData()
  const navigate = useNavigate()
  const photoInputRef = useRef(null)
  const role = String(user?.role || '').toLowerCase()
  const isCoach = role === 'coach'
  const isStudent = role === 'student' || role === 'player'
  const isAdmin = role === 'admin'
  const roleLabel = role ? role.charAt(0).toUpperCase() + role.slice(1) : 'User'

  useEffect(() => {
    if (isAdmin) {
      navigate('/admin/dashboard', { replace: true })
      return
    }

    if (!isCoach && !isStudent) {
      navigate('/access-denied', { replace: true })
    }
  }, [isAdmin, isCoach, isStudent, navigate])

  const [formData, setFormData] = useState({
    name: user?.name || data.profile?.name || '',
    class: data.profile?.class || '',
    section: data.profile?.section || '',
    sport: data.profile?.sport || '',
    phone: data.profile?.phone || '',
    admissionNumber: data.profile?.admissionNumber || '',
    bio: data.profile?.bio || '',
    photo: data.profile?.photo || '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    setFieldErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: String(reader.result || '') }))
    }
    reader.onerror = () => {
      setError('Could not read image file. Please try another image.')
    }
    reader.readAsDataURL(file)
  }

  const validate = () => {
    const nextErrors = {}
    if (!formData.name.trim()) nextErrors.name = 'Name is required'
    if (isStudent && !formData.class) nextErrors.class = 'Class is required'
    if (isStudent && !formData.section) nextErrors.section = 'Section is required'
    if (isStudent && !String(formData.phone || '').trim()) nextErrors.phone = 'Phone number is required'
    if (isStudent && !String(formData.admissionNumber || '').trim()) nextErrors.admissionNumber = 'Admission Number is required'
    if ((isCoach || isStudent) && !formData.sport) {
      nextErrors.sport = 'Sport is required'
    }
    setFieldErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSuccessMessage('')
    if (!validate()) return

    if (!user?.uid) {
      setError('User session not found. Please log in again.')
      return
    }

    setLoading(true)
    setError('')

    try {
      // 1. Save to Firestore (Primary)
      const userRef = doc(db, 'users', user.uid)
      const profileData = {
        name: formData.name.trim(),
        class: isStudent ? formData.class : '',
        section: isStudent ? formData.section : '',
        sport: isCoach || isStudent ? formData.sport : '',
        phone: formData.phone.trim(),
        admissionNumber: isStudent ? formData.admissionNumber.trim() : '',
        bio: formData.bio.trim(),
        photo: formData.photo || '',
        email: user.email,
        uid: user.uid,
        updatedAt: serverTimestamp(),
        setupCompleted: true
      }

      await setDoc(userRef, profileData, { merge: true })

      // 2. Update local AppDataContext (Secondary)
      saveProfile(profileData)

      setSuccessMessage('Profile saved successfully!')

      // 3. Update Auth Session instantly
      updateSession({ setupCompleted: true })

      // 4. Redirect immediately to dashboard or team code entry
      if (isStudent) {
        navigate('/enter-team-code', { replace: true })
      } else {
        navigate('/coach/enter-school-code', { replace: true })
      }

    } catch (err) {
      console.error('[UserSetup] Error saving profile:', err)
      setError('Failed to save profile. Please check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-on-background font-body-md flex flex-col relative overflow-x-hidden">
      {/* TopAppBar */}
      <header className="bg-zinc-950/90 backdrop-blur-lg flex justify-between items-center w-full px-6 py-4 z-50 fixed top-0 border-b border-emerald-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container-highest border border-primary/30">
            {user?.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary font-bold">
                {user?.initials || 'U'}
              </div>
            )}
          </div>
          <Logo variant="header" size="sm" />
        </div>
        <button className="text-zinc-500 active:scale-95 transition-all duration-200 hover:bg-zinc-900/50 hover:text-emerald-300 p-2 rounded-full">
          <span className="material-symbols-outlined">notifications</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 mt-20 mb-10 px-container-padding">
        <div className="max-w-md mx-auto py-stack-lg">
          {/* Welcome Section */}
          <section className="mb-stack-lg text-center">
            <span className="font-label-lg text-primary uppercase tracking-[0.2em] mb-stack-sm block">Welcome {isStudent ? 'Athlete' : roleLabel}</span>
            <h2 className="font-headline-xl text-on-surface mb-2">{isCoach ? 'Coach Profile' : 'Complete Your Profile'}</h2>
            <p className="font-body-md text-on-surface-variant">
              {isCoach
                ? 'Manage YOUR TEAM NAMEs and see how your players are doing.'
                : 'This info helps your coach see how you are doing.'}
            </p>
          </section>

          {/* Profile Setup Form Card */}
          <div className="bg-surface-container border border-outline-variant/30 rounded-xl p-6 shadow-xl relative overflow-hidden">
            {/* Decorative element */}
            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

            <form onSubmit={handleSubmit} className="space-y-stack-lg relative z-10">
              {error && (
                <div className="p-3 bg-error-container/20 border border-error/30 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-error text-[18px]">error</span>
                  <p className="text-label-sm text-error">{error}</p>
                </div>
              )}
              {successMessage && (
                <div className="p-3 bg-primary/15 border border-primary/30 rounded-lg flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                  <p className="text-label-sm text-primary">{successMessage}</p>
                </div>
              )}

              {/* Profile Header */}
              <div className="flex flex-col items-center mb-stack-lg">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary shadow-[0_0_20px_rgba(68,231,142,0.2)] bg-surface-container-highest flex items-center justify-center">
                    {formData.photo ? (
                      <img src={formData.photo} alt={formData.name} className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-primary text-4xl font-black">{user?.initials || 'U'}</span>
                    )}
                  </div>
                  <button
                    className="absolute -bottom-2 -right-2 bg-primary text-on-primary p-2 rounded-lg shadow-lg active:scale-90 transition-transform"
                    type="button"
                    onClick={() => photoInputRef.current?.click()}
                  >
                    <span className="material-symbols-outlined !text-[20px]">edit</span>
                  </button>
                  <input
                    ref={photoInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                </div>
                <h3 className="font-headline-md text-on-surface mt-4">{formData.name || user?.name || 'Your Name'}</h3>
                <p className="font-label-sm text-on-surface-variant uppercase tracking-widest capitalize">Active {roleLabel}</p>
              </div>

              {/* Input Fields */}
              <div className="space-y-stack-md">
                <div className="group">
                  <label className="font-label-lg text-on-surface-variant mb-1 block uppercase">Name</label>
                  <div className="relative">
                    <input
                      name="name"
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body-lg py-3 px-0 transition-colors"
                      placeholder="Enter full name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                  </div>
                  {fieldErrors.name && <p className="text-error text-xs mt-1">{fieldErrors.name}</p>}
                </div>

                {isStudent && (
                  <>
                    <div className="group">
                      <label className="font-label-lg text-on-surface-variant mb-1 block uppercase">Class</label>
                      <div className="relative">
                        <select
                          name="class"
                          className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body-lg py-3 px-0 transition-colors"
                          value={formData.class}
                          onChange={handleChange}
                        >
                          <option value="">Select class</option>
                          {CLASS_OPTIONS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">school</span>
                      </div>
                      {fieldErrors.class && <p className="text-error text-xs mt-1">{fieldErrors.class}</p>}
                    </div>

                    <div className="group">
                      <label className="font-label-lg text-on-surface-variant mb-1 block uppercase">Section</label>
                      <div className="relative">
                        <select
                          name="section"
                          className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body-lg py-3 px-0 transition-colors"
                          value={formData.section}
                          onChange={handleChange}
                        >
                          <option value="">Select section</option>
                          {SECTION_OPTIONS.map((item) => (
                            <option key={item} value={item}>{item}</option>
                          ))}
                        </select>
                        <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">shield</span>
                      </div>
                      {fieldErrors.section && <p className="text-error text-xs mt-1">{fieldErrors.section}</p>}
                    </div>
                  </>
                )}

                {/* Sport Field */}
                <div className="group">
                  <label className="font-label-lg text-on-surface-variant mb-1 block uppercase">{isCoach ? 'Specialization' : 'Primary Sport'}</label>
                  <div className="relative">
                    <select
                      name="sport"
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body-lg py-3 px-0 transition-colors"
                      value={formData.sport}
                      onChange={handleChange}
                    >
                      <option value="">Select sport</option>
                      {SPORTS_LIST.map((item) => (
                        <option key={item} value={item}>{item}</option>
                      ))}
                    </select>
                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">sports_football</span>
                  </div>
                  {fieldErrors.sport && <p className="text-error text-xs mt-1">{fieldErrors.sport}</p>}
                </div>

                <div className="group">
                  <label className="font-label-lg text-on-surface-variant mb-1 block uppercase">{isCoach ? 'Phone Number' : 'Phone Number'}</label>
                  <div className="relative">
                    <input
                      name="phone"
                      className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body-lg py-3 px-0 transition-colors"
                      placeholder="+91 98XXXXXXXX"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                    />
                    <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">call</span>
                  </div>
                  {fieldErrors.phone && <p className="text-error text-xs mt-1">{fieldErrors.phone}</p>}
                </div>

                {isStudent && (
                  <div className="group">
                    <label className="font-label-lg text-on-surface-variant mb-1 block uppercase">Admission Number</label>
                    <div className="relative">
                      <input
                        name="admissionNumber"
                        className="w-full bg-transparent border-b-2 border-outline-variant focus:border-primary focus:ring-0 text-on-surface font-body-lg py-3 px-0 transition-colors"
                        placeholder="e.g. ****"
                        type="text"
                        value={formData.admissionNumber}
                        onChange={handleChange}
                      />
                      <span className="material-symbols-outlined absolute right-0 top-1/2 -translate-y-1/2 text-outline-variant">badge</span>
                    </div>
                    {fieldErrors.admissionNumber && <p className="text-error text-xs mt-1">{fieldErrors.admissionNumber}</p>}
                  </div>
                )}

                <div className="group">
                  <label className="font-label-lg text-on-surface-variant mb-1 block uppercase">{isCoach ? 'Bio' : 'Bio (Optional)'}</label>
                  <textarea
                    name="bio"
                    className="w-full bg-surface-container-high/40 border border-outline-variant/40 rounded-lg focus:border-primary focus:ring-0 text-on-surface font-body-lg py-3 px-3 transition-colors"
                    placeholder="Tell us about your playing style and goals"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                  />
                </div>
              </div>

              {/* Complete Setup CTA */}
              <div className="mt-stack-lg flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full h-14 bg-primary text-on-primary font-headline-md rounded-xl shadow-[0_12px_24px_-8px_rgba(68,231,142,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Profile'}
                  {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                </button>
                <Link to="/login" className="w-full h-12 flex items-center justify-center bg-transparent border-2 border-outline text-on-surface font-label-lg rounded-xl hover:bg-surface-container-high transition-colors">
                  Back to Login
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
