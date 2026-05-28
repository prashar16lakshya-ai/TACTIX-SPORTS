import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import TopBar from '../../components/TopBar'
import Toast from '../../components/Toast'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase'
import { useAuth } from '../../context/AuthContext'

export default function AddPlayerForm() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [form, setForm] = useState({ name: '', admissionNo: '', class: '', section: '', position: '' })
  const [toast, setToast] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name || !form.admissionNo) {
      setToast({ message: 'Name and Admission No. are required.', type: 'error' })
      return
    }

    setLoading(true)
    try {
      const playerData = {
        name: form.name,
        admissionNo: form.admissionNo,
        class: form.class,
        section: form.section,
        position: form.position,
        role: 'player',
        status: 'active',
        performanceScore: 0,
        attendanceStats: { total: 0, attended: 0, percentage: 0 },
        sport: user?.sport || '',
        teamId: user?.teamId || '',
        coachId: user?.uid,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'users'), playerData)
      setToast({ message: `${form.name} added to the roster!`, type: 'success' })
      setTimeout(() => navigate(-1), 1800)
    } catch (err) {
      console.error('Error adding player:', err)
      setToast({ message: 'Failed to add player. Please try again.', type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const fields = [
    { key: 'name', label: 'Full Name', placeholder: 'Enter full name', type: 'text', required: true },
    { key: 'admissionNo', label: 'Admission No.', placeholder: 'e.g. STU2024001', type: 'text', required: true },
    { key: 'class', label: 'Class / Grade', placeholder: 'e.g. 10', type: 'text' },
    { key: 'section', label: 'Section', placeholder: 'e.g. A', type: 'text' },
    { key: 'position', label: 'Position / Role', placeholder: 'e.g. Point Guard', type: 'text' },
  ]

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <TopBar showBack title="Add Player" trailingIcon="person" />
      <Toast message={toast?.message} type={toast?.type} onDismiss={() => setToast(null)} />
      <main className="flex-1 pt-20 pb-10 px-6 flex flex-col items-center gap-6">
        <div className="w-full max-w-md pt-4">
          <h1 className="text-headline-md font-inter font-bold text-on-surface">Add Player</h1>
          <p className="text-body-md font-lexend text-on-surface-variant mt-2">Add a student to the Varsity Basketball roster.</p>
        </div>
        <div className="w-full max-w-md bg-surface-container border border-outline-variant rounded-xl p-6 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {fields.map(f => (
              <div key={f.key} className="flex flex-col gap-2">
                <label className="text-label-lg font-lexend text-on-surface uppercase tracking-wider" htmlFor={`player-${f.key}`}>
                  {f.label}{f.required && <span className="text-error ml-1">*</span>}
                </label>
                <input
                  id={`player-${f.key}`}
                  type={f.type}
                  required={f.required}
                  placeholder={f.placeholder}
                  value={form[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="bg-surface-container-low border-0 border-b-2 border-outline-variant text-on-surface font-lexend text-body-md px-0 py-3 focus:ring-0 focus:border-primary-container transition-colors placeholder:text-outline-variant h-12 outline-none"
                />
              </div>
            ))}
            <div className="flex flex-col gap-3 pt-4">
              <button id="add-player-submit" type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary-container text-on-primary-container rounded-xl font-lexend text-label-lg uppercase tracking-widest hover:bg-inverse-primary active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50">
                <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings:"'FILL' 1" }}>{loading ? 'sync' : 'person_add'}</span>
                {loading ? 'Processing...' : 'Add to Roster'}
              </button>
              <button type="button" onClick={() => navigate(-1)}
                className="w-full h-12 border-2 border-outline-variant text-on-surface-variant font-lexend text-label-lg rounded-xl hover:bg-surface-container-high hover:text-on-surface active:scale-[0.98] transition-all">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
