import React, { useState } from 'react'
import LoginForm from './loginform.jsx'
import StudentDetails from './studentdetails.jsx'
import './App.css'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState('')

  return (
    <div>
      {isAuthenticated ? (
        <StudentDetails
          user={loggedInUser}
          onLogout={() => {
            setIsAuthenticated(false)
            setLoggedInUser('')
          }}
        />
      ) : (
        <LoginForm
          onLoginSuccess={(username) => {
            setLoggedInUser(username)
            setIsAuthenticated(true)
          }}
        />
      )}
    </div>
  )
}

export default App


