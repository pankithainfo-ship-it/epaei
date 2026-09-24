import React from 'react'
import studentDetails from './studentDetails.json'

const chartColors = ['#2457d6', '#f28f3b', '#2c9c72', '#c94c7b', '#7b61c9', '#1b9aaa']

const formatDate = (date) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(`${date}T00:00:00`))

const money = (value) => `₹${Number(value || 0).toLocaleString('en-IN')}`

export const EnrollmentDashboard = ({ user = 'Student', onLogout }) => {
  const [selectedCourse, setSelectedCourse] = React.useState('All courses')
  const [selectedDate, setSelectedDate] = React.useState('All dates')
  const courses = ['All courses', ...new Set(studentDetails.flatMap((student) => student.courses))]
  const dates = ['All dates', ...new Set(studentDetails.map((student) => student.date))]
  const filteredStudents = studentDetails.filter((student) => (
    (selectedCourse === 'All courses' || student.courses.includes(selectedCourse)) &&
    (selectedDate === 'All dates' || student.date === selectedDate)
  ))
  const courseCounts = courses.slice(1).map((course, index) => ({
    label: course,
    count: studentDetails.filter((student) => student.courses.includes(course)).length,
    color: chartColors[index % chartColors.length],
  }))
  const dateCounts = dates.slice(1).map((date, index) => ({
    label: date,
    count: studentDetails.filter((student) => student.date === date).length,
    color: chartColors[index % chartColors.length],
  }))
  const chartItems = selectedCourse === 'All courses' ? courseCounts : dateCounts
  const chartTotal = chartItems.reduce((total, item) => total + item.count, 0) || 1
  let chartStart = 0
  const chartGradient = chartItems.map(({ count, color }) => {
    const chartEnd = chartStart + (count / chartTotal) * 100
    const segment = `${color} ${chartStart}% ${chartEnd}%`
    chartStart = chartEnd
    return segment
  }).join(', ')

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <div><p className="dashboard-kicker">Enrollment overview</p><h1>Student dashboard</h1><p className="dashboard-welcome">Track course interest and daily student registrations.</p></div>
        <div className="dashboard-user"><span className="dashboard-avatar">{String(user).charAt(0).toUpperCase()}</span><span>{user}</span><button type="button" onClick={onLogout}>Log out</button></div>
      </header>
      <section className="dashboard-stats" aria-label="Enrollment summary">
        <article className="dashboard-stat"><span>Total students</span><strong>{studentDetails.length}</strong><small>Across all enrollment dates</small></article>
        <article className="dashboard-stat"><span>Course selections</span><strong>{courseCounts.reduce((total, item) => total + item.count, 0)}</strong><small>Students can select multiple courses</small></article>
        <article className="dashboard-stat dashboard-stat-accent"><span>Current result</span><strong>{filteredStudents.length}</strong><small>{selectedCourse} · {selectedDate}</small></article>
      </section>
      <section className="dashboard-grid">
        <article className="dashboard-card chart-card">
          <div className="dashboard-card-heading"><div><p className="dashboard-kicker">Course distribution</p><h2>{selectedCourse === 'All courses' ? 'Students by course' : `${selectedCourse} by date`}</h2></div><label className="dashboard-select-label">Course<select value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)}>{courses.map((course) => <option key={course}>{course}</option>)}</select></label></div>
          <div className="pie-layout"><div className="pie-chart" style={{ background: `conic-gradient(${chartGradient})` }} role="img" aria-label="Student course distribution"><div className="pie-hole"><strong>{filteredStudents.length}</strong><span>students</span></div></div><div className="chart-legend">{chartItems.map(({ label, count, color }) => <div className="legend-row" key={label}><span className="legend-swatch" style={{ background: color }} /><span>{selectedCourse === 'All courses' ? label : formatDate(label)}</span><strong>{count}</strong></div>)}</div></div>
        </article>
        <article className="dashboard-card date-card">
          <div className="dashboard-card-heading"><div><p className="dashboard-kicker">Date analysis</p><h2>Daily registrations</h2></div><label className="dashboard-select-label">Date<select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>{dates.map((date) => <option key={date}>{date === 'All dates' ? date : formatDate(date)}</option>)}</select></label></div>
          <div className="date-list">{dateCounts.map(({ label: date, count }) => <div className={`date-row ${selectedDate === date ? 'date-row-selected' : ''}`} key={date}><span>{formatDate(date)}</span><div className="date-bar"><i style={{ width: `${Math.max(count * 100, 4)}%` }} /></div><strong>{count}</strong></div>)}</div>
        </article>
      </section>
      <section className="dashboard-card results-card"><div className="dashboard-card-heading"><div><p className="dashboard-kicker">Filtered students</p><h2>{filteredStudents.length} matching enrollment{filteredStudents.length === 1 ? '' : 's'}</h2></div><span className="results-context">{selectedCourse} / {selectedDate}</span></div><div className="student-list">{filteredStudents.map((student) => <div className="student-row" key={student.id}><span className="student-initial">{student.name.charAt(0)}</span><div><strong>{student.name}</strong><small>{student.courses.join(' · ')}</small></div><time dateTime={student.date}>{formatDate(student.date)}</time></div>)}</div></section>
    </main>
  )
}

