import axios from 'axios';

export const makeRequest = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  withCredentials: true
})

makeRequest.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem("financa:accessToken")
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

makeRequest.interceptors.response.use((response) => {
  return response
}, async (error) => {
  const originalRequest = error.config
  if (error.response.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true
    const refreshToken = localStorage.getItem("financa:refreshToken")
    if (!refreshToken) {
      return Promise.reject(error)
    }
    try {
      const res = await makeRequest.post("/auth/refresh", {refreshToken})
      const {accessToken} = res.data
      localStorage.setItem("financa:accessToken", accessToken)
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return makeRequest(originalRequest)
    } catch (refreshError) {
      return Promise.reject(refreshError)
    }
  }
})