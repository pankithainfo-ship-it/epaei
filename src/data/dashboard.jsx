import React from 'react'
import studentDetails from './studentDetails.json'

const chartColors = ['#2457d6', '#f28f3b', '#2c9c72', '#c94c7b', '#7b61c9', '#1b9aaa', '#e05d44']

const formatDate = (date) => new Intl.DateTimeFormat('en-IN', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
}).format(new Date(`${date}T00:00:00`))

const Dashboard = ({ user = 'Student', onLogout }) => {
  const [selectedCourse, setSelectedCourse] = React.useState('All courses')
  const [selectedDate, setSelectedDate] = React.useState('All dates')

  const courses = ['All courses', ...new Set(studentDetails.flatMap((student) => student.courses))]
  const dates = ['All dates', ...new Set(studentDetails.map((student) => student.date))]

  const filteredStudents = studentDetails.filter((student) => {
    const matchesCourse = selectedCourse === 'All courses' || student.courses.includes(selectedCourse)
    const matchesDate = selectedDate === 'All dates' || student.date === selectedDate
    return matchesCourse && matchesDate
  })

  const courseCounts = courses.slice(1).map((course, index) => ({
    label: course,
    count: studentDetails.filter((student) => student.courses.includes(course)).length,
    color: chartColors[index % chartColors.length],
  }))
  const dateCounts = dates.slice(1).map((date, index) => ({
    label: date,
    count: studentDetails.filter((student) => (
      student.date === date && (selectedCourse === 'All courses' || student.courses.includes(selectedCourse))
    )).length,
    color: chartColors[index % chartColors.length],
  }))
  const pieItems = selectedCourse === 'All courses' ? courseCounts : dateCounts
  const totalCourseSelections = courseCounts.reduce((total, item) => total + item.count, 0)
  let chartStart = 0
  const chartGradient = pieItems.map(({ count, color }) => {
    const end = chartStart + (count / totalCourseSelections) * 100
    const segment = `${color} ${chartStart}% ${end}%`
    chartStart = end
    return segment
  }).join(', ')

  return (
    <main className="dashboard-page">
      <header className="dashboard-topbar">
        <div>
          <p className="dashboard-kicker">Enrollment overview</p>
          <h1>Student dashboard</h1>
          <p className="dashboard-welcome">Track course interest and daily student registrations.</p>
        </div>
        <div className="dashboard-user">
          <span className="dashboard-avatar">{user.charAt(0).toUpperCase()}</span>
          <span>{user}</span>
          <button type="button" onClick={onLogout}>Log out</button>
        </div>
      </header>

      <section className="dashboard-stats" aria-label="Enrollment summary">
        <article className="dashboard-stat">
          <span>Total students</span>
          <strong>{studentDetails.length}</strong>
          <small>Across all enrollment dates</small>
        </article>
        <article className="dashboard-stat">
          <span>Course selections</span>
          <strong>{totalCourseSelections}</strong>
          <small>Students can select multiple courses</small>
        </article>
        <article className="dashboard-stat dashboard-stat-accent">
          <span>Current result</span>
          <strong>{filteredStudents.length}</strong>
          <small>{selectedCourse} · {selectedDate}</small>
        </article>
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card chart-card">
          <div className="dashboard-card-heading">
            <div>
              <p className="dashboard-kicker">Course distribution</p>
              <h2>{selectedCourse === 'All courses' ? 'Students by course' : `${selectedCourse} by date`}</h2>
            </div>
            <label className="dashboard-select-label">
              Course
              <select value={selectedCourse} onChange={(event) => setSelectedCourse(event.target.value)}>
                {courses.map((course) => <option key={course}>{course}</option>)}
              </select>
            </label>
          </div>
          <div className="pie-layout">
            <div
              className="pie-chart"
              style={{ background: `conic-gradient(${chartGradient})` }}
              role="img"
              aria-label="Pie chart showing student course selections"
            >
              <div className="pie-hole"><strong>{filteredStudents.length}</strong><span>students</span></div>
            </div>
            <div className="chart-legend">
              {pieItems.map(({ label, count, color }) => (
                <div className="legend-row" key={label}>
                  <span className="legend-swatch" style={{ background: color }} />
                  <span>{selectedCourse === 'All courses' ? label : formatDate(label)}</span>
                  <strong>{count}</strong>
                </div>
              ))}
            </div>
          </div>
        </article>

        <article className="dashboard-card date-card">
          <div className="dashboard-card-heading">
            <div>
              <p className="dashboard-kicker">Date analysis</p>
              <h2>Daily registrations</h2>
            </div>
            <label className="dashboard-select-label">
              Date
              <select value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)}>
                {dates.map((date) => <option key={date} value={date}>{date === 'All dates' ? date : formatDate(date)}</option>)}
              </select>
            </label>
          </div>
          <div className="date-list">
            {dateCounts.map(({ label: date, count }) => (
              <div className={`date-row ${selectedDate === date ? 'date-row-selected' : ''}`} key={date}>
                <span>{formatDate(date)}</span>
                <div className="date-bar"><i style={{ width: `${Math.max(count * 100, 4)}%` }} /></div>
                <strong>{count}</strong>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="dashboard-card results-card">
        <div className="dashboard-card-heading">
          <div>
            <p className="dashboard-kicker">Filtered students</p>
            <h2>{filteredStudents.length} matching enrollment{filteredStudents.length === 1 ? '' : 's'}</h2>
          </div>
          <span className="results-context">{selectedCourse} / {selectedDate}</span>
        </div>
        <div className="student-list">
          {filteredStudents.map((student) => (
            <div className="student-row" key={student.id}>
              <span className="student-initial">{student.name.charAt(0)}</span>
              <div><strong>{student.name}</strong><small>{student.courses.join(' · ')}</small></div>
              <time dateTime={student.date}>{formatDate(student.date)}</time>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}

export default Dashboard
