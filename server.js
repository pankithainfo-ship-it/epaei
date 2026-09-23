import http from 'http'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const authFilePath = path.join(__dirname, 'src', 'data', 'authUsers.json')
const studentFilePath = path.join(__dirname, 'src', 'data', 'studentDetails.json')
const paymentFilePath = path.join(__dirname, 'src', 'data', 'studentPayments.json')
const admissionFilePath = path.join(__dirname, 'src', 'data', 'admissions.json')

const sendJson = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, x-user-role',
  })
  res.end(JSON.stringify(payload))
}

const readUsers = () => {
  const raw = fs.readFileSync(authFilePath, 'utf-8')
  return JSON.parse(raw)
}

const writeUsers = (users) => {
  fs.writeFileSync(authFilePath, `${JSON.stringify(users, null, 2)}\n`)
}

const readStudents = () => {
  const raw = fs.readFileSync(studentFilePath, 'utf-8')
  return JSON.parse(raw)
}

const writeStudents = (students) => {
  fs.writeFileSync(studentFilePath, `${JSON.stringify(students, null, 2)}\n`)
}

const readPayments = () => {
  const raw = fs.readFileSync(paymentFilePath, 'utf-8')
  return JSON.parse(raw)
}

const writePayments = (payments) => {
  fs.writeFileSync(paymentFilePath, `${JSON.stringify(payments, null, 2)}\n`)
}

const readAdmissions = () => {
  const raw = fs.readFileSync(admissionFilePath, 'utf-8')
  return JSON.parse(raw)
}

