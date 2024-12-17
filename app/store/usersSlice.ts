import { createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { User } from './models'
import { createSlice } from './createAppSlice'

interface UsersState {
  usersById: { [key: string]: User }
  loading: { [key: string]: boolean }
  error: string | null
}

const initialState: UsersState = {
  usersById: {},
  loading: {},
  error: null,
}

export const fetchUser = createAsyncThunk<User, string>(
  'users/fetchUser',
  async (id) => {
    const response = await api.get<User>(`/users/${id}`)
    return response.data
  }
)

const userSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state, action) => {
        const id = action.meta.arg
        state.loading[id] = true
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        const id = action.meta.arg
        const user = action.payload
        state.usersById[id] = user
        state.loading[id] = false
      })
      .addCase(fetchUser.rejected, (state, action) => {
        const id = action.meta.arg
        state.loading[id] = false
        state.error = action.error.message || 'Failed to fetch comments'
      })
  },
})

export default userSlice.reducer
