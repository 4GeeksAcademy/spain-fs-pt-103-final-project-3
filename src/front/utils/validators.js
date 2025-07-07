export function isValidEmail(email) {
  const regex = /^[\w.-]+@[\w.-]+\.\w+$/;
  return regex.test(email);
}

export function isStrongPassword(password) {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
}
