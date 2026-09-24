import React from 'react'

const emptyBatch = {
  batchNumber: '',
  courseName: '',
  startingDate: '',
  endingDate: '',
  classTime: '',
  faculty: '',
  remarks: '',
  zoomLink: '',
  googleClassroomLink: '',
  classType: 'Batch',
}

const formatDate = (date) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(`${date}T00:00:00`))

const getBatchState = (batch) => {
  const today = new Date().toISOString().slice(0, 10)
  if (batch.startingDate > today) return 'Upcoming'
  if (batch.endingDate < today) return 'Completed'
  return 'Running'
}

const formatTime = (time, remarks = '') => {
  const storedTime = time || remarks.match(/@(\d{1,2})(?::(\d{2}))?\s*(am|pm)/i)?.[0].slice(1)
  if (!storedTime) return '-'
  const match = storedTime.match(/(\d{1,2})(?::(\d{2}))?\s*(am|pm)?/i)
  let hour = Number(match[1])
  const minute = match[2] || '00'
  if (match[3]?.toLowerCase() === 'pm' && hour < 12) hour += 12
  if (match[3]?.toLowerCase() === 'am' && hour === 12) hour = 0
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' }).format(new Date(`1970-01-01T${String(hour).padStart(2, '0')}:${minute}:00`))
}

