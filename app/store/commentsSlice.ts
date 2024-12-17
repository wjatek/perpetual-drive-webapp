import { createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { createSlice } from './createAppSlice'
import { Comment } from './models'

export const fetchComments = createAsyncThunk<Comment[], string>(
  'comments/fetchComments',
  async (postId) => {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`)
    return response.data
  }
)

export const createComment = createAsyncThunk<
  Comment,
  { postId: string; comment: Omit<Comment, 'id' | 'createdAt'> }
>('comments/createComment', async ({ postId, comment }) => {
  const response = await api.post<Comment>(`/posts/${postId}/comments`, comment)
  return response.data
})

const commentSlice = createSlice({
  name: 'comments',
  initialState: {
    list: [] as Comment[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch comments'
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
  },
})

export default commentSlice.reducer
