import React from 'react'

const initialForm = {
	admissionNumber: '',
	studentId: '',
	course: '',
	amount: '',
	due: '',
	paymentDate: '',
	duePaymentDate: '',
	paymentMethod: 'Cash',
	status: 'Paid',
	remarks: '',
}

const formStyles = {
	section: { margin: '20px 18px 0', padding: '22px', borderRadius: '16px', background: '#fffaf4', border: '1px solid rgba(17, 24, 39, 0.08)' },
	heading: { margin: '0 0 16px', color: '#18232e', fontSize: '1.3rem' },
	grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' },
	field: { display: 'flex', flexDirection: 'column', gap: '6px' },
	label: { color: '#5d6470', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase' },
	input: { width: '100%', padding: '11px 12px', borderRadius: '10px', border: '1px solid rgba(17, 24, 39, 0.14)', background: '#fff', color: '#23303b' },
	actions: { display: 'flex', alignItems: 'center', gap: '12px', marginTop: '18px', flexWrap: 'wrap' },
	button: { padding: '11px 16px', border: 0, borderRadius: '10px', background: '#23303b', color: '#fff', fontWeight: 700, cursor: 'pointer' },
}

const FeesDetails = ({ adminView = false, username, onPaymentAdded, onCancel, onClose }) => {
	const [form, setForm] = React.useState(initialForm)
	const [payments, setPayments] = React.useState([])
	const [admissions, setAdmissions] = React.useState([])
	const [paymentSearch, setPaymentSearch] = React.useState('')
	const [paymentDate, setPaymentDate] = React.useState('')
	const [message, setMessage] = React.useState('')
	const [messageType, setMessageType] = React.useState('success')
	const [isSaving, setIsSaving] = React.useState(false)

	React.useEffect(() => {
		fetch('http://localhost:3001/api/admissions')
			.then((response) => response.ok ? response.json() : Promise.reject(new Error('Unable to load admissions.')))
			.then(setAdmissions)
			.catch((error) => {
				setMessageType('error')
				setMessage(error.message || 'Unable to load admissions.')
			})
	}, [])

	React.useEffect(() => {
		if (!adminView) return

		fetch('http://localhost:3001/api/payments', { headers: { 'x-user-role': 'admin' } })
			.then((response) => response.ok
				? response.json()
				: response.json().then((result) => Promise.reject(new Error(result.message))))
					.then((records) => {
						const admissionNumbers = new Set(admissions.map((admission) => admission.admissionNumber))
						setPayments(records.filter((payment) => admissionNumbers.has(payment.admissionNumber)))
					})
			.catch((error) => {
				setMessageType('error')
				setMessage(error.message || 'Unable to load payment details.')
			})
	}, [adminView, admissions])

	const filteredPayments = payments.filter((payment) => {
		const searchValue = paymentSearch.trim().toLowerCase()
		const matchesSearch = !searchValue || [payment.admissionNumber, payment.studentName, payment.course]
			.some((value) => String(value || '').toLowerCase().includes(searchValue))
		return matchesSearch && (!paymentDate || payment.paymentDate === paymentDate)
	})

	const updateField = (event) => {
		const { name, value } = event.target
		setForm((previous) => ({ ...previous, [name]: value }))
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		setMessage('')
		setMessageType('success')
		setIsSaving(true)

		try {
			const response = await fetch('http://localhost:3001/api/payments', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ...form, submittedBy: username }),
			})
			const result = await response.json()

			if (!response.ok) {
				setMessageType('error')
				setMessage(result.message || 'Unable to save payment details.')
				return
			}

			setForm(initialForm)
			setMessage('Payment details saved successfully.')
			onPaymentAdded?.(result.payment)
		} catch {
			setMessageType('error')
			setMessage('Unable to connect to the payment service.')
		} finally {
			setIsSaving(false)
		}
	}

	if (adminView) {
		return (
			<div className="dashboard-modal" role="dialog" aria-modal="true" aria-labelledby="payment-details-title">
				<div className="dashboard-modal-panel">
					<div className="dashboard-modal-toolbar">
						<h2 id="payment-details-title">Student payment details</h2>
						<button type="button" className="dashboard-modal-close" onClick={onClose}>Close</button>
					</div>
					<div style={{ padding: '24px' }}>
						{message && <p role="alert" style={{ color: '#b42318', fontWeight: 600 }}>{message}</p>}
						<div className="payment-search-toolbar">
							<input type="search" value={paymentSearch} onChange={(event) => setPaymentSearch(event.target.value)} placeholder="Search admission no., name, or course" aria-label="Search payments by admission number, name, or course" />
							<input type="date" value={paymentDate} onChange={(event) => setPaymentDate(event.target.value)} aria-label="Filter payments by date" />
							{(paymentSearch || paymentDate) && <button type="button" onClick={() => { setPaymentSearch(''); setPaymentDate('') }}>Clear filters</button>}
						</div>
						<div style={{ overflowX: 'auto' }}>
						<table style={{ width: '100%', minWidth: '1180px', borderCollapse: 'collapse', background: '#fff' }}>
							<thead>
								<tr>
					{['Admission no.', 'Student', 'Course', 'Amount', 'Due', 'Payment date', 'Due payment date', 'Method', 'Status', 'Submitted by', 'Remarks'].map((heading) => (
										<th key={heading} style={{ padding: '14px', textAlign: 'left', background: '#f5f0e8', color: '#5d6470', fontSize: '12px' }}>{heading}</th>
									))}
								</tr>
							</thead>
							<tbody>
								{filteredPayments.length ? filteredPayments.map((payment) => (
									<tr key={payment.id}>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.admissionNumber || '-'}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.studentName}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.course || '-'}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>₹{Number(payment.amount).toLocaleString('en-IN')}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.due === undefined ? '-' : `₹${Number(payment.due).toLocaleString('en-IN')}`}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.paymentDate}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.duePaymentDate || '-'}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.paymentMethod}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.status}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.submittedBy || '-'}</td>
										<td style={{ padding: '14px', borderBottom: '1px solid #eee' }}>{payment.remarks || '-'}</td>
									</tr>
								)) : (
									<tr><td colSpan="11" style={{ padding: '24px', textAlign: 'center' }}>No payment details found.</td></tr>
								)}
							</tbody>
						</table>
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<section style={formStyles.section} aria-labelledby="payment-form-title">
			<h2 id="payment-form-title" style={formStyles.heading}>Record student payment</h2>
			<form onSubmit={handleSubmit}>
				<div style={formStyles.grid}>
					<div style={formStyles.field}>
						<label htmlFor="payment-admission" style={formStyles.label}>Admission number</label>
						<select id="payment-admission" name="admissionNumber" value={form.admissionNumber} onChange={(event) => setForm((previous) => ({ ...previous, admissionNumber: event.target.value, studentId: '', course: admissions.find((item) => item.admissionNumber === event.target.value)?.course || '' }))} style={formStyles.input} required={!form.studentId}>
							<option value="">Select an admission</option>
							{admissions.map((admission) => <option key={admission.id} value={admission.admissionNumber}>{admission.admissionNumber} - {admission.name}</option>)}
						</select>
					</div>
					<div style={formStyles.field}><label htmlFor="payment-course" style={formStyles.label}>Course</label><input id="payment-course" name="course" value={form.course} onChange={updateField} style={formStyles.input} placeholder="Course" readOnly={Boolean(form.admissionNumber || form.studentId)} /></div>
					<div style={formStyles.field}><label htmlFor="payment-amount" style={formStyles.label}>Amount</label><input id="payment-amount" name="amount" type="number" min="1" step="0.01" value={form.amount} onChange={updateField} style={formStyles.input} placeholder="25000" required /></div>
					<div style={formStyles.field}><label htmlFor="payment-due" style={formStyles.label}>Due amount</label><input id="payment-due" name="due" type="number" min="0" step="0.01" value={form.due} onChange={updateField} style={formStyles.input} placeholder="5000" required /></div>
					<div style={formStyles.field}><label htmlFor="payment-date" style={formStyles.label}>Payment date</label><input id="payment-date" name="paymentDate" type="date" value={form.paymentDate} onChange={updateField} style={formStyles.input} required /></div>
					<div style={formStyles.field}><label htmlFor="due-payment-date" style={formStyles.label}>Due date</label><input id="due-payment-date" name="duePaymentDate" type="date" value={form.duePaymentDate} onChange={updateField} style={formStyles.input} required /></div>
					<div style={formStyles.field}><label htmlFor="payment-method" style={formStyles.label}>Payment method</label><select id="payment-method" name="paymentMethod" value={form.paymentMethod} onChange={updateField} style={formStyles.input}><option>Cash</option><option>UPI</option><option>Card</option><option>Bank transfer</option></select></div>
					<div style={formStyles.field}><label htmlFor="payment-status" style={formStyles.label}>Status</label><select id="payment-status" name="status" value={form.status} onChange={updateField} style={formStyles.input}><option>Paid</option><option>Pending</option><option>Partially paid</option><option>Refunded</option></select></div>
					<div style={{ ...formStyles.field, gridColumn: '1 / -1' }}><label htmlFor="payment-remarks" style={formStyles.label}>Remarks</label><input id="payment-remarks" name="remarks" value={form.remarks} onChange={updateField} style={formStyles.input} placeholder="Optional note" /></div>
				</div>
				<div style={formStyles.actions}>
					<button type="submit" style={formStyles.button} disabled={isSaving}>{isSaving ? 'Saving...' : 'Save payment details'}</button>
					<button type="button" style={{ ...formStyles.button, background: '#fff', color: '#23303b', border: '1px solid rgba(17, 24, 39, 0.14)' }} onClick={onCancel} disabled={isSaving}>Cancel</button>
					{message && <span role={messageType === 'error' ? 'alert' : 'status'} style={{ color: messageType === 'error' ? '#b42318' : '#1e8d61', fontWeight: 600 }}>{message}</span>}
				</div>
			</form>
		</section>
	)
}

export default FeesDetails
