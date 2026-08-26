import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

export function apiMessage(error) {
  return error.response?.data?.message || 'Unable to complete the request. Please try again.'
}

export default api
