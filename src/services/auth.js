import axios from 'axios'

const API = axios.create({
  // apuntamos al namespace “auth”
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/auth',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

// Ahora la ruta real será POST `${baseURL}/login`
export const loginUser = async ({ email, password }) => {
  const { data } = await API.post('/login', { email, password })
  return data
}

export const registerUser = async ({ username, email, password, avatar_url }) => {
  const { data } = await API.post('/register', { username, email, password, avatar_url })
  return data
}

export const getMe = async () => {
  const { data } = await API.get('/me')
  return data
}
