import React from 'react'
import AdmissionForm from './admissionform.jsx'

const AdmissionDetails = () => {
	const [admissions, setAdmissions] = React.useState([])
	const [searchTerm, setSearchTerm] = React.useState('')
	const [showForm, setShowForm] = React.useState(false)
	const [loadError, setLoadError] = React.useState('')

	const loadAdmissions = React.useCallback(async () => {
		try {
			const response = await fetch('http://localhost:3001/api/admissions')
			if (!response.ok) throw new Error('Unable to load admission details')
			setAdmissions(await response.json())
			setLoadError('')
		} catch {
			setLoadError('Unable to load admissions. Start the API server and try again.')
		}
	}, [])

	React.useEffect(() => {
		loadAdmissions()
	}, [loadAdmissions])

	const filteredAdmissions = admissions.filter((admission) => {
		const searchValue = searchTerm.trim().toLowerCase()
		if (!searchValue) return true
		return [admission.admissionNumber, admission.name, admission.course]
			.some((value) => String(value).toLowerCase().includes(searchValue))
	})

	return (
		<section className="admission-details-panel" aria-labelledby="admission-details-title">
			<div className="admission-list-header">
				<div>
					<p className="admission-kicker">Enrollment records</p>
					<h2 id="admission-details-title">Admission details</h2>
					<p className="admission-summary">{filteredAdmissions.length} of {admissions.length} records shown</p>
				</div>
				<div className="admission-list-actions">
					<input
						type="search"
						value={searchTerm}
						onChange={(event) => setSearchTerm(event.target.value)}
						placeholder="Search admission no., name, or course"
						aria-label="Search by admission number, student name, or course"
					/>
					<button type="button" className="admission-primary-button" onClick={() => setShowForm((visible) => !visible)}>
						{showForm ? 'Close form' : 'New admission'}
					</button>
				</div>
			</div>

			{showForm && (
				<AdmissionForm
					onSubmitted={(admission) => {
						setAdmissions((previous) => [...previous, admission])
						setShowForm(false)
						setLoadError('')
					}}
					onCancel={() => setShowForm(false)}
				/>
			)}

			{loadError && <p className="admission-error" role="alert">{loadError}</p>}

			<div className="admission-table-wrap">
				<table className="admission-table">
					<thead>
						<tr><th>Admission no.</th><th>Joining date</th><th>Student</th><th>Father name</th><th>Course</th><th>Phone</th><th>Qualification</th><th>Address</th></tr>
					</thead>
					<tbody>
						{filteredAdmissions.length > 0 ? filteredAdmissions.map((admission) => (
							<tr key={admission.id}>
								<td><strong>{admission.admissionNumber}</strong></td>
								<td>{admission.joiningDate}</td>
								<td>{admission.name}</td>
								<td>{admission.fatherName}</td>
								<td>{admission.course}</td>
								<td>{admission.phone}</td>
								<td>{admission.qualification}</td>
								<td>{admission.address}</td>
							</tr>
						)) : (
							<tr><td className="admission-empty" colSpan="8">No admission records match your search.</td></tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	)
}

export default AdmissionDetails