const writeAdmissions = (admissions) => {
  fs.writeFileSync(admissionFilePath, `${JSON.stringify(admissions, null, 2)}\n`)
}

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-user-role')

  if (req.method === 'OPTIONS') {
    res.writeHead(204)
    res.end()
    return
  }

  if (req.url === '/api/users' && req.method === 'GET') {
    try {
      const users = readUsers()
      sendJson(res, 200, users)
    } catch (error) {
      sendJson(res, 500, { message: 'Unable to load users', error: error.message })
    }
    return
  }

  if (req.url === '/api/students' && req.method === 'GET') {
    try {
      sendJson(res, 200, readStudents())
    } catch (error) {
      sendJson(res, 500, { message: 'Unable to load student details', error: error.message })
    }
    return
  }

  if (req.url === '/api/students' && req.method === 'POST') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const incomingStudent = JSON.parse(body || '{}')
        const requiredFields = ['date', 'name', 'qualification', 'phone', 'remarks']

        if (
          requiredFields.some((field) => !String(incomingStudent[field] || '').trim()) ||
          !Array.isArray(incomingStudent.courses) ||
          incomingStudent.courses.length === 0
        ) {
          sendJson(res, 400, { message: 'Please complete all student details.' })
          return
        }

        const students = readStudents()
        const newStudent = {
          id: students.reduce((highestId, student) => Math.max(highestId, student.id), 0) + 1,
          date: incomingStudent.date,
          name: incomingStudent.name.trim(),
          courses: incomingStudent.courses.map((course) => course.trim()).filter(Boolean),
          qualification: incomingStudent.qualification.trim(),
          phone: incomingStudent.phone.trim(),
          remarks: incomingStudent.remarks.trim(),
        }

        if (newStudent.courses.length === 0) {
          sendJson(res, 400, { message: 'Select at least one course.' })
          return
        }

        writeStudents([...students, newStudent])
        sendJson(res, 201, { message: 'Student details saved successfully.', student: newStudent })
      } catch (error) {
        sendJson(res, 500, { message: 'Unable to save student details', error: error.message })
      }
    })
    return
  }

  if (req.url === '/api/admissions' && req.method === 'GET') {
    try {
      sendJson(res, 200, readAdmissions())
    } catch (error) {
      sendJson(res, 500, { message: 'Unable to load admission details', error: error.message })
    }
    return
  }

  if (req.url === '/api/admissions' && req.method === 'POST') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const incomingAdmission = JSON.parse(body || '{}')
        const requiredFields = ['admissionNumber', 'joiningDate', 'name', 'fatherName', 'course', 'phone', 'address', 'qualification']

        if (requiredFields.some((field) => !String(incomingAdmission[field] || '').trim())) {
          sendJson(res, 400, { message: 'Please complete all required admission fields.' })
          return
        }

        const admissions = readAdmissions()
        const admissionNumber = incomingAdmission.admissionNumber.trim()
        const admissionExists = admissions.some(
          (admission) => admission.admissionNumber.toLowerCase() === admissionNumber.toLowerCase()
        )

        if (admissionExists) {
          sendJson(res, 409, { message: 'Admission number already exists.' })
          return
        }

        const newAdmission = {
          id: admissions.reduce((highestId, admission) => Math.max(highestId, admission.id), 0) + 1,
          admissionNumber,
          joiningDate: incomingAdmission.joiningDate,
          name: incomingAdmission.name.trim(),
          fatherName: incomingAdmission.fatherName.trim(),
          course: incomingAdmission.course.trim(),
          phone: incomingAdmission.phone.trim(),
          address: incomingAdmission.address.trim(),
          qualification: incomingAdmission.qualification.trim(),
          email: String(incomingAdmission.email || '').trim(),
          gender: String(incomingAdmission.gender || '').trim(),
          dateOfBirth: String(incomingAdmission.dateOfBirth || '').trim(),
          emergencyContact: String(incomingAdmission.emergencyContact || '').trim(),
          previousInstitution: String(incomingAdmission.previousInstitution || '').trim(),
          remarks: String(incomingAdmission.remarks || '').trim(),
          status: String(incomingAdmission.status || 'Active').trim(),
        }

        writeAdmissions([...admissions, newAdmission])
        sendJson(res, 201, { message: 'Admission saved successfully.', admission: newAdmission })
      } catch (error) {
        sendJson(res, 500, { message: 'Unable to save admission details', error: error.message })
      }
    })
    return
  }

  if (req.url === '/api/payments' && req.method === 'GET') {
    if (req.headers['x-user-role'] !== 'admin') {
      sendJson(res, 403, { message: 'Only admins can view payment details.' })
      return
    }

    try {
      const students = readStudents()
      const admissions = readAdmissions()
      const payments = readPayments().map((payment) => {
        const student = students.find((item) => item.id === payment.studentId)
        const admission = admissions.find((item) => item.admissionNumber === payment.admissionNumber)
        return {
          ...payment,
          admissionNumber: payment.admissionNumber || admission?.admissionNumber || '',
          studentName: payment.studentName || admission?.name || student?.name || '',
          course: payment.course || admission?.course || student?.courses?.join(', ') || '',
        }
      })
      sendJson(res, 200, payments)
    } catch (error) {
      sendJson(res, 500, { message: 'Unable to load payment details', error: error.message })
    }
    return
  }

  if (req.url === '/api/payments' && req.method === 'POST') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const incomingPayment = JSON.parse(body || '{}')
        const requiredFields = ['amount', 'due', 'paymentDate', 'duePaymentDate', 'paymentMethod', 'status']

        if (requiredFields.some((field) => !String(incomingPayment[field] || '').trim()) || (!incomingPayment.studentId && !String(incomingPayment.admissionNumber || '').trim())) {
          sendJson(res, 400, { message: 'Please complete all payment details.' })
          return
        }

        const students = readStudents()
        const admissions = readAdmissions()
        const student = incomingPayment.studentId
          ? students.find((item) => item.id === Number(incomingPayment.studentId))
          : null
        const admission = String(incomingPayment.admissionNumber || '').trim()
          ? admissions.find((item) => item.admissionNumber.toLowerCase() === incomingPayment.admissionNumber.trim().toLowerCase())
          : null
        const amount = Number(incomingPayment.amount)
        const due = Number(incomingPayment.due)

        if (!student && !admission) {
          sendJson(res, 400, { message: 'Select a valid student or admission.' })
          return
        }

        if (!Number.isFinite(amount) || amount <= 0) {
          sendJson(res, 400, { message: 'Enter a valid payment amount.' })
          return
        }

        if (!Number.isFinite(due) || due < 0) {
          sendJson(res, 400, { message: 'Enter a valid due amount.' })
          return
        }

        const payments = readPayments()
        const newPayment = {
          id: payments.reduce((highestId, payment) => Math.max(highestId, payment.id), 0) + 1,
          studentId: student?.id || null,
          admissionNumber: admission?.admissionNumber || String(incomingPayment.admissionNumber || '').trim(),
          studentName: admission?.name || student?.name,
          course: admission?.course || String(incomingPayment.course || '').trim(),
          amount,
          due,
          paymentDate: incomingPayment.paymentDate,
          duePaymentDate: incomingPayment.duePaymentDate,
          paymentMethod: incomingPayment.paymentMethod.trim(),
          status: incomingPayment.status.trim(),
          remarks: String(incomingPayment.remarks || '').trim(),
          submittedBy: String(incomingPayment.submittedBy || '').trim(),
        }

        writePayments([...payments, newPayment])
        sendJson(res, 201, { message: 'Payment details saved successfully.', payment: newPayment })
      } catch (error) {
        sendJson(res, 500, { message: 'Unable to save payment details', error: error.message })
      }
    })
    return
  }

  const studentUpdateMatch = req.url.match(/^\/api\/students\/(\d+)$/)
  if (studentUpdateMatch && req.method === 'PUT') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const incomingStudent = JSON.parse(body || '{}')
        const requiredFields = ['date', 'name', 'qualification', 'phone', 'remarks']
        if (
          requiredFields.some((field) => !String(incomingStudent[field] || '').trim()) ||
          !Array.isArray(incomingStudent.courses) ||
          incomingStudent.courses.length === 0
        ) {
          sendJson(res, 400, { message: 'Please complete all student details.' })
          return
        }

        const students = readStudents()
        const studentId = Number(studentUpdateMatch[1])
        const studentIndex = students.findIndex((student) => student.id === studentId)
        if (studentIndex === -1) {
          sendJson(res, 404, { message: 'Student record not found.' })
          return
        }

        const courses = incomingStudent.courses.map((course) => course.trim()).filter(Boolean)
        if (courses.length === 0) {
          sendJson(res, 400, { message: 'Select at least one course.' })
          return
        }

        const updatedStudent = {
          id: studentId,
          date: incomingStudent.date,
          name: incomingStudent.name.trim(),
          courses,
          qualification: incomingStudent.qualification.trim(),
          phone: incomingStudent.phone.trim(),
          remarks: incomingStudent.remarks.trim(),
        }
        const updatedStudents = students.map((student) => student.id === studentId ? updatedStudent : student)
        writeStudents(updatedStudents)
        sendJson(res, 200, { message: 'Student details updated successfully.', student: updatedStudent })
      } catch (error) {
        sendJson(res, 500, { message: 'Unable to update student details', error: error.message })
      }
    })
    return
  }

  if (studentUpdateMatch && req.method === 'DELETE') {
    try {
      const studentId = Number(studentUpdateMatch[1])
      const students = readStudents()
      const studentToDelete = students.find((student) => student.id === studentId)

      if (!studentToDelete) {
        sendJson(res, 404, { message: 'Student record not found.' })
        return
      }

      writeStudents(students.filter((student) => student.id !== studentId))
      sendJson(res, 200, { message: 'Student details deleted successfully.', student: studentToDelete })
    } catch (error) {
      sendJson(res, 500, { message: 'Unable to delete student details', error: error.message })
    }
    return
  }

  if (req.url === '/api/users' && req.method === 'POST') {
    let body = ''

    req.on('data', (chunk) => {
      body += chunk.toString()
    })

    req.on('end', () => {
      try {
        const incomingUser = JSON.parse(body || '{}')

        if (!incomingUser.username || !incomingUser.password) {
          sendJson(res, 400, { message: 'Username and password are required.' })
          return
        }

        const users = readUsers()
        const userExists = users.some(
          (user) => user.username.toLowerCase() === incomingUser.username.toLowerCase()
        )

        if (userExists) {
          sendJson(res, 409, { message: 'Username already exists.' })
          return
        }

        const newUser = {
          username: incomingUser.username,
          password: incomingUser.password,
          role: incomingUser.role || 'student',
          email: incomingUser.email || '',
          fullName: incomingUser.fullName || incomingUser.username,
        }

        const updatedUsers = [...users, newUser]
        writeUsers(updatedUsers)

        sendJson(res, 201, {
          message: 'User created successfully',
          user: newUser,
          users: updatedUsers,
        })
      } catch (error) {
        sendJson(res, 500, { message: 'Unable to save user', error: error.message })
      }
    })
    return
  }

  sendJson(res, 404, { message: 'Route not found' })
})

const port = 3001
server.listen(port, () => {
  console.log(`Auth server running on http://localhost:${port}`)
})
