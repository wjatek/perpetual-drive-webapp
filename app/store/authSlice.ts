import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import api from './api'
import { User } from './models'
import { addUser } from './usersSlice'

interface AuthState {
  user: User | null
  token: string | null
  loading: boolean
  error: string | null
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
      console.dir(error)
      return rejectWithValue(error.response?.data?.error || 'Login failed')
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null
      state.token = null
      state.isAuthenticated = false
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload as string
        state.isAuthenticated = false
      })
  },
})

export const { logout } = authSlice.actions
export default authSlice.reducer
