import React from 'react'

const initialForm = {
  admissionNumber: '', joiningDate: '', name: '', fatherName: '', course: '', phone: '', address: '', qualification: '',
  email: '', gender: '', dateOfBirth: '', emergencyContact: '', previousInstitution: '', remarks: '',
}

const AdmissionForm = ({ onSubmitted, onCancel }) => {
  const [form, setForm] = React.useState(initialForm)
  const [message, setMessage] = React.useState('')
  const [isSaving, setIsSaving] = React.useState(false)

  const updateField = (event) => {
    const { name, value } = event.target
    setForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setMessage('')
    setIsSaving(true)

    try {
      const response = await fetch('http://localhost:3001/api/admissions', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
      })
      const result = await response.json()
      if (!response.ok) {
        setMessage(result.message || 'Unable to save admission details.')
        return
      }
      setForm(initialForm)
      setMessage('Admission saved successfully.')
      onSubmitted?.(result.admission)
    } catch {
      setMessage('Unable to connect to the admission service.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <section className="admission-form-panel" aria-labelledby="admission-form-title">
      <div className="admission-section-heading"><div><p className="admission-kicker">New enrollment</p><h2 id="admission-form-title">Admission form</h2></div><p>Record the student and contact information needed for enrollment.</p></div>
      <form onSubmit={handleSubmit}>
        <div className="admission-form-grid">
          <label>Admission number<input name="admissionNumber" value={form.admissionNumber} onChange={updateField} placeholder="ADM-2026-001" required /></label>
          <label>Date of joining<input name="joiningDate" type="date" value={form.joiningDate} onChange={updateField} required /></label>
          <label>Student name<input name="name" value={form.name} onChange={updateField} placeholder="Full name" required /></label>
          <label>Father name<input name="fatherName" value={form.fatherName} onChange={updateField} placeholder="Father or guardian name" required /></label>
          <label>Course<input name="course" value={form.course} onChange={updateField} placeholder="B.Tech Computer Science" required /></label>
          <label>Phone number<input name="phone" type="tel" value={form.phone} onChange={updateField} placeholder="+91 98765 43210" required /></label>
          <label>Qualification<input name="qualification" value={form.qualification} onChange={updateField} placeholder="12th / B.Tech / Diploma" required /></label>
          <label>Email address<input name="email" type="email" value={form.email} onChange={updateField} placeholder="student@example.com" /></label>
          <label>Gender<select name="gender" value={form.gender} onChange={updateField}><option value="">Select gender</option><option>Female</option><option>Male</option><option>Other</option></select></label>
          <label>Date of birth<input name="dateOfBirth" type="date" value={form.dateOfBirth} onChange={updateField} /></label>
          <label>Emergency contact<input name="emergencyContact" type="tel" value={form.emergencyContact} onChange={updateField} placeholder="Parent or guardian phone" /></label>
          <label>Previous institution<input name="previousInstitution" value={form.previousInstitution} onChange={updateField} placeholder="School or college" /></label>
          <label className="admission-wide-field">Address<textarea name="address" value={form.address} onChange={updateField} rows="3" placeholder="Complete residential address" required /></label>
          <label className="admission-wide-field">Remarks<textarea name="remarks" value={form.remarks} onChange={updateField} rows="2" placeholder="Optional notes" /></label>
        </div>
        <div className="admission-form-actions"><button className="admission-primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save admission'}</button><button className="admission-secondary-button" type="button" onClick={onCancel} disabled={isSaving}>Cancel</button>{message && <span role="status" className="admission-form-message">{message}</span>}</div>
      </form>
    </section>
  )
}

export default AdmissionForm
