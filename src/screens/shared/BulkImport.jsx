import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../../components/dashboard/DashboardLayout'
import BottomNav from '../../components/BottomNav'
import { GROUPS, DEMO_CSV_CONTENT } from '../../data/indianDemoData'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '../../firebase'

const FIELDS = [
  { key: 'name', label: 'Full Name', required: true },
  { key: 'position', label: 'Position', required: true },
  { key: 'teamName', label: 'Team Name', required: true },
]

const STEPS = ['Upload File', 'Map Columns', 'Assign & Import']

export default function BulkImport() {
  const navigate = useNavigate()
  const { user, isDemoMode } = useAuth()
  const { data, updateData, appendActivityLog } = useAppData()
  const fileRef = useRef()

  const [step, setStep] = useState(0)
  const [file, setFile] = useState(null)
  const [dragging, setDragging] = useState(false)
  const [headers, setHeaders] = useState([])
  const [rows, setRows] = useState([])
  const [mapping, setMapping] = useState({})
  const [assignGroup, setAssignGroup] = useState('')
  const [assignLeader, setAssignLeader] = useState('')
  const [done, setDone] = useState(false)
  const [toast, setToast] = useState(null)
  const [mapMode, setMapMode] = useState('standard')

  const isAdmin = user?.role?.toLowerCase() === 'admin'

  const showToast = (msg, type = 'error') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Step 1 helpers ────────────────────────────────────────
  const parseData = (headersList, rowsData) => {
    if (!rowsData?.length) { showToast('Empty or invalid file'); return }
    setHeaders(headersList)
    setRows(rowsData)
    const auto = {}
    FIELDS.forEach(f => {
      const m = headersList.find(h =>
        h.toLowerCase().includes(f.key.toLowerCase()))
      if (m) auto[f.key] = m
    })
    setMapping(auto)
    setStep(1)
  }

  const parseCSV = (text) => {
    const result = Papa.parse(text, { header: true, skipEmptyLines: true })
    parseData(result.meta.fields || [], result.data)
  }

  const handleXLSX = (arrayBuffer) => {
    try {
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      if (json.length < 2) {
         showToast('Spreadsheet has no data rows'); return;
      }
      const headersList = json[0];
      const rowsData = json.slice(1).map(row => {
         let rowObj = {};
         headersList.forEach((h, i) => {
            rowObj[h] = row[i];
         });
         return rowObj;
      });
      parseData(headersList, rowsData);
    } catch (err) {
      console.error(err);
      showToast('Error parsing XLSX file');
    }
  }

  const handleFile = (f) => {
    if (!f) return
    const isCSV = f.name.endsWith('.csv')
    const isXLSX = f.name.endsWith('.xlsx')
    if (!isCSV && !isXLSX) {
      showToast('Please upload a CSV or XLSX file'); return
    }
    setFile(f)
    const reader = new FileReader()
    if (isCSV) {
      reader.onload = e => parseCSV(e.target.result)
      reader.readAsText(f)
    } else if (isXLSX) {
      reader.onload = e => handleXLSX(e.target.result)
      reader.readAsArrayBuffer(f)
    }
  }

  const loadDemo = () => {
    setFile({ name: 'india_demo_players.csv' })
    parseCSV(DEMO_CSV_CONTENT)
  }

  // ── Step 2 helpers ────────────────────────────────────────
  const validateMapping = () => {
    for (const f of FIELDS) {
      if (f.required && !mapping[f.key]) {
        showToast(`Please map required field: ${f.label}`); return
      }
    }
    setStep(2)
  }

  const getMapped = (row) => {
    const out = {}
    FIELDS.forEach(f => { out[f.key] = mapping[f.key] ? (row[mapping[f.key]] || '') : '' })
    return out
  }

  const [importErrors, setImportErrors] = useState([])
  const [isImporting, setIsImporting] = useState(false)

  // ── Step 3 helpers ────────────────────────────────────────
  const handleImport = async () => {
    setIsImporting(true)
    setImportErrors([])
    
    const errors = []
    const playersToImport = []

    rows.forEach((row, idx) => {
      const mapped = getMapped(row)
      const rowNum = idx + 1
      
      // Map teamName to groupId/groupName from existing groups
      const targetGroup = (data.groups || []).find(g => 
        (g.name || '').toLowerCase() === (mapped.teamName || '').toLowerCase()
      )
      
      // Validation
      const missing = FIELDS.filter(f => f.required && !mapped[f.key])
      if (missing.length > 0) {
        errors.push(`Row ${rowNum}: Missing ${missing.map(m => m.label).join(', ')}`)
      } else if (!targetGroup) {
        errors.push(`Row ${rowNum}: Team "${mapped.teamName}" not found in your TACTIX account.`)
      } else {
        playersToImport.push({
          name: mapped.name,
          position: mapped.position,
          groupId: targetGroup.id,
          groupName: targetGroup.name,
          sport: targetGroup.sport,
          role: 'student',
          status: 'active',
          score: 0,
          attendance: 0,
          createdAt: new Date().toISOString(),
          joinedVia: 'bulk-import'
        })
      }
    })

    if (errors.length > 0) {
      setImportErrors(errors)
      showToast(`${errors.length} rows have errors. Please check team names and required fields.`, 'error')
      setIsImporting(false)
      return
    }

    try {
      if (!isDemoMode) {
        // Real user → Firestore persistence
        const promises = playersToImport.map(player => 
          addDoc(collection(db, 'users'), player)
        )
        await Promise.all(promises)
      }
      
      // Always update local state for immediate feedback
      updateData((prev) => ({ 
        ...prev, 
        players: [...prev.players, ...playersToImport] 
      }))
      
      appendActivityLog(`${playersToImport.length} players imported successfully`, 'success')
      setDone(true)
      showToast(`${playersToImport.length} players imported successfully!`, 'success')
    } catch (error) {
      console.error('Import error:', error)
      showToast('Failed to import players. Please check Firestore permissions.', 'error')
    } finally {
      setIsImporting(false)
    }
  }

  const reset = () => {
    setStep(0); setFile(null); setHeaders([]); setRows([])
    setMapping({}); setAssignGroup(''); setAssignLeader(''); setDone(false)
  }

  // ── Preview rows (first 5) ────────────────────────────────
  const preview = rows.slice(0, 5).map(getMapped)

  const displayName = data?.profile?.name || user?.name || user?.displayName || 'Coach'
  const COACH = { name: displayName }
  const selectedGroupObj = GROUPS.find(g => g.id === assignGroup)

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full">
        {toast && (
          <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-xl text-sm font-black shadow-2xl animate-in slide-in-from-top-4 ${
            toast.type === 'success' ? 'bg-[#FF1493] text-[#0A0A0A]' : 'bg-red-500 text-on-surface'
          }`}>{toast.msg}</div>
        )}

        {/* Page heading */}
        <div>
          <h1 className="text-3xl font-black text-on-surface uppercase tracking-tight">Bulk Import Center</h1>
          <p className="text-on-surface/50 text-sm mt-1">
            {isAdmin 
              ? 'Define system format and process bulk rosters.' 
              : 'Import players using the format defined by administrator.'}
          </p>
        </div>

        {/* Import Errors */}
        {importErrors.length > 0 && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6">
            <h3 className="text-red-500 font-bold text-sm uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">error</span>
              Import Errors ({importErrors.length})
            </h3>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-2 hide-scrollbar">
              {importErrors.map((err, i) => (
                <p key={i} className="text-red-400/80 text-xs font-medium bg-red-500/5 p-2 rounded-lg border border-red-500/10">
                  {err}
                </p>
              ))}
            </div>
          </div>
        )}

        {/* Stepper */}
        {!done && (
          <div className="flex items-center gap-0 bg-on-surface/5 p-4 rounded-2xl border border-outline-variant/30">
            {STEPS.map((s, i) => (
              <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black border-2 transition-all ${
                    i < step ? 'bg-[#FF1493] border-[#FF1493] text-[#0A0A0A]' :
                    i === step ? 'border-[#FF1493] text-[#FF1493] bg-[#FF1493]/10' :
                    'border-outline-variant/30 text-on-surface/20'
                  }`}>
                    {i < step ? <span className="material-symbols-outlined text-sm">check</span> : i + 1}
                  </div>
                  <span className={`text-[8px] mt-2 font-black uppercase tracking-widest whitespace-nowrap ${i === step ? 'text-[#FF1493]' : 'text-on-surface/20'}`}>
                    {s}
                  </span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`h-[1px] flex-1 mx-4 rounded-full transition-all ${i < step ? 'bg-[#FF1493]' : 'bg-on-surface/10'}`} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── STEP 0: Upload ── */}
        {!done && step === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Drop zone */}
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true) }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); handleFile(e.dataTransfer.files[0]) }}
              className={`bg-on-surface/5 rounded-3xl border-2 border-dashed p-10 flex flex-col items-center justify-center gap-6 text-center transition-all ${
                dragging ? 'border-[#FF1493] bg-[#FF1493]/5' : 'border-outline-variant/30 hover:border-[#FF1493]/30'
              }`}
            >
              <div className="w-20 h-20 rounded-2xl bg-on-surface/5 flex items-center justify-center border border-outline-variant/30 group-hover:border-[#FF1493]/30 transition-all">
                <span className="material-symbols-outlined text-4xl text-[#FF1493]">cloud_upload</span>
              </div>
              <div>
                <p className="font-black text-xl text-on-surface uppercase tracking-tight">Drop Roster Here</p>
                <p className="text-on-surface/30 text-xs mt-1 uppercase tracking-widest font-black">CSV or XLSX (Max 10MB)</p>
              </div>
              <div className="flex flex-col gap-3 w-full max-w-[240px]">
                <label className="cursor-pointer">
                  <span className="block w-full py-3 bg-[#FF1493] text-[#0A0A0A] font-black rounded-xl text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-[0_0_20px_rgba(0,194,255,0.3)]">
                    Browse Files
                  </span>
                  <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={e => handleFile(e.target.files[0])} />
                </label>
                <button onClick={loadDemo} className="w-full py-3 border border-outline-variant/30 text-on-surface/40 font-black rounded-xl text-[10px] uppercase tracking-widest hover:bg-on-surface/5 transition-all">
                  ⚡ Load Demo Format
                </button>
              </div>
            </div>

            {/* Schema preview */}
            <div className="bg-on-surface/5 rounded-3xl border border-outline-variant/30 overflow-hidden flex flex-col">
              <div className="px-6 py-5 border-b border-outline-variant/30 flex items-center justify-between">
                <h4 className="font-black text-xs text-on-surface uppercase tracking-widest">Required Format</h4>
                <button
                  onClick={() => {
                    const blob = new Blob([DEMO_CSV_CONTENT], { type: 'text/csv' })
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = 'tactix_template.csv'
                    a.click()
                  }}
                  className="text-[10px] text-[#FF1493] font-black uppercase tracking-widest hover:underline flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">download</span> Template
                </button>
              </div>
              <div className="overflow-x-auto flex-1">
                <table className="w-full text-[10px]">
                  <thead className="bg-on-surface/5 text-on-surface/20 uppercase tracking-[0.2em]">
                    <tr>{FIELDS.map(f => <th key={f.key} className="px-5 py-4 text-left font-black">{f.label}{f.required && <span className="text-red-500 ml-0.5">*</span>}</th>)}</tr>
                  </thead>
                  <tbody className="text-on-surface/40 font-bold">
                    <tr className="border-t border-white/5">
                      <td className="px-5 py-4">Aarav Mehta</td>
                      <td className="px-5 py-4">10-A</td>
                      <td className="px-5 py-4">15</td>
                      <td className="px-5 py-4">Cricket</td>
                      <td className="px-5 py-4">aarav.m@dps.edu.in</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Map Columns ── */}
        {!done && step === 1 && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden">
              <div className="px-5 py-4 border-b border-outline-variant/20 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-on-surface">Map Columns</h4>
                  <p className="text-xs text-on-surface-variant mt-0.5">{file?.name} · {rows.length} rows found</p>
                </div>
                {/* Mode Toggle */}
                <div className="flex rounded-lg border border-outline-variant/30 overflow-hidden">
                  {['standard', 'custom'].map(m => (
                    <button key={m} onClick={() => setMapMode(m)}
                      className={`px-3 py-1.5 text-xs font-black uppercase transition-all ${mapMode === m ? 'bg-[#0cca75] text-black' : 'text-on-surface-variant hover:text-primary'}`}>
                      {m === 'standard' ? 'Standard' : 'Custom'}
                    </button>
                  ))}
                </div>
              </div>

              {mapMode === 'standard' ? (
                <div className="px-5 py-4">
                  <div className="flex items-center gap-2 text-[#0cca75] bg-[#0cca75]/10 border border-[#0cca75]/20 rounded-xl p-3 text-sm">
                    <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    Auto-detected standard column format. Click <strong className="mx-1">Next</strong> to continue or switch to <strong className="mx-1">Custom</strong> to remap.
                  </div>
                </div>
              ) : (
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {FIELDS.map(f => (
                    <div key={f.key} className="flex items-center justify-between bg-surface-container-high rounded-xl p-4 border border-outline-variant/20">
                      <div>
                        <p className="font-bold text-sm text-on-surface">{f.label}</p>
                        <p className="text-[10px] text-neutral-500 uppercase font-bold">{f.required ? 'Required' : 'Optional'}</p>
                      </div>
                      <select
                        value={mapping[f.key] || ''}
                        onChange={e => setMapping({ ...mapping, [f.key]: e.target.value })}
                        className="bg-neutral-900 border border-outline-variant rounded-lg text-sm text-on-surface p-2 outline-none focus:border-[#0cca75] w-40"
                      >
                        <option value="">-- Ignore --</option>
                        {headers.map(h => <option key={h} value={h}>{h}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preview Table */}
            <div className="bg-surface-container rounded-2xl border border-outline-variant/30 overflow-hidden">
              <div className="px-5 py-3 border-b border-outline-variant/20">
                <h4 className="font-bold text-on-surface text-sm">Preview (first 5 rows)</h4>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead className="bg-surface-container-high text-on-surface-variant uppercase tracking-wider">
                    <tr>{FIELDS.map(f => <th key={f.key} className="px-4 py-2.5 text-left font-black">{f.label}</th>)}</tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant/10">
                    {preview.map((r, i) => (
                      <tr key={i} className="hover:bg-surface-container-high/40">
                        {FIELDS.map(f => (
                          <td key={f.key} className="px-4 py-2.5 text-neutral-300">
                            {r[f.key] || <span className="text-neutral-600 italic">—</span>}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between gap-3">
              <button onClick={() => setStep(0)} className="px-5 py-2.5 border border-outline-variant text-on-surface font-bold rounded-xl text-sm hover:bg-surface-variant transition-all">Back</button>
              <button onClick={validateMapping} className="px-7 py-2.5 bg-[#0cca75] text-black font-black rounded-xl text-sm hover:brightness-110 transition-all">Next →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Assign Structure ── */}
        {!done && step === 2 && (
          <div className="flex flex-col gap-4">
            <div className="bg-surface-container rounded-2xl border border-outline-variant/30 p-5 flex flex-col gap-5">
              <div>
                <h4 className="font-bold text-on-surface text-lg">Assign Structure</h4>
                <p className="text-on-surface-variant text-sm mt-0.5">
                  Assign the <strong className="text-on-surface">{rows.length} imported players</strong> to a group, coach, and optional group leader.
                </p>
              </div>

              {/* Assign Group */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant uppercase font-black tracking-wider">Group <span className="text-red-400">*</span></label>
                <select
                  value={assignGroup}
                  onChange={e => { setAssignGroup(e.target.value); setAssignLeader('') }}
                  className="bg-neutral-900 border border-outline-variant rounded-xl text-on-surface p-3 outline-none focus:border-[#0cca75] text-sm"
                >
                  <option value="">-- Select Group --</option>
                  {GROUPS.map(g => <option key={g.id} value={g.id}>{g.name} ({g.sport})</option>)}
                  <option value="unassigned">Unassigned</option>
                </select>
              </div>

              {/* Coach (readonly) */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant uppercase font-black tracking-wider">Coach</label>
                <div className="bg-neutral-900/60 border border-outline-variant/40 rounded-xl text-on-surface-variant p-3 text-sm flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0cca75] text-base">sports</span>
                  {COACH.name}
                </div>
              </div>

              {/* Group Leader */}
              <div className="flex flex-col gap-2">
                <label className="text-xs text-on-surface-variant uppercase font-black tracking-wider">Group Leader <span className="text-neutral-500">(optional)</span></label>
                <select
                  value={assignLeader}
                  onChange={e => setAssignLeader(e.target.value)}
                  disabled={!assignGroup || assignGroup === 'unassigned'}
                  className="bg-neutral-900 border border-outline-variant rounded-xl text-on-surface p-3 outline-none focus:border-[#0cca75] text-sm disabled:opacity-40"
                >
                  <option value="">-- None --</option>
                  {selectedGroupObj?.leaderName && (
                    <option value={selectedGroupObj.leaderId}>{selectedGroupObj.leaderName} (Current Leader)</option>
                  )}
                  {rows.slice(0, 5).map((r, i) => {
                    const name = mapping.name ? r[mapping.name] : ''
                    return name ? <option key={i} value={`new-${i}`}>{name} (from import)</option> : null
                  })}
                </select>
                <p className="text-[11px] text-neutral-500">Leader will manage this subset of players</p>
              </div>

              {/* Summary card */}
              {assignGroup && (
                <div className="bg-[#0cca75]/10 border border-[#0cca75]/20 rounded-xl p-4 flex flex-col gap-1">
                  <p className="text-[#0cca75] font-black text-sm">Import Summary</p>
                  <p className="text-on-surface text-sm">{rows.length} players → <strong>{selectedGroupObj?.name || 'Unassigned'}</strong></p>
                  <p className="text-on-surface-variant text-xs">Coach: {COACH.name} · Leader: {assignLeader ? (selectedGroupObj?.leaderName || 'From import') : 'None'}</p>
                </div>
              )}
            </div>

            <div className="flex justify-between gap-3">
              <button onClick={() => setStep(1)} className="px-5 py-2.5 border border-outline-variant text-on-surface font-bold rounded-xl text-sm hover:bg-surface-variant transition-all">Back</button>
              <button
                onClick={handleImport}
                disabled={!assignGroup || isDemoMode}
                title={isDemoMode ? "Login required to import players" : ""}
                className="px-7 py-2.5 bg-[#0cca75] text-black font-black rounded-xl text-sm hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <span className="material-symbols-outlined text-base">upload</span>
                {isDemoMode ? 'Import (Demo Only)' : `Import ${rows.length} Players`}
              </button>
            </div>
          </div>
        )}

        {/* ── DONE ── */}
        {done && (
          <div className="flex flex-col items-center justify-center py-12 gap-6 text-center">
            <div className="w-24 h-24 rounded-full bg-[#0cca75]/20 flex items-center justify-center animate-bounce">
              <span className="material-symbols-outlined text-[#0cca75] text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
            </div>
            <div>
              <h2 className="text-3xl font-black text-on-surface">Import Successful!</h2>
              <p className="text-on-surface-variant mt-2 text-lg">
                <strong className="text-on-surface">{rows.length} players</strong> added to{' '}
                <strong className="text-[#0cca75]">{selectedGroupObj?.name || 'Unassigned'}</strong>
              </p>
              {assignLeader && <p className="text-sm text-on-surface-variant mt-1">Group Leader: {selectedGroupObj?.leaderName || 'Assigned from import'}</p>}
            </div>
            <div className="grid grid-cols-3 gap-3 w-full max-w-xs">
              {[
                { label: 'Imported', value: rows.length, color: 'text-[#0cca75]' },
                { label: 'Skipped', value: 0, color: 'text-yellow-400' },
                { label: 'Errors', value: 0, color: 'text-red-400' },
              ].map(s => (
                <div key={s.label} className="bg-surface-container rounded-xl p-3 border border-outline-variant/20">
                  <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] text-on-surface-variant uppercase font-bold">{s.label}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={reset} className="px-6 py-3 border border-outline-variant text-on-surface font-bold rounded-xl hover:bg-surface-variant transition-all">
                Import Another
              </button>
              <button onClick={() => navigate('/coach/groups')} className="px-6 py-3 bg-[#0cca75] text-black font-black rounded-xl hover:brightness-110 transition-all">
                View Groups
              </button>
            </div>
          </div>
        )}
      </div>
      <BottomNav />
    </DashboardLayout>
  )
}