const RunningUpcomingDemoBatches = () => {
  const [batches, setBatches] = React.useState([])
  const [form, setForm] = React.useState(emptyBatch)
  const [activeView, setActiveView] = React.useState('details')
  const [showBatchForm, setShowBatchForm] = React.useState(false)
  const [message, setMessage] = React.useState('')
  const [messageType, setMessageType] = React.useState('success')
  const [isSaving, setIsSaving] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)

  const loadBatches = React.useCallback(async () => {
    try {
      const response = await fetch('http://localhost:3001/api/batches')
      if (!response.ok) throw new Error('Unable to load batch details.')
      setBatches(await response.json())
      setMessage('')
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Unable to load batch details.')
    } finally {
      setIsLoading(false)
    }
  }, [])

  React.useEffect(() => {
    loadBatches()
  }, [loadBatches])

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      const response = await fetch('http://localhost:3001/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to save batch details.')

      setBatches((previous) => [...previous, result.batch])
      setForm(emptyBatch)
      setMessageType('success')
      setMessage('Batch details saved successfully.')
      setActiveView('details')
    } catch (error) {
      setMessageType('error')
      setMessage(error.message || 'Unable to save batch details.')
    } finally {
      setIsSaving(false)
    }
  }

  const upcomingBatches = batches.filter((batch) => getBatchState(batch) === 'Upcoming')
  const demoClasses = batches.filter((batch) => batch.classType === 'Demo class')
  const visibleBatches = activeView === 'upcoming' ? upcomingBatches : activeView === 'demo' ? demoClasses : batches

  return (
    <main className="batch-workspace">
      <header className="batch-workspace-header">
        <div>
          <p className="dashboard-kicker">Learning schedule</p>
          <h1>Batch details</h1>
          <p>Manage running batches, upcoming starts, and demo classes from one place.</p>
        </div>
        <div className="batch-counts"><strong>{batches.length}</strong><span>Total batches</span></div>
      </header>

      <nav className="batch-tabs" aria-label="Batch views">
        <button type="button" className={activeView === 'details' ? 'batch-tab-active' : ''} onClick={() => setActiveView('details')}>Batch details</button>
        <button type="button" className={activeView === 'upcoming' ? 'batch-tab-active' : ''} onClick={() => setActiveView('upcoming')}>Upcoming batches <span>{upcomingBatches.length}</span></button>
        <button type="button" className={activeView === 'demo' ? 'batch-tab-active' : ''} onClick={() => setActiveView('demo')}>Demo classes <span>{demoClasses.length}</span></button>
      </nav>

      {activeView === 'details' && (
        <div className="batch-list-action-row"><button type="button" className="admission-primary-button" onClick={() => { setForm(emptyBatch); setMessage(''); setShowBatchForm(true) }}>Add batch details</button></div>
      )}

      <section className="batch-list-panel" aria-labelledby="batch-list-title">
        <div className="batch-section-heading">
          <div><p className="dashboard-kicker">{activeView === 'details' ? 'All schedules' : activeView === 'upcoming' ? 'Next starts' : 'Open sessions'}</p><h2 id="batch-list-title">{activeView === 'details' ? 'Saved batch details' : activeView === 'upcoming' ? 'Upcoming batches' : 'Demo classes'}</h2></div>
          <span>{visibleBatches.length} record{visibleBatches.length === 1 ? '' : 's'}</span>
        </div>
        {isLoading ? <p className="batch-empty">Loading batch details...</p> : visibleBatches.length === 0 ? <p className="batch-empty">No batch records found.</p> : (
          <div className="batch-table-wrap">
            <table className="batch-table">
              <thead><tr><th>Batch no.</th><th>Course</th><th>Schedule</th><th>Class time</th><th>Faculty</th><th>Type</th><th>Status</th><th>Links</th><th>Remarks</th></tr></thead>
              <tbody>{visibleBatches.map((batch) => (
                <tr key={batch.id}>
                  <td><strong>{batch.batchNumber}</strong></td><td>{batch.courseName}</td>
                  <td>{formatDate(batch.startingDate)}<br />to {formatDate(batch.endingDate)}</td>
                  <td>{formatTime(batch.classTime, batch.remarks)}</td>
                  <td>{batch.faculty || '-'}</td>
                  <td>{batch.classType}</td>
                  <td><span className={`batch-status batch-status-${getBatchState(batch).toLowerCase()}`}>{getBatchState(batch)}</span></td>
                  <td className="batch-links"><a href={batch.zoomLink} target="_blank" rel="noreferrer">Zoom</a><a href={batch.googleClassroomLink} target="_blank" rel="noreferrer">Classroom</a></td><td>{batch.remarks}</td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        )}
      </section>

      {showBatchForm && (
        <div className="dashboard-modal batch-form-modal" role="dialog" aria-modal="true" aria-labelledby="batch-entry-title">
          <div className="dashboard-modal-panel compact-modal-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="batch-entry-title">Add batch details</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowBatchForm(false)}>Close</button>
            </div>
            <section className="batch-entry-panel" aria-label="Batch entry form">
              <div className="batch-section-heading"><p className="dashboard-kicker">New schedule</p><span>Saved to batches.json</span></div>
              <form onSubmit={handleSubmit} className="batch-form">
                <label>Batch no.<input name="batchNumber" value={form.batchNumber} onChange={updateField} placeholder="UIUX-SEP-01" required /></label>
                <label>Course name<input name="courseName" value={form.courseName} onChange={updateField} placeholder="UI/UX Design" required /></label>
                <label>Starting date<input name="startingDate" type="date" value={form.startingDate} onChange={updateField} required /></label>
                <label>Ending date<input name="endingDate" type="date" value={form.endingDate} onChange={updateField} required /></label>
                <label>Class time<input name="classTime" type="time" value={form.classTime} onChange={updateField} required /></label>
                <label>Faculty<input name="faculty" value={form.faculty} onChange={updateField} placeholder="Faculty name" required /></label>
                <label>Class type<select name="classType" value={form.classType} onChange={updateField}><option>Batch</option><option>Upcoming batch</option><option>Demo class</option></select></label>
                <label className="batch-wide-field">Remarks<textarea name="remarks" value={form.remarks} onChange={updateField} placeholder="Schedule or trainer notes" rows="2" required /></label>
                <label>Zoom link<input name="zoomLink" type="url" value={form.zoomLink} onChange={updateField} placeholder="https://zoom.us/j/..." required /></label>
                <label>Google Classroom link<input name="googleClassroomLink" type="url" value={form.googleClassroomLink} onChange={updateField} placeholder="https://classroom.google.com/..." required /></label>
                <div className="batch-form-actions batch-wide-field">
                  <button type="submit" className="admission-primary-button" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save batch details'}</button>
                  <button type="button" className="admission-secondary-button" onClick={() => setForm(emptyBatch)} disabled={isSaving}>Clear</button>
                  {message && <span className={messageType === 'error' ? 'batch-error' : 'batch-success'} role={messageType === 'error' ? 'alert' : 'status'}>{message}</span>}
                </div>
              </form>
            </section>
          </div>
        </div>
      )}
    </main>
  )
}

export default RunningUpcomingDemoBatches
