import React from 'react'

const enquiry = {
  id: 'ENQ-2048',
  studentName: 'Aarav Sharma',
  studentId: 'STU-2024-0187',
  program: 'B.Tech Computer Science',
  year: '3rd Year',
  phone: '+91 98765 43210',
  email: 'aarav.sharma@jith.edu',
  requestType: 'Admission Support',
  status: 'In Review',
  submittedOn: '12 Aug 2026',
  lastUpdated: '15 Aug 2026',
  message:
    'Requesting updated fee structure details and confirmation for hostel accommodation during the upcoming semester.',
}

const details = [
  ['Enquiry ID', enquiry.id],
  ['Student Name', enquiry.studentName],
  ['Student ID', enquiry.studentId],
  ['Program', enquiry.program],
  ['Academic Year', enquiry.year],
  ['Phone', enquiry.phone],
  ['Email', enquiry.email],
  ['Request Type', enquiry.requestType],
  ['Status', enquiry.status],
  ['Submitted On', enquiry.submittedOn],
  ['Last Updated', enquiry.lastUpdated],
]

const Enquirydetails = () => {
  return (
    <div className="enquiry-page">
      <div className="enquiry-shell">
        <div className="panel-header enquiry-header">
          <div>
            <p className="section-tag">Admission desk</p>
            <h2>Enquiry Details</h2>
          </div>
          <button className="primary-button" type="button">
            Update Status
          </button>
        </div>

        <div className="details-card enquiry-card">
          <table className="details-table enquiry-table">
            <tbody>
              {details.map(([label, value]) => (
                <tr key={label}>
                  <th scope="row">{label}</th>
                  <td>{value}</td>
                </tr>
              ))}
              <tr>
                <th scope="row">Message</th>
                <td>{enquiry.message}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Enquirydetails
