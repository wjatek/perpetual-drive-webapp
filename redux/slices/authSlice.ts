import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { ErrorResponse } from '@/types/errors'
import { User } from '@/types/models'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { addUser } from './usersSlice'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: ErrorResponse | null
  isAuthenticated: boolean
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  isAuthenticated: false,
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (
    credentials: { name: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const response = await api.post('/login', credentials)
      const { user } = response.data
      dispatch(addUser(user))

      return response.data
    } catch (error: any) {
      const errorResponse: ErrorResponse = error.response?.data || {
        message: 'Login failed',
      }
      return rejectWithValue(errorResponse)
    }
  }
)

export const refreshAccessToken = createAsyncThunk(
  'auth/refresh',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post('/refresh-token')

      return response.data
    } catch (error: any) {
      const errorResponse: ErrorResponse = {
        message: 'Failed to refresh token',
      }
      return rejectWithValue(errorResponse)
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await api.post('/logout')
    } catch (error: any) {
      const errorResponse: ErrorResponse = { message: 'Failed to logout' }
      return rejectWithValue(errorResponse)
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as ErrorResponse
        state.isAuthenticated = false
      })

      .addCase(refreshAccessToken.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(refreshAccessToken.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.accessToken
        state.isAuthenticated = true
      })
      .addCase(refreshAccessToken.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })

      .addCase(logoutUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false
        state.user = null
        state.token = null
        state.isAuthenticated = false
      })
  },
})

export default authSlice.reducer
