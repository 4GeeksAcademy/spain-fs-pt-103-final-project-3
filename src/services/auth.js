// src/services/auth.js
import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL + '/api/auth',
  headers: { 'Content-Type': 'application/json' },
  withCredentials: true
})

export const registerUser = async ({ username, email, password, avatar_url = '/assets/avatar-default.png' }) => {
  const { data } = await API.post('/register', {
    username,
    email,
    password,
    avatar_url
  })
  return data
}

export const loginUser = async ({ email, password }) => {
  const { data } = await API.post('/login', { email, password })
  return data
}

export const getMe = async () => {
  const { data } = await API.get('/me')
  return data
}
