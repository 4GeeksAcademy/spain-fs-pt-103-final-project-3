import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { loginUser } from '../services/auth'
import { isValidEmail } from '../utils/validators'
import '../styles/Auth.css'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow] = useState(false)
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const togglePassword = () => setShow(v => !v)

  const handleSubmit = async e => {
    e.preventDefault()
    const errs = {}
    if (!isValidEmail(email)) errs.email = 'Email inválido'
    if (password.length < 3) errs.password = 'Contraseña demasiado corta'

    if (Object.keys(errs).length) {
      setErrors(errs)
      return
    }

    try {
      const response = await loginUser({ email, password });
      localStorage.setItem("access_token",response.access_token)
      navigate('/user')
      setTimeout(() => {
        window.location.reload();
      },1);
    } catch (err) {
      setErrors({ form: err.response?.data?.msg || err.message })
    }
  }

  return (
    <div className="page-content">
      <div className="auth-card">
        <h2 className="auth-title">Iniciar sesión</h2>

        <form onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <span className="input-icon">@</span>
            <input
              className={errors.email ? 'error' : ''}
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={e => {
                setEmail(e.target.value)
                setErrors(prev => ({ ...prev, email: null }))
              }}
              required
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="input-group">
            <span className="input-icon">🔒</span>
            <input
              className={errors.password ? 'error' : ''}
              type={show ? 'text' : 'password'}
              placeholder="Contraseña"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setErrors(prev => ({ ...prev, password: null }))
              }}
              required
            />
            <span className="toggle-icon" onClick={togglePassword}>
              {show ? (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M2 12s4-8 10-8 10 8 10 8-4 8-10 8S2 12 2 12zm10 2a2 2 0 100-4 2 2 0 000 4z"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12 7a5 5 0 015 5 5 5 0 01-5 5 5 5 0 010-10zm0-5C5 2 2 12 2 12s3 10 10 10 10-10 10-10S19 2 12 2z"
                  />
                </svg>
              )}
            </span>
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          {errors.form && (
            <div className="error-message">{errors.form}</div>
          )}

          <button type="submit" className="btn-gradient">
            Entrar
          </button>
        </form>

        <p className="auth-footer">
          ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
        </p>
      </div>
    </div>
  )
}
