// services/auth.js
const API = import.meta.env.VITE_BACKEND_URL;

export async function loginUser({ email, password }) {
  const res = await fetch(`${API}/api/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}

export async function registerUser({ email, password }) {
  const res = await fetch(`${API}/api/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) throw await res.json();
  return res.json();
}
