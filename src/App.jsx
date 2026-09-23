import React, { useState } from 'react'
import LoginForm from './loginform.jsx'
import StudentDetails from './studentdetails.jsx'
import './App.css'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loggedInUser, setLoggedInUser] = useState(null)

  return (
    <div>
      {isAuthenticated ? (
        <StudentDetails
          user={loggedInUser}
          onLogout={() => {
            setIsAuthenticated(false)
            setLoggedInUser(null)
          }}
        />
      ) : (
        <LoginForm
          onLoginSuccess={(user) => {
            setLoggedInUser(user)
            setIsAuthenticated(true)
          }}
        />
      )}
    </div>
  )
}

export default App


