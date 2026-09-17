import React from 'react'

const initialForm = {
  date: '',
  name: '',
  courses: [],
  qualification: '',
  phone: '',
  remarks: '',
}

const availableCourses = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'Computer Science',
  'Electrical Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
]

const formStyles = {
  section: {
    margin: '20px 18px 0',
    padding: '22px',
    borderRadius: '16px',
    background: '#fffaf4',
    border: '1px solid rgba(17, 24, 39, 0.08)',
  },
  heading: { margin: '0 0 16px', color: '#18232e', fontSize: '1.3rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
  },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { color: '#5d6470', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' },
  input: {
    width: '100%',
    padding: '11px 12px',
    borderRadius: '10px',
    border: '1px solid rgba(17, 24, 39, 0.14)',
    background: '#fff',
    color: '#23303b',
  },
  courses: { display: 'flex', flexWrap: 'wrap', gap: '8px' },
  course: {
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 10px',
    borderRadius: '8px',
    background: '#fff',
    border: '1px solid rgba(17, 24, 39, 0.12)',
    color: '#23303b',
    fontSize: '13px',
  },
  actions: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px', flexWrap: 'wrap' },
  button: {
    padding: '11px 16px',
    border: 0,
    borderRadius: '10px',
    background: '#23303b',
    color: '#fff',
    fontWeight: 700,
    cursor: 'pointer',
  },
  message: { color: '#1e8d61', fontSize: '14px', fontWeight: 600 },
}

const Stddetailsform = ({ onStudentAdded, onCancel }) => {
  const [form, setForm] = React.useState(initialForm)
  const [message, setMessage] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const toggleCourse = (course) => {
    setForm((previous) => ({
      ...previous,
      courses: previous.courses.includes(course)
        ? previous.courses.filter((item) => item !== course)
        : [...previous.courses, course],
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsSaving(true)

    try {
      const response = await fetch('http://localhost:3001/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message || 'Unable to save student details.')
        return
      }

      setForm(initialForm)
      setMessage('Student details saved successfully.')
      onStudentAdded?.(result.student)
    } catch {
      setMessage('Unable to connect to the student details service.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section style={formStyles.section} aria-labelledby="student-form-title">
      <h2 id="student-form-title" style={formStyles.heading}>Add student details</h2>
      <form onSubmit={handleSubmit}>
        <div style={formStyles.grid}>
          <div style={formStyles.field}>
            <label htmlFor="student-date" style={formStyles.label}>Date</label>
            <input id="student-date" name="date" type="date" value={form.date} onChange={updateField} style={formStyles.input} required />
          </div>
          <div style={formStyles.field}>
            <label htmlFor="student-name" style={formStyles.label}>Name</label>
            <input id="student-name" name="name" value={form.name} onChange={updateField} placeholder="Aarav Sharma" style={formStyles.input} required />
          </div>
          <div style={formStyles.field}>
            <label htmlFor="student-qualification" style={formStyles.label}>Qualification</label>
            <input id="student-qualification" name="qualification" value={form.qualification} onChange={updateField} placeholder="B.Tech Computer Science" style={formStyles.input} required />
          </div>
          <div style={formStyles.field}>
            <label htmlFor="student-phone" style={formStyles.label}>Phone</label>
            <input id="student-phone" name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" style={formStyles.input} required />
          </div>
          <div style={{ ...formStyles.field, gridColumn: '1 / -1' }}>
            <span style={formStyles.label}>Courses</span>
            <div style={formStyles.courses}>
              {availableCourses.map((course) => (
                <label key={course} style={formStyles.course}>
                  <input type="checkbox" checked={form.courses.includes(course)} onChange={() => toggleCourse(course)} />
                  {course}
                </label>
              ))}
            </div>
          </div>
          <div style={{ ...formStyles.field, gridColumn: '1 / -1' }}>
            <label htmlFor="student-remarks" style={formStyles.label}>Remarks</label>
            <input id="student-remarks" name="remarks" value={form.remarks} onChange={updateField} placeholder="Excellent student" style={formStyles.input} required />
          </div>
        </div>
        <div style={formStyles.actions}>
          <button type="submit" style={formStyles.button} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save student details'}
          </button>
          <button
            type="button"
            style={{ ...formStyles.button, background: '#fff', color: '#23303b', border: '1px solid rgba(17, 24, 39, 0.14)' }}
            onClick={onCancel}
            disabled={isSaving}
          >
            Cancel
          </button>
          {message && <span role="status" style={formStyles.message}>{message}</span>}
        </div>
      </form>
    </section>
  )
}

export default Stddetailsform
