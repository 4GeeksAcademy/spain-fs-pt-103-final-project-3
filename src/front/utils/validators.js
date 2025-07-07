// src/front/utils/validators.js

/**
 * Valida formato de email.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Valida que la contraseña tenga al menos 8 caracteres,
 * contenga mayúscula, minúscula y número.
 */
export function isStrongPassword(pwd) {
  return (
    pwd.length >= 8 && /[A-Z]/.test(pwd) && /[a-z]/.test(pwd) && /\d/.test(pwd)
  );
}
