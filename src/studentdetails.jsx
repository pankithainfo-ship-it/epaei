import React from 'react'
import StudentDetailsForm from './stddetailsform.jsx'
import Dashboard, { EnrollmentDashboard } from './data/dashboard.jsx'
import FeesDetails from './feesdetails.jsx'
import AdmissionDetails from './admissiondetails.jsx'
import RunningUpcomingDemoBatches from './running-upcoming-demo-batches.jsx'

const _legacyStudentData = [
  {
    id: 1,
    date: '2026-08-12',
    name: 'Aarav Sharma',
    courses: ['Mathematics', 'Physics', 'Chemistry'],
    qualification: 'B.Tech Computer Science',
    phone: '+91 98765 43210',
    remarks: 'Excellent student',
  },
  {
    id: 2,
    date: '2026-08-13',
    name: 'Ishaan Patel',
    courses: ['Biology', 'Chemistry', 'Physics'],
    qualification: 'B.Tech Mechanical Engineering',
    phone: '+91 98765 43211',
    remarks: 'Good performance'
  },
  {
    id: 3,
    date: '2026-08-14',
    name: 'Ananya Verma',
    courses: ['Computer Science', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Computer Science',
    phone: '+91 98765 43212',
    remarks: 'Outstanding student',
  },
  {
    id: 4,
    date: '2026-08-15',
    name: 'Rohan Mehta',
    courses: ['Electrical Engineering', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Electrical Engineering',
    phone: '+91 98765 43213',
    remarks: 'Average performance',
  },
  {
    id: 5,
    date: '2026-08-16',
    name: 'Saanvi Kapoor',
    courses: ['Civil Engineering', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Civil Engineering',
    phone: '+91 98765 43214',
    remarks: 'Good student',
  },
  {
    id: 6,
    date: '2026-08-17',
    name: 'Vivaan Reddy',
    courses: ['Computer Science', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Computer Science',
    phone: '+91 98765 43215',
    remarks: 'Excellent performance',
  },
  {
    id: 7,
    date: '2026-08-18',
    name: 'Aadhya Nair',
    courses: ['Mechanical Engineering', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Mechanical Engineering',
    phone: '+91 98765 43216',
    remarks: 'Good student',
  },
  {
    id: 8,
    date: '2026-08-19',
    name: 'Arjun Desai',
    courses: ['Electrical Engineering', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Electrical Engineering',
    phone: '+91 98765 43217',
    remarks: 'Average performance',
  },
  {
    id: 9,
    date: '2026-08-20',
    name: 'Myra Shah',
    courses: ['Civil Engineering', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Civil Engineering',
    phone: '+91 98765 43218',
    remarks: 'Good student',
  },
  {
    id: 10,
    date: '2026-08-21',
    name: 'Kabir Joshi',
    courses: ['Computer Science', 'Mathematics', 'Physics'],
    qualification: 'B.Tech Computer Science',
    phone: '+91 98765 43219',
    remarks: 'Outstanding performance',
  },
]

const styles = {
  page: {
    background: '#f5f0ea',
    minHeight: '100vh',
    padding: '32px 20px',
    fontFamily: 'Segoe UI, sans-serif',
  },
  wrapper: {
    maxWidth: '1280px',
    margin: '0 auto',
    background: '#ffffff',
    borderRadius: '20px',
    boxShadow: '0 18px 45px rgba(20, 28, 38, 0.08)',
    border: '1px solid rgba(17, 24, 39, 0.05)',
    overflow: 'hidden',
  },
  header: {
    background: 'linear-gradient(135deg, #f8efe3, #f3ece5)',
    padding: '28px 30px 20px',
    borderBottom: '1px solid rgba(17, 24, 39, 0.05)',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '16px',
    flexWrap: 'wrap',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    background: '#fff',
    border: '1px solid rgba(17, 24, 39, 0.08)',
    borderRadius: '12px',
    padding: '10px 14px',
  },
  userBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1d9b5',
    color: '#2a2d35',
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    fontWeight: 800,
  },
  userText: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    lineHeight: 1.2,
  },
  userLabel: {
    fontSize: '11px',
    color: '#5d6470',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontWeight: 700,
  },
  userName: {
    fontSize: '14px',
    color: '#23303b',
    fontWeight: 700,
  },
  logoutButton: {
    padding: '10px 14px',
    borderRadius: '10px',
    border: '1px solid rgba(17, 24, 39, 0.1)',
    background: '#ffffff',
    color: '#23303b',
    fontWeight: 700,
    cursor: 'pointer',
  },
  title: {
    margin: 0,
    color: '#18232e',
    fontSize: '2rem',
    letterSpacing: '-0.06em',
  },
  addButton: {
    padding: '11px 16px',
    border: 0,
    borderRadius: '10px',
    background: '#23303b',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  analyseButton: {
    padding: '11px 16px',
    border: 0,
    borderRadius: '10px',
    background: '#2457d6',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  searchBox: {
    width: '320px',
    maxWidth: '100%',
    padding: '12px 14px',
    borderRadius: '12px',
    border: '1px solid rgba(17, 24, 39, 0.1)',
    background: '#fff',
    color: '#23303b',
    fontSize: '14px',
    outline: 'none',
    boxShadow: '0 10px 20px rgba(17, 24, 39, 0.04)',
  },
  tableWrap: {
    overflowX: 'auto',
    padding: '20px 18px 28px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '980px',
    background: '#fff',
  },
  th: {
    textAlign: 'left',
    padding: '16px 18px',
    fontSize: '12px',
    fontWeight: 800,
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    background: '#f5f0e8',
    color: '#5d6470',
    borderBottom: '1px solid rgba(17, 24, 39, 0.08)',
  },
  td: {
    padding: '16px 18px',
    borderBottom: '1px solid rgba(17, 24, 39, 0.08)',
    color: '#23303b',
    fontSize: '15px',
    background: '#fff',
  },
  row: {
    transition: 'all 0.2s ease',
  },
  badge: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#edf9f1',
    color: '#1e8d61',
    fontWeight: 700,
    fontSize: '12px',
  },
}

const StudentDetails = ({ user = { username: 'Student', role: 'student' }, onLogout }) => {
  const [student, setStudent] = React.useState([])
  const [loadError, setLoadError] = React.useState('')
  const [showForm, setShowForm] = React.useState(false)
  const [editingStudent, setEditingStudent] = React.useState(null)
  const [deletingStudentId, setDeletingStudentId] = React.useState(null)
  const [currentPage, setCurrentPage] = React.useState(1)
  const [searchTerm, setSearchTerm] = React.useState('')
  const [showDashboard, setShowDashboard] = React.useState(false)
  const [showEnrollmentDashboard, setShowEnrollmentDashboard] = React.useState(false)
  const [showPaymentForm, setShowPaymentForm] = React.useState(false)
  const [showPayments, setShowPayments] = React.useState(false)
  const [showAdmissions, setShowAdmissions] = React.useState(false)
  const [showBatches, setShowBatches] = React.useState(false)
  const rowsPerPage = 6
  const isAdmin = user.role === 'admin'

  React.useEffect(() => {
    fetch('http://localhost:3001/api/students')
      .then((response) => {
        if (!response.ok) throw new Error('Unable to load student details')
        return response.json()
      })
      .then((records) => setStudent(records))
      .catch(() => setLoadError('Unable to load student details. Start the API server and try again.'))
  }, [])

  const filteredStudents = student.filter((item) => {
    const searchValue = searchTerm.toLowerCase().trim()

    if (!searchValue) return true

    return (
      String(item.id).toLowerCase().includes(searchValue) ||
      item.date.toLowerCase().includes(searchValue) ||
      item.name.toLowerCase().includes(searchValue) ||
      item.phone.toLowerCase().includes(searchValue) ||
      item.courses.some((course) => course.toLowerCase().includes(searchValue)) ||
      item.qualification.toLowerCase().includes(searchValue)
    )
  })

  const totalPages = Math.ceil(filteredStudents.length / rowsPerPage)
  const safePage = Math.min(currentPage, totalPages || 1)
  const startIndex = (safePage - 1) * rowsPerPage
  const currentRows = filteredStudents.slice(startIndex, startIndex + rowsPerPage)

  React.useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  const handlePageChange = (page) => {
    if (page >= 1 && page <= (totalPages || 1)) {
      setCurrentPage(page)
    }
  }

  const handleDelete = async (studentId) => {
    if (!window.confirm('Delete this student record?')) return

    setDeletingStudentId(studentId)
    setLoadError('')

    try {
      const response = await fetch(`http://localhost:3001/api/students/${studentId}`, {
        method: 'DELETE',
      })
      const result = await response.json()

      if (!response.ok) {
        setLoadError(result.message || 'Unable to delete student details.')
        return
      }

      setStudent((previous) => previous.filter((item) => item.id !== studentId))
    } catch {
      setLoadError('Unable to connect to the student details service.')
    } finally {
      setDeletingStudentId(null)
    }
  }

  return (
    <div style={styles.page}>
      <div className="student-page-topbar">
        <div style={styles.userInfo}>
          <span style={styles.userBadge}>{user.username.charAt(0).toUpperCase()}</span>
          <div style={styles.userText}>
            <span style={styles.userLabel}>Logged in</span>
            <span style={styles.userName}>{user.username}</span>
          </div>
        </div>
        <button type="button" style={styles.logoutButton} onClick={onLogout}>
          Logout
        </button>
      </div>
      <div style={styles.wrapper}>
        <div style={styles.header}>
          <div style={styles.headerRow}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
              <h1 style={styles.title}>Equiry Details</h1>
              <button type="button" style={styles.addButton} onClick={() => {
                setEditingStudent(null)
                setShowForm(true)
              }}>
                Add new enquiry
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button type="button" style={styles.analyseButton} onClick={() => setShowDashboard(true)}>
                Admissions & payments dashboard
              </button>
              <button type="button" style={{ ...styles.analyseButton, background: '#53637b' }} onClick={() => setShowEnrollmentDashboard(true)}>
                Enrollment analysis
              </button>
              <button type="button" style={styles.analyseButton} onClick={() => {
                setShowPaymentForm((visible) => !visible)
                setShowAdmissions(false)
              }}>
              Make Payment
              </button>
              <button type="button" style={{ ...styles.analyseButton, background: '#b56736' }} onClick={() => {
                setShowAdmissions((visible) => !visible)
                setShowPaymentForm(false)
              }}>
                Admission details
              </button>
              {isAdmin && (
                <button type="button" style={{ ...styles.analyseButton, background: '#1e8d61' }} onClick={() => setShowPayments(true)}>
                  Payment details
                </button>
              )}
              <button type="button" style={{ ...styles.analyseButton, background: '#7b61c9' }} onClick={() => setShowBatches(true)}>
                Batch details
              </button>
            </div>
          </div>

          <div style={{ marginTop: '18px', display: 'flex', justifyContent: 'flex-end' }}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, date, or phone"
              style={styles.searchBox}
            />
          </div>
        </div>

        {loadError && (
          <p role="alert" style={{ margin: '16px 22px 0', color: '#b42318', fontWeight: 600 }}>
            {loadError}
          </p>
        )}

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>ID</th>
                <th style={styles.th}>Date</th>
                <th style={styles.th}>Name</th>
                <th style={styles.th}>Courses</th>
                <th style={styles.th}>Qualification</th>
                <th style={styles.th}>Phone</th>
                <th style={styles.th}>Remarks</th>
                <th style={styles.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentRows.length > 0 ? (
                currentRows.map((s) => (
                  <tr key={s.id} style={styles.row}>
                    <td style={styles.td}>{s.id}</td>
                    <td style={styles.td}>{s.date}</td>
                    <td style={styles.td}>{s.name}</td>
                    <td style={styles.td}>{s.courses.join(', ')}</td>
                    <td style={styles.td}>{s.qualification}</td>
                    <td style={styles.td}>{s.phone}</td>
                    <td style={styles.td}>
                      <span style={styles.badge}>{s.remarks}</span>
                    </td>
                    <td style={styles.td}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' }}>
                        <button
                          type="button"
                          style={styles.logoutButton}
                          onClick={() => {
                            setEditingStudent(s)
                            setShowForm(true)
                          }}
                        >
                          Update
                        </button>
                        <button
                          type="button"
                          style={{ ...styles.logoutButton, color: '#b42318' }}
                          onClick={() => handleDelete(s.id)}
                          disabled={deletingStudentId === s.id}
                        >
                          {deletingStudentId === s.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ ...styles.td, textAlign: 'center', color: '#5d6470' }}>
                    No student records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ padding: '0 22px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <span style={{ color: '#5d6470', fontSize: '14px', fontWeight: 600 }}>
            Showing {currentRows.length ? (safePage - 1) * rowsPerPage + 1 : 0}-{Math.min(safePage * rowsPerPage, filteredStudents.length)} of {filteredStudents.length}
          </span>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => handlePageChange(safePage - 1)}
              disabled={safePage === 1}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(17, 24, 39, 0.1)',
                borderRadius: '10px',
                background: safePage === 1 ? '#efefef' : '#fff',
                color: '#23303b',
                cursor: safePage === 1 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              Prev
            </button>

            <span style={{ fontSize: '14px', color: '#23303b', fontWeight: 700 }}>
              Page {safePage} of {totalPages || 1}
            </span>

            <button
              type="button"
              onClick={() => handlePageChange(safePage + 1)}
              disabled={safePage === totalPages || totalPages === 0}
              style={{
                padding: '8px 12px',
                border: '1px solid rgba(17, 24, 39, 0.1)',
                borderRadius: '10px',
                background: safePage === totalPages || totalPages === 0 ? '#efefef' : '#fff',
                color: '#23303b',
                cursor: safePage === totalPages || totalPages === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
              }}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {showForm && (
        <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="student-form-modal-title">
          <div className="dashboard-modal-panel compact-modal-panel enquiry-form-modal-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="student-form-modal-title">{editingStudent ? 'Update student enquiry' : 'New student enquiry'}</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => {
                setEditingStudent(null)
                setShowForm(false)
              }}>
                Close
              </button>
            </div>
            <StudentDetailsForm
              editingStudent={editingStudent}
              onCancel={() => {
                setEditingStudent(null)
                setShowForm(false)
              }}
              onStudentAdded={(newStudent) => {
                setStudent((previous) => [...previous, newStudent])
                setLoadError('')
                setShowForm(false)
              }}
              onStudentUpdated={(updatedStudent) => {
                setStudent((previous) => previous.map((item) => item.id === updatedStudent.id ? updatedStudent : item))
                setLoadError('')
                setEditingStudent(null)
                setShowForm(false)
              }}
            />
          </div>
        </div>
      )}

      {showPaymentForm && (
        <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="record-payment-title">
          <div className="dashboard-modal-panel compact-modal-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="record-payment-title">Record student payment</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowPaymentForm(false)}>
                Close
              </button>
            </div>
            <FeesDetails
              username={user.username}
              students={student}
              onCancel={() => setShowPaymentForm(false)}
            />
          </div>
        </div>
      )}

      {showAdmissions && (
        <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="admission-details-popup-title">
          <div className="dashboard-modal-panel admission-modal-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="admission-details-popup-title">Admission details</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowAdmissions(false)}>
                Close
              </button>
            </div>
            <AdmissionDetails />
          </div>
        </div>
      )}

      {showDashboard && (
        <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="dashboard-modal-title">
          <div className="dashboard-modal-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="dashboard-modal-title">Admissions and payments dashboard</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowDashboard(false)}>
                Close
              </button>
            </div>
            <Dashboard user={user.username} role={user.role} onLogout={onLogout} />
          </div>
        </div>
      )}

      {showEnrollmentDashboard && (
        <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="enrollment-dashboard-modal-title">
          <div className="dashboard-modal-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="enrollment-dashboard-modal-title">Enrollment analysis</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowEnrollmentDashboard(false)}>Close</button>
            </div>
            <EnrollmentDashboard user={user.username} onLogout={onLogout} />
          </div>
        </div>
      )}

      {showPayments && isAdmin && (
        <FeesDetails
          adminView
          username={user.username}
          students={student}
          onClose={() => setShowPayments(false)}
        />
      )}

      {showBatches && (
        <div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="batch-details-title">
          <div className="dashboard-modal-panel batch-modal-panel">
            <div className="dashboard-modal-toolbar">
              <h2 id="batch-details-title">Batch management</h2>
              <button type="button" className="dashboard-modal-close" onClick={() => setShowBatches(false)}>Close</button>
            </div>
            <RunningUpcomingDemoBatches />
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDetails
