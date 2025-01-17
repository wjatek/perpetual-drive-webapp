import api from '@/lib/api'
import { createSlice } from '@/redux/createAppSlice'
import { ErrorResponse } from '@/types/errors'
import { User } from '@/types/models'
import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'

interface UsersState {
  usersById: { [key: string]: User }
  loading: { [key: string]: boolean }
  error: ErrorResponse | null
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

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action: PayloadAction<User>) => {
      state.usersById[action.payload.id] = action.payload
    },
  },
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
        const errorResponse = action.error as ErrorResponse
        state.error = errorResponse
      })
  },
})

export const { addUser } = usersSlice.actions
export default usersSlice.reducer
