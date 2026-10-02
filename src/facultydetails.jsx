import React from 'react'

const emptyAvailability = {
  faculty: '',
  date: '',
  startTime: '',
  endTime: '',
  notes: '',
}

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

const localDateString = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

const formatDate = (date) => {
  if (!date) return 'Date not set'
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

const formatTime = (time) => {
  if (!time) return '-'
  const [hours, minutes] = time.split(':').map(Number)
  return new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit' })
    .format(new Date(1970, 0, 1, hours, minutes))
}

const FacultyDetails = () => {
  const [batches, setBatches] = React.useState([])
  const [availability, setAvailability] = React.useState([])
  const [selectedFaculty, setSelectedFaculty] = React.useState('')
  const [form, setForm] = React.useState(emptyAvailability)
  const [batchForm, setBatchForm] = React.useState(emptyBatch)
  const [batchMode, setBatchMode] = React.useState('current')
  const [showForm, setShowForm] = React.useState(false)
  const [showBatchForm, setShowBatchForm] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(true)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isSavingBatch, setIsSavingBatch] = React.useState(false)
  const [loadError, setLoadError] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [batchMessage, setBatchMessage] = React.useState('')

  React.useEffect(() => {
    const loadFacultyDetails = async () => {
      try {
        const [batchResponse, availabilityResponse] = await Promise.all([
          fetch('http://localhost:3001/api/batches'),
          fetch('http://localhost:3001/api/faculty-availability'),
        ])
        if (availabilityResponse.status === 404) {
          throw new Error('Faculty availability API not found. Restart the API server with node server.js, then reload this page.')
        }
        if (!batchResponse.ok || !availabilityResponse.ok) throw new Error('Unable to load faculty schedule details.')
        const [batchRecords, availabilityRecords] = await Promise.all([
          batchResponse.json(),
          availabilityResponse.json(),
        ])
        setBatches(batchRecords)
        setAvailability(availabilityRecords)
      } catch (error) {
        setLoadError(error.message || 'Unable to load faculty schedule details. Start the API server and try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadFacultyDetails()
  }, [])

  const facultyNames = [...new Set([
    ...batches.map((batch) => batch.faculty),
    ...availability.map((record) => record.faculty),
  ].map((name) => String(name || '').trim()).filter(Boolean))].sort((first, second) => first.localeCompare(second))
  const matchesFaculty = (name) => selectedFaculty
    ? name?.trim().toLowerCase() === selectedFaculty.toLowerCase()
    : Boolean(name?.trim())
  const today = localDateString()
  const currentBatches = batches.filter((batch) => (
    matchesFaculty(batch.faculty) && batch.startingDate <= today && batch.endingDate >= today
  ))
  const futureBatches = batches.filter((batch) => matchesFaculty(batch.faculty) && batch.startingDate > today)
  const freeTimes = availability
    .filter((record) => matchesFaculty(record.faculty))
    .sort((first, second) => first.date.localeCompare(second.date) || first.startTime.localeCompare(second.startTime))

  const openForm = () => {
    setForm({ ...emptyAvailability, faculty: selectedFaculty })
    setMessage('')
    setShowForm(true)
  }

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const updateBatchField = (event) => {
    const { name, value } = event.target
    setBatchForm((previous) => ({ ...previous, [name]: value }))
  }

  const openBatchForm = (mode) => {
    setBatchMode(mode)
    setBatchForm({
      ...emptyBatch,
      faculty: selectedFaculty,
      classType: mode === 'future' ? 'Upcoming batch' : 'Batch',
    })
    setBatchMessage('')
    setShowBatchForm(true)
  }

  const handleBatchSubmit = async (event) => {
    event.preventDefault()
    const isCurrentDateRange = batchForm.startingDate <= today && batchForm.endingDate >= today
    const isFutureDateRange = batchForm.startingDate > today
    if (batchMode === 'current' && !isCurrentDateRange) {
      setBatchMessage('A current batch must include today in its date range.')
      return
    }
    if (batchMode === 'future' && !isFutureDateRange) {
      setBatchMessage('A future batch must start after today.')
      return
    }

    setIsSavingBatch(true)
    setBatchMessage('')
    try {
      const response = await fetch('http://localhost:3001/api/batches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchForm),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.message || 'Unable to save batch details.')

      setBatches((previous) => [...previous, result.batch])
      setSelectedFaculty(result.batch.faculty)
      setShowBatchForm(false)
    } catch (error) {
      setBatchMessage(error.message || 'Unable to save batch details.')
    } finally {
      setIsSavingBatch(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    try {
      const response = await fetch('http://localhost:3001/api/faculty-availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Faculty availability API not found. Restart the API server with node server.js, then try again.')
        }
        throw new Error(result.message || 'Unable to save faculty free time.')
      }

      setAvailability((previous) => [...previous, result.availability])
      setSelectedFaculty(result.availability.faculty)
      setShowForm(false)
    } catch (error) {
      setMessage(error.message || 'Unable to save faculty free time.')
    } finally {
      setIsSaving(false)
    }
  }

  const renderBatchList = (records, emptyText) => {
    if (isLoading) return <p className="faculty-empty">Loading batches...</p>
    if (records.length === 0) return <p className="faculty-empty">{emptyText}</p>
    return (
      <ul className="faculty-record-list">
        {records.map((batch) => (
          <li className="faculty-record" key={batch.id}>
            <div className="faculty-record-topline">
              <strong>{batch.batchNumber}</strong>
              <span>{batch.faculty || 'Faculty not assigned'}</span>
            </div>
            <p>{batch.courseName}</p>
            <div className="faculty-record-meta">
              <span>{formatDate(batch.startingDate)} to {formatDate(batch.endingDate)}</span>
              <span>{formatTime(batch.classTime)}</span>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  return (
    <main className="faculty-workspace">
      <header className="faculty-workspace-header">
        <div>
          <p className="dashboard-kicker">Teaching schedule</p>
          <h1>Faculty details</h1>
          <p>Review assigned batches and available teaching hours.</p>
        </div>
        <div className="faculty-header-actions">
          <label className="faculty-select-label">
            Faculty
            <select value={selectedFaculty} onChange={(event) => setSelectedFaculty(event.target.value)}>
              <option value="">All faculty</option>
              {facultyNames.map((name) => <option value={name} key={name}>{name}</option>)}
            </select>
          </label>
          <button type="button" className="admission-secondary-button" onClick={() => openBatchForm('current')}>Add current batch</button>
          <button type="button" className="admission-secondary-button" onClick={() => openBatchForm('future')}>Add future batch</button>
          <button type="button" className="admission-primary-button" onClick={openForm}>Add free time</button>
        </div>
      </header>

      {loadError && <p className="faculty-error" role="alert">{loadError}</p>}

      <div className="faculty-schedule-grid">
        <section className="faculty-schedule-panel" aria-labelledby="faculty-current-title">
          <div className="faculty-panel-heading">
            <div><p className="dashboard-kicker">In progress</p><h2 id="faculty-current-title">Current batches</h2></div>
            <strong>{currentBatches.length}</strong>
          </div>
          {renderBatchList(currentBatches, 'No current batches for this faculty.')}
        </section>

        <section className="faculty-schedule-panel" aria-labelledby="faculty-future-title">
          <div className="faculty-panel-heading">
            <div><p className="dashboard-kicker">Scheduled next</p><h2 id="faculty-future-title">Future batches</h2></div>
            <strong>{futureBatches.length}</strong>
          </div>
          {renderBatchList(futureBatches, 'No future batches for this faculty.')}
        </section>

        <section className="faculty-schedule-panel" aria-labelledby="faculty-free-title">
          <div className="faculty-panel-heading">
            <div><p className="dashboard-kicker">Open hours</p><h2 id="faculty-free-title">Faculty free timing</h2></div>
            <strong>{freeTimes.length}</strong>
          </div>
          {isLoading ? <p className="faculty-empty">Loading availability...</p> : freeTimes.length === 0 ? (
            <p className="faculty-empty">No free-time records for this faculty.</p>
          ) : (
            <ul className="faculty-record-list">
              {freeTimes.map((record) => (
                <li className="faculty-record" key={record.id}>
                  <div className="faculty-record-topline">
                    <strong>{record.faculty}</strong>
                    <span>{formatDate(record.date)}</span>
                  </div>
                  <p className="faculty-free-range">{formatTime(record.startTime)} – {formatTime(record.endTime)}</p>
                  {record.notes && <p className="faculty-record-note">{record.notes}</p>}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {showForm && (
        <div className="dashboard-modal faculty-form-modal" role="dialog" aria-modal="true" aria-labelledby="faculty-form-title">
          <div className="dashboard-modal-panel compact-modal-panel faculty-form-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="faculty-form-title">Add faculty free time</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowForm(false)}>Close</button>
            </div>
            <form className="faculty-form" onSubmit={handleSubmit}>
              <label>Faculty name<input name="faculty" value={form.faculty} onChange={updateField} placeholder="Faculty name" required /></label>
              <label>Date<input name="date" type="date" value={form.date} onChange={updateField} required /></label>
              <label>Available from<input name="startTime" type="time" value={form.startTime} onChange={updateField} required /></label>
              <label>Available until<input name="endTime" type="time" value={form.endTime} onChange={updateField} required /></label>
              <label className="faculty-form-wide">Notes<textarea name="notes" value={form.notes} onChange={updateField} rows="3" placeholder="Optional details" /></label>
              <div className="faculty-form-actions faculty-form-wide">
                <button type="submit" className="admission-primary-button" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save free time'}</button>
                <button type="button" className="admission-secondary-button" onClick={() => setShowForm(false)} disabled={isSaving}>Cancel</button>
                {message && <span className="batch-error" role="alert">{message}</span>}
              </div>
            </form>
          </div>
        </div>
      )}

      {showBatchForm && (
        <div className="dashboard-modal faculty-form-modal" role="dialog" aria-modal="true" aria-labelledby="faculty-batch-form-title">
          <div className="dashboard-modal-panel compact-modal-panel faculty-form-panel faculty-batch-form-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="faculty-batch-form-title">Add {batchMode} batch</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowBatchForm(false)}>Close</button>
            </div>
            <form className="faculty-form" onSubmit={handleBatchSubmit}>
              <label>Batch number<input name="batchNumber" value={batchForm.batchNumber} onChange={updateBatchField} placeholder="UIUX-OCT-01" required /></label>
              <label>Course name<input name="courseName" value={batchForm.courseName} onChange={updateBatchField} required /></label>
              <label>Starting date<input name="startingDate" type="date" value={batchForm.startingDate} onChange={updateBatchField} required /></label>
              <label>Ending date<input name="endingDate" type="date" value={batchForm.endingDate} onChange={updateBatchField} required /></label>
              <label>Class time<input name="classTime" type="time" value={batchForm.classTime} onChange={updateBatchField} required /></label>
              <label>Faculty name<input name="faculty" value={batchForm.faculty} onChange={updateBatchField} required /></label>
              <label className="faculty-form-wide">Remarks<textarea name="remarks" value={batchForm.remarks} onChange={updateBatchField} rows="2" required /></label>
              <label>Zoom link<input name="zoomLink" type="url" value={batchForm.zoomLink} onChange={updateBatchField} placeholder="https://" required /></label>
              <label>Google Classroom link<input name="googleClassroomLink" type="url" value={batchForm.googleClassroomLink} onChange={updateBatchField} placeholder="https://" required /></label>
              <div className="faculty-form-actions faculty-form-wide">
                <button type="submit" className="admission-primary-button" disabled={isSavingBatch}>{isSavingBatch ? 'Saving...' : 'Save batch'}</button>
                <button type="button" className="admission-secondary-button" onClick={() => setShowBatchForm(false)} disabled={isSavingBatch}>Cancel</button>
                {batchMessage && <span className="batch-error" role="alert">{batchMessage}</span>}
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  )
}

export default FacultyDetails
