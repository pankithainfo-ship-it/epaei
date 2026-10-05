import React from 'react'

const chartColors = ['#2457d6', '#f28f3b', '#2c9c72', '#c94c7b', '#7b61c9', '#1b9aaa']

const localDateString = () => {
  const today = new Date()
  return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

const FacultyAnalytics = () => {
  const [batches, setBatches] = React.useState([])
  const [availability, setAvailability] = React.useState([])
  const [selectedFaculty, setSelectedFaculty] = React.useState('All faculty')
  const [isLoading, setIsLoading] = React.useState(true)
  const [loadError, setLoadError] = React.useState('')

  React.useEffect(() => {
    const loadFacultyAnalytics = async () => {
      try {
        const [batchResponse, availabilityResponse] = await Promise.all([
          fetch('http://localhost:3001/api/batches'),
          fetch('http://localhost:3001/api/faculty-availability'),
        ])
        if (!batchResponse.ok || !availabilityResponse.ok) {
          throw new Error('Unable to load faculty analytics.')
        }
        const [batchRecords, availabilityRecords] = await Promise.all([
          batchResponse.json(),
          availabilityResponse.json(),
        ])
        setBatches(batchRecords)
        setAvailability(availabilityRecords)
      } catch (error) {
        setLoadError(error.message || 'Unable to load faculty analytics. Start the API server and try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadFacultyAnalytics()
  }, [])

  const facultyNames = [...new Set([
    ...batches.map((batch) => batch.faculty),
    ...availability.map((record) => record.faculty),
  ].map((name) => String(name || '').trim()).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second))
  const isSelectedFaculty = (name) => selectedFaculty === 'All faculty' ||
    String(name || '').trim().toLowerCase() === selectedFaculty.toLowerCase()
  const filteredBatches = batches.filter((batch) => isSelectedFaculty(batch.faculty))
  const filteredAvailability = availability.filter((record) => isSelectedFaculty(record.faculty))
  const today = localDateString()
  const statusCounts = [
    { label: 'Current', count: filteredBatches.filter((batch) => batch.startingDate <= today && batch.endingDate >= today).length },
    { label: 'Upcoming', count: filteredBatches.filter((batch) => batch.startingDate > today).length },
    { label: 'Completed', count: filteredBatches.filter((batch) => batch.endingDate < today).length },
  ]
  const courseCounts = [...new Set(filteredBatches.map((batch) => String(batch.courseName || '').trim()).filter(Boolean))]
    .sort((first, second) => first.localeCompare(second))
    .map((course) => ({
      label: course,
      count: filteredBatches.filter((batch) => String(batch.courseName || '').trim() === course).length,
    }))
  const weekdayCounts = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    .map((weekday, day) => ({
      label: weekday,
      count: filteredAvailability.filter((record) => record.date && new Date(`${record.date}T00:00:00`).getDay() === day).length,
    }))
    .filter((item) => item.count > 0)
  const totalAvailabilityHours = filteredAvailability.reduce((total, record) => {
    if (!record.startTime || !record.endTime) return total
    const [startHour, startMinute] = record.startTime.split(':').map(Number)
    const [endHour, endMinute] = record.endTime.split(':').map(Number)
    const duration = (endHour * 60 + endMinute) - (startHour * 60 + startMinute)
    return total + (duration > 0 ? duration / 60 : 0)
  }, 0)
  const activeFacultyCount = new Set([
    ...filteredBatches.map((batch) => String(batch.faculty || '').trim().toLowerCase()),
    ...filteredAvailability.map((record) => String(record.faculty || '').trim().toLowerCase()),
  ].filter(Boolean)).size

  const renderPieChart = (items, title, unit) => {
    const chartTotal = items.reduce((total, item) => total + item.count, 0)
    let chartStart = 0
    const chartGradient = items.map((item, index) => {
      const chartEnd = chartStart + (item.count / (chartTotal || 1)) * 100
      const segment = `${chartColors[index % chartColors.length]} ${chartStart}% ${chartEnd}%`
      chartStart = chartEnd
      return segment
    }).join(', ')

    return (
      <article className="dashboard-card faculty-analytics-card">
        <div className="dashboard-card-heading">
          <div><p className="dashboard-kicker">Distribution</p><h2>{title}</h2></div>
        </div>
        {chartTotal === 0 ? (
          <p className="faculty-empty">No records available for this chart.</p>
        ) : (
          <div className="pie-layout">
            <div className="pie-chart" style={{ background: `conic-gradient(${chartGradient})` }} role="img" aria-label={`${title} pie chart`}>
              <div className="pie-hole"><strong>{chartTotal}</strong><span>{unit}</span></div>
            </div>
            <div className="chart-legend">
              {items.filter((item) => item.count > 0).map((item) => {
                const colorIndex = items.indexOf(item)
                return (
                  <div className="legend-row" key={item.label}>
                    <span className="legend-swatch" style={{ background: chartColors[colorIndex % chartColors.length] }} />
                    <span>{item.label}</span>
                    <strong>{item.count}</strong>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </article>
    )
  }

  return (
    <main className="faculty-analytics">
      <header className="faculty-analytics-header">
        <div>
          <p className="dashboard-kicker">Faculty overview</p>
          <h1>Faculty analytics</h1>
          <p>Explore batch assignments and available teaching hours.</p>
        </div>
        <label className="dashboard-select-label">
          Faculty
          <select value={selectedFaculty} onChange={(event) => setSelectedFaculty(event.target.value)}>
            <option>All faculty</option>
            {facultyNames.map((name) => <option value={name} key={name}>{name}</option>)}
          </select>
        </label>
      </header>

      {loadError && <p className="faculty-error" role="alert">{loadError}</p>}

      <section className="faculty-analytics-stats" aria-label="Faculty analytics summary">
        <article className="dashboard-stat"><span>Total batches</span><strong>{isLoading ? '—' : filteredBatches.length}</strong><small>Across selected faculty</small></article>
        <article className="dashboard-stat"><span>Faculty represented</span><strong>{isLoading ? '—' : activeFacultyCount}</strong><small>With batches or availability</small></article>
        <article className="dashboard-stat dashboard-stat-accent"><span>Available hours</span><strong>{isLoading ? '—' : totalAvailabilityHours.toFixed(1)}</strong><small>From recorded free-time slots</small></article>
      </section>

      {isLoading ? (
        <p className="faculty-empty">Loading faculty analytics...</p>
      ) : (
        <section className="faculty-analytics-grid" aria-label="Faculty pie chart analysis">
          {renderPieChart(statusCounts, 'Batches by status', 'batches')}
          {renderPieChart(courseCounts, 'Batches by course', 'batches')}
          {renderPieChart(weekdayCounts, 'Free-time slots by weekday', 'slots')}
        </section>
      )}
    </main>
  )
}

export default FacultyAnalytics
