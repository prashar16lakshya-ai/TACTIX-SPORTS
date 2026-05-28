import jsPDF from 'jspdf'
import 'jspdf-autotable'

/**
 * Generate a professional Parent Report Card PDF
 */
export function generateParentReportPDF({
  playerName = 'Student',
  teamName = 'Team',
  schoolName = 'School',
  attendanceData = {},
  performanceData = [],
  remarks = [],
  fitnessResults = null,
}) {
  const doc = new jsPDF('p', 'mm', 'a4')
  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 15
  const contentWidth = pageWidth - margin * 2
  let y = margin

  // Colors
  const crimson = [220, 20, 60]
  const dark = [10, 10, 10]
  const gray = [120, 120, 120]
  const lightGray = [245, 245, 245]

  // ── Header ──────────────────────────────────────────────────
  doc.setFillColor(...crimson)
  doc.rect(0, 0, pageWidth, 35, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('TACTIX SPORT', margin, 15)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Student Performance Report Card', margin, 22)
  doc.text(schoolName, margin, 29)

  // Date on right side
  const dateStr = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })
  doc.setFontSize(9)
  doc.text(dateStr, pageWidth - margin, 29, { align: 'right' })

  y = 45

  // ── Player Info ─────────────────────────────────────────────
  doc.setTextColor(...dark)
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.text(playerName, margin, y)
  y += 6
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...gray)
  doc.text(`Team: ${teamName}`, margin, y)
  y += 12

  // ── Attendance Summary ──────────────────────────────────────
  doc.setTextColor(...crimson)
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('ATTENDANCE SUMMARY (Last 30 Days)', margin, y)
  y += 3

  // Divider line
  doc.setDrawColor(...crimson)
  doc.setLineWidth(0.5)
  doc.line(margin, y, margin + contentWidth, y)
  y += 5

  const att = attendanceData
  doc.autoTable({
    startY: y,
    head: [['Present', 'Absent', 'Holidays', 'Total Days', 'Percentage']],
    body: [[
      att.present || 0,
      att.absent || 0,
      att.holidays || 0,
      att.total || 0,
      `${att.percentage || 0}%`
    ]],
    styles: { fontSize: 10, cellPadding: 4 },
    headStyles: { fillColor: crimson, textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: lightGray },
    margin: { left: margin, right: margin },
  })

  y = doc.lastAutoTable.finalY + 12

  // ── Performance Trend ───────────────────────────────────────
  if (performanceData.length > 0) {
    doc.setTextColor(...crimson)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('PERFORMANCE TREND', margin, y)
    y += 3
    doc.setDrawColor(...crimson)
    doc.line(margin, y, margin + contentWidth, y)
    y += 5

    const scores = performanceData.map(p => p.score)
    const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
    const highest = Math.max(...scores)
    const latest = scores[scores.length - 1]
    const trend = latest >= scores[0] ? '↑ Improving' : '↓ Declining'

    doc.autoTable({
      startY: y,
      head: [['Date', 'Score']],
      body: performanceData.map(p => [p.date, `${p.score}/100`]),
      styles: { fontSize: 10, cellPadding: 3 },
      headStyles: { fillColor: crimson, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: lightGray },
      margin: { left: margin, right: margin },
    })

    y = doc.lastAutoTable.finalY + 5
    doc.setTextColor(...dark)
    doc.setFontSize(9)
    doc.text(`Average: ${avg}/100  |  Highest: ${highest}/100  |  Trend: ${trend}`, margin, y)
    y += 12
  }

  // ── Coach Remarks ───────────────────────────────────────────
  if (remarks.length > 0) {
    doc.setTextColor(...crimson)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('COACH REMARKS', margin, y)
    y += 3
    doc.setDrawColor(...crimson)
    doc.line(margin, y, margin + contentWidth, y)
    y += 6

    doc.setTextColor(...dark)
    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    remarks.forEach(r => {
      if (y > 260) { doc.addPage(); y = margin }
      doc.setFont('helvetica', 'bold')
      doc.text(r.date || '', margin, y)
      doc.setFont('helvetica', 'italic')
      const lines = doc.splitTextToSize(`"${r.text}"`, contentWidth - 30)
      doc.text(lines, margin + 30, y)
      y += lines.length * 5 + 4
    })
    y += 6
  }

  // ── Fitness Test Results ────────────────────────────────────
  if (fitnessResults) {
    if (y > 230) { doc.addPage(); y = margin }

    doc.setTextColor(...crimson)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('FITNESS TEST RESULTS', margin, y)
    y += 3
    doc.setDrawColor(...crimson)
    doc.line(margin, y, margin + contentWidth, y)
    y += 5

    const fitnessBody = Object.entries(fitnessResults).map(([key, val]) => {
      const label = key === 'beepTest' ? 'Beep Test Level' :
                    key === 'pushups' ? 'Push-up Count' :
                    key === 'sitAndReach' ? 'Sit & Reach (cm)' : key
      const status = val.status === 'above' ? 'Above Average' :
                     val.status === 'below' ? 'Below Average' : 'Average'
      return [label, val.score, val.avg, status]
    })

    doc.autoTable({
      startY: y,
      head: [['Metric', 'Score', 'Team Avg', 'Status']],
      body: fitnessBody,
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: crimson, textColor: [255, 255, 255] },
      alternateRowStyles: { fillColor: lightGray },
      margin: { left: margin, right: margin },
    })
    y = doc.lastAutoTable.finalY + 8
  }

  // ── Footer ──────────────────────────────────────────────────
  const pageHeight = doc.internal.pageSize.getHeight()
  doc.setDrawColor(200, 200, 200)
  doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15)
  doc.setTextColor(...gray)
  doc.setFontSize(8)
  doc.text('Generated by TACTIX Sport · Confidential', margin, pageHeight - 10)
  doc.text(dateStr, pageWidth - margin, pageHeight - 10, { align: 'right' })

  return doc
}

/**
 * Share or download a PDF
 */
export async function sharePDF(doc, fileName = 'report.pdf') {
  const blob = doc.output('blob')
  const file = new File([blob], fileName, { type: 'application/pdf' })

  // Try native share (works on mobile browsers and Capacitor)
  if (navigator.share && navigator.canShare?.({ files: [file] })) {
    try {
      await navigator.share({
        title: fileName.replace('.pdf', ''),
        files: [file],
      })
      return { shared: true }
    } catch (err) {
      if (err.name === 'AbortError') return { shared: false, cancelled: true }
      // Fall through to download
    }
  }

  // Fallback: trigger download
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  return { shared: false, downloaded: true }
}
