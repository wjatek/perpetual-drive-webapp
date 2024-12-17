import { createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { User } from './models'
import { createSlice } from './createAppSlice'

export const fetchUsers = createAsyncThunk<User[]>(
  'users/fetchUsers',
  async () => {
    const response = await api.get<User[]>('/users')
    return response.data
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState: {
    list: [] as User[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch users'
      })
  },
})

export default userSlice.reducer
