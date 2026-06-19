import axios from 'axios'

const client = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
})

let _token = null
export const setAuthToken = (token) => { _token = token }

client.interceptors.request.use((config) => {
  if (_token) {
    config.headers.Authorization = `Bearer ${_token}`
  }
  return config
})

const isAuthEndpoint = (url = '') => /\/auth\/(login|register)$/.test(url)

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isAuthEndpoint(error.config?.url)) {
      _token = null
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default client