const Dashboard = ({ user = 'Student', role = 'student', onLogout }) => {
  const displayUser = typeof user === 'string' ? user : user?.username || 'Student'
  const [admissions, setAdmissions] = React.useState([])
  const [payments, setPayments] = React.useState([])
  const [loadError, setLoadError] = React.useState('')
  const [selectedStatus, setSelectedStatus] = React.useState('All statuses')

  React.useEffect(() => {
    const loadDashboard = async () => {
      try {
        const admissionResponse = await fetch('http://localhost:3001/api/admissions')
        if (!admissionResponse.ok) throw new Error('Unable to load admission details.')
        const admissionRecords = await admissionResponse.json()
        setAdmissions(admissionRecords)

        if (role === 'admin') {
          const paymentResponse = await fetch('http://localhost:3001/api/payments', { headers: { 'x-user-role': 'admin' } })
          if (!paymentResponse.ok) throw new Error('Unable to load payment details.')
          setPayments(await paymentResponse.json())
        }
        setLoadError('')
      } catch (error) {
        setLoadError(error.message || 'Unable to load dashboard details.')
      }
    }

    loadDashboard()
  }, [role])

  const statuses = ['All statuses', ...new Set(admissions.map((admission) => admission.status || 'Active'))]
  const filteredAdmissions = admissions.filter((admission) => selectedStatus === 'All statuses' || (admission.status || 'Active') === selectedStatus)
  const activeAdmissions = admissions.filter((admission) => (admission.status || 'Active') === 'Active').length
  const totalCollected = payments.reduce((total, payment) => total + Number(payment.amount || 0), 0)
  const totalDue = payments.reduce((total, payment) => total + Number(payment.due || 0), 0)
  const statusCounts = statuses.slice(1).map((status) => ({
    label: status,
    count: admissions.filter((admission) => (admission.status || 'Active') === status).length,
  }))
  const activeRatio = admissions.length ? (activeAdmissions / admissions.length) * 100 : 0

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <div>
          <p className="dashboard-kicker">Enrollment overview</p>
          <h1>Admissions & payments</h1>
          <p className="dashboard-welcome">A live view of enrollment activity and fee collection.</p>
        </div>
        <div className="dashboard-user">
          <span className="dashboard-avatar">{displayUser.charAt(0).toUpperCase()}</span>
          <span>{displayUser}</span>
          <button type="button" onClick={onLogout}>Log out</button>
        </div>
      </header>

      {loadError && <p className="dashboard-error" role="alert">{loadError}</p>}

      <section className="dashboard-stats" aria-label="Admissions and payment summary">
        <article className="dashboard-stat">
          <span>Total admissions</span>
          <strong>{admissions.length}</strong>
          <small>{activeAdmissions} currently active</small>
        </article>
        <article className="dashboard-stat">
          <span>Collected fees</span>
          <strong>{role === 'admin' ? money(totalCollected) : '—'}</strong>
          <small>{role === 'admin' ? `${payments.length} payment records` : 'Admin access required'}</small>
        </article>
        <article className="dashboard-stat dashboard-stat-accent">
          <span>Outstanding dues</span>
          <strong>{role === 'admin' ? money(totalDue) : '—'}</strong>
          <small>{role === 'admin' ? 'Across recorded payments' : 'Admin access required'}</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card chart-card">
          <div className="dashboard-card-heading">
            <div>
              <p className="dashboard-kicker">Admission status</p>
              <h2>Enrollment health</h2>
            </div>
            <label className="dashboard-select-label">
              Filter
              <select value={selectedStatus} onChange={(event) => setSelectedStatus(event.target.value)}>
                {statuses.map((status) => <option key={status}>{status}</option>)}
              </select>
            </label>
          </div>
          <div className="pie-layout">
            <div className="dashboard-ring" style={{ '--active-ratio': `${activeRatio}%` }} role="img" aria-label={`${activeAdmissions} active admissions out of ${admissions.length} total`}>
              <div className="pie-hole"><strong>{activeAdmissions}</strong><span>active</span></div>
            </div>
            <div className="chart-legend">
              {statusCounts.map(({ label, count }, index) => (
                <div className="legend-row" key={label}>
                  <span className={`legend-swatch legend-swatch-${index % 3}`} />
                  <span>{label}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="dashboard-card date-card">
          <div className="dashboard-card-heading">
            <div><p className="dashboard-kicker">Fee collection</p><h2>Recent payments</h2></div>
            {role === 'admin' && <strong className="dashboard-card-total">{money(totalCollected)}</strong>}
          </div>
          {role === 'admin' ? <div className="payment-list">
            {payments.slice(-5).reverse().map((payment) => (
              <div className="payment-row" key={payment.id}>
                <div><strong>{payment.studentName || payment.admissionNumber}</strong><small>{payment.paymentDate} · {payment.paymentMethod}</small></div>
                <div className="payment-amount"><strong>{money(payment.amount)}</strong><span className={`payment-status payment-status-${String(payment.status).toLowerCase().replaceAll(' ', '-')}`}>{payment.status}</span></div>
              </div>
            ))}
            {!payments.length && <p className="dashboard-empty">No payment records yet.</p>}
          </div> : <p className="dashboard-empty">Payment summaries are available to administrators.</p>}
        </article>
      </section>

      <section className="dashboard-card results-card">
        <div className="dashboard-card-heading">
          <div>
            <p className="dashboard-kicker">Admission register</p>
            <h2>{filteredAdmissions.length} matching admission{filteredAdmissions.length === 1 ? '' : 's'}</h2>
          </div>
          <span className="results-context">{selectedStatus}</span>
        </div>
        <div className="admission-summary-list">
          {filteredAdmissions.map((admission) => (
            <div className="admission-summary-row" key={admission.id}>
              <span className="student-initial">{admission.name.charAt(0).toUpperCase()}</span>
              <div><strong>{admission.name}</strong><small>{admission.admissionNumber} · {admission.course}</small></div>
              <time dateTime={admission.joiningDate}>{formatDate(admission.joiningDate)}</time>
            </div>
          ))}
          {!filteredAdmissions.length && <p className="dashboard-empty">No admission records match this filter.</p>}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
