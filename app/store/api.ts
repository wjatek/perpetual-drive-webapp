import { unwrapResult } from '@reduxjs/toolkit'
import axios from 'axios'
import { refreshAccessToken } from './authSlice'
import apiConfig from '../config'

const API_BASE_URL = apiConfig.apiBaseUrl

let store: any

export const setStore = (reduxStore: any) => {
  store = reduxStore
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

api.interceptors.request.use(
  (config) => {
    if (!store) return config

    const state = store.getState()
    const token = state.auth.token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      originalRequest.url !== '/refresh-token' &&
      !originalRequest._retry &&
      store
    ) {
      originalRequest._retry = true
      debugger
      try {
        const resultAction = await store.dispatch(refreshAccessToken())
        const token = unwrapResult(resultAction)

        originalRequest.headers.Authorization = `Bearer ${token}`
        return api(originalRequest)
      } catch (refreshError) {
        store.dispatch({ type: 'auth/logout' })
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api
