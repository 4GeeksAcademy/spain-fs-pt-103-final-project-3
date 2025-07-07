import React from 'react'

const getStrength = (password) => {
  if (!password) return { label: '', score: 0 }

  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[a-z]/.test(password)) score++
  if (/\d/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++

  if (score <= 2) return { label: 'Débil', score }
  if (score <= 4) return { label: 'Media', score }
  return { label: 'Fuerte', score }
}

const getColor = (score) => {
  if (score <= 2) return 'red'
  if (score <= 4) return 'orange'
  return 'green'
}

export default function PasswordStrengthMeter({ password }) {
  const { label, score } = getStrength(password)
  const color = getColor(score)

  return (
    <div style={{ marginTop: '6px' }}>
      <div style={{
        height: '8px',
        width: `${(score / 5) * 100}%`,
        backgroundColor: color,
        transition: 'width 0.3s',
        borderRadius: '4px'
      }}></div>
      {label && <small style={{ color }}>{label}</small>}
    </div>
  )
}
