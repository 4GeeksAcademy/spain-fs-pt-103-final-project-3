import React from 'react'

export default function PasswordStrengthMeter({ password }) {
    const getScore = pwd => {
        let score = 0
        if (pwd.length >= 8) score += 1
        if (/[A-Z]/.test(pwd)) score += 1
        if (/[a-z]/.test(pwd)) score += 1
        if (/[0-9]/.test(pwd)) score += 1
        if (/[\W]/.test(pwd)) score += 1
        return score
    }

    const score = getScore(password)
    const width = (score / 5) * 100
    let color = '#ff5f56' // rojo

    if (score >= 4) color = '#27c93f'  // verde
    else if (score >= 2) color = '#ffbd2e' // amarillo

    return (
        <div className="password-strength">
            <div
                className="password-strength-bar"
                style={{ width: `${width}%`, backgroundColor: color }}
            />
            <p className="password-strength-label">
                {password.length === 0 ? '' :
                    score <= 1 ? 'Muy débil' :
                        score <= 3 ? 'Media' : 'Fuerte'
                }
            </p>
        </div>
    )
}
