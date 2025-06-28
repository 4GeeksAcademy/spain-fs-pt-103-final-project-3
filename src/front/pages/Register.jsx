// src/front/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { registerUser }     from '../../services/auth'              // sube dos niveles a src/services/auth.js
import { isValidEmail,
         isStrongPassword } from '../utils/validators'              // utils en src/front/utils/validators.js
import PasswordStrengthMeter from '../components/PasswordStrengthMeter'

// SVG Ojo abierto
const EyeOpen = (
  <svg width="20" height="20" viewBox="0 0 64 64">
    <path fill="currentColor"
      d="M32 16C19.1 16 8 24.6 4 36c4 11.4 15.1 20 28 20s24-8.6 28-20
         c-4-11.4-15.1-20-28-20zm0 32a12 12 0 1 1 0-24 12 12 0 0 1 0 24z"/>
    <circle fill="currentColor" cx="32" cy="32" r="6"/>
  </svg>
)

// SVG Ojo cerrado
const EyeClosed = (
  <svg width="20" height="20" viewBox="0 0 64 64">
    <path fill="currentColor"
      d="M32 16C19.1 16 8 24.6 4 36c1.7 4.8 5 9 9 12.2l-5 5 4 4 48-48-4-4
         -7.7 7.7C43.2 18.6 37.8 16 32 16zM32 24a8 8 0 0 1 8 8c0 1.4-
         .4 2.7-1 3.8L28.2 25c1.2-.6 2.5-1 3.8-1zm-16 8c0-1.4.4-2.7
         1-3.8l10.8 10.8c-1.2.6-2.5 1-3.8 1a8 8 0 0 1-8-8z"/>
  </svg>
)

export function Register() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [show, setShow]         = useState(false)
  const navigate                = useNavigate()

  const togglePassword = () => setShow(v => !v)

  const handleSubmit = async e => {
    e.preventDefault()

    if (!isValidEmail(email)) {
      alert('Por favor, introduce un email válido')
      return
    }
    if (!isStrongPassword(password)) {
      alert('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.')
      return
    }

    try {
      await registerUser({ email, password })
      navigate('/login')
    } catch (err) {
      alert(err.response?.data?.msg || err.message)
    }
  }

  return (
    <div className="page-content">
      <div className="login-wrapper">
        <div className="auth-card">
          <h2 className="auth-title">Registro</h2>
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <span className="input-icon">@</span>
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type={show ? 'text' : 'password'}
                placeholder="Contraseña"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <span className="toggle-icon" onClick={togglePassword}>
                {show ? EyeClosed : EyeOpen}
              </span>
            </div>

            {/* Tu medidor de fuerza de contraseña */}
            <PasswordStrengthMeter password={password} />

            <button type="submit" className="btn-gradient">Registrar</button>
          </form>
          <p className="auth-footer">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
