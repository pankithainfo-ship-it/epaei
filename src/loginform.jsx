import { useState } from 'react'
import logo from './assets/jith-logo.svg'
import googleLogo from './assets/devicon_google.svg'

const API_URL = 'http://localhost:3001/api/users'

const LoginForm = ({ onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerForm, setRegisterForm] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'student',
  })

  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      const response = await fetch(API_URL)
      const users = await response.json()
      const user = users.find(
        (record) =>
          record.username.toLowerCase() === username.trim().toLowerCase() &&
          record.password === password
      )

      if (user) {
        setMessage('Login successful. Redirecting...')
        onLoginSuccess?.(user.username)
        return
      }

      setMessage('Invalid username or password. Please try again.')
    } catch (error) {
      setMessage('Unable to connect to the authentication service.')
    }
  }

  const handleRegisterSubmit = async (event) => {
    event.preventDefault()

    const trimmedUsername = registerForm.username.trim()
    const trimmedFullName = registerForm.fullName.trim()
    const trimmedEmail = registerForm.email.trim()

    if (!trimmedFullName || !trimmedUsername || !trimmedEmail) {
      setMessage('Please complete all required fields.')
      return
    }

    if (registerForm.password.length < 6) {
      setMessage('Password must be at least 6 characters long.')
      return
    }

    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage('Passwords do not match. Please try again.')
      return
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: trimmedUsername,
          password: registerForm.password,
          role: registerForm.role,
          email: trimmedEmail,
          fullName: trimmedFullName,
        }),
      })

      const result = await response.json()

      if (!response.ok) {
        setMessage(result.message || 'Unable to create account.')
        return
      }

      setMessage('Account created successfully. You can now sign in.')
      setRegisterForm({
        fullName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student',
      })
      setIsRegistering(false)
      setUsername(trimmedUsername)
      setPassword(registerForm.password)
    } catch (error) {
      setMessage('Unable to connect to the authentication service.')
    }
  }

  const handleCreateAccount = () => {
    setIsRegistering(true)
    setMessage('')
  }

  const handleBackToLogin = () => {
    setIsRegistering(false)
    setMessage('')
  }

  return (
    <main className="portal-shell">
      <section className="portal-intro" aria-labelledby="portal-title">
        <div className="brand-row">
          <img src={logo} alt="Epaeins logo" className="logo" />
        </div>

        <div className="intro-content">
          <p className="eyebrow">Welcome back</p>
          <h1 id="portal-title">Manage your enquiry access with confidence.</h1>
          <p className="intro-copy">
            Your academic journey, all in one place. Sign in to manage your enquiries
            and stay connected with your institution.
          </p>
        </div>

        <div className="intro-note">
          <span className="status-dot" aria-hidden="true" />
          Secure Employee Access
        </div>
      </section>

      <section className="login-panel" aria-labelledby="login-title">
        <div className="login-card">
          <div className="panel-heading">
            <p className="eyebrow eyebrow-solid">Employee access portal</p>
            <h2 id="login-title">
              {isRegistering ? 'Create your account' : 'Sign in to your account'}
            </h2>
            <p>
              {isRegistering
                ? 'Create a new account to access the enquiry details.'
                : 'Enter your employee credentials to access the enquiry details.'}
            </p>
          </div>

          {isRegistering ? (
            <form onSubmit={handleRegisterSubmit} className="login-form">
              <div className="field-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  value={registerForm.fullName}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, fullName: e.target.value }))
                  }
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="registerUsername">Username</label>
                <input
                  type="text"
                  id="registerUsername"
                  value={registerForm.username}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, username: e.target.value }))
                  }
                  placeholder="Choose a username"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>

              <div className="field-group">
                <label htmlFor="registerRole">User Role</label>
                <select
                  id="registerRole"
                  value={registerForm.role}
                  onChange={(e) =>
                    setRegisterForm((prev) => ({ ...prev, role: e.target.value }))
                  }
                  className="role-select"
                >
                  <option value="student">Student</option>
                  <option value="employee">Employee</option>

                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="field-group">
                <label htmlFor="registerPassword">Password</label>
                <div className="password-wrap">
                  <input
                    type={showRegisterPassword ? 'text' : 'password'}
                    id="registerPassword"
                    value={registerForm.password}
                    onChange={(e) =>
                      setRegisterForm((prev) => ({ ...prev, password: e.target.value }))
                    }
                    placeholder="Create a password"
                    required
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowRegisterPassword((visible) => !visible)}
                    aria-label={showRegisterPassword ? 'Hide password' : 'Show password'}
                  >
                    {showRegisterPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <div className="field-group">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <div className="password-wrap">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={registerForm.confirmPassword}
                    onChange={(e) =>
                      setRegisterForm((prev) => ({
                        ...prev,
                        confirmPassword: e.target.value,
                      }))
                    }
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowConfirmPassword((visible) => !visible)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button className="submit-button" type="submit">
                Create Account
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleBackToLogin}
              >
                Back to sign in
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="login-form">
              <div className="field-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  autoComplete="username"
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className="field-group">
                <div className="label-row">
                  <label htmlFor="password">Password</label>
                  <a href="#help">Need help?</a>
                </div>

                <div className="password-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    className="password-toggle"
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button className="submit-button" type="submit">
                Sign in
              </button>
            </form>
          )}

          {message && (
            <p className="form-message" role="status">
              {message}
            </p>
          )}

          {!isRegistering && (
            <>
              <div className="divider">
                <span>or continue with</span>
              </div>

              <button className="google-button" type="button">
                <img src={googleLogo} alt="" aria-hidden="true" />
                Sign in with Google
              </button>

              <p className="create-account">
                <button
                  className="create-account-button"
                  type="button"
                  onClick={handleCreateAccount}
                >
                  Create an account
                </button>
              </p>
            </>
          )}
        </div>
      </section>
    </main>
  )
}

export default LoginForm
