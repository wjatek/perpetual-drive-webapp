import { createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { createSlice } from './createAppSlice'
import { Comment } from './models'

interface CommentsState {
  commentsByPostId: { [key: string]: Comment[] }
  loading: { [key: string]: boolean }
  error: string | null
}

const initialState: CommentsState = {
  commentsByPostId: {},
  loading: {},
  error: null,
}

export const fetchComments = createAsyncThunk<Comment[], string>(
  'comments/fetchComments',
  async (postId) => {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`)
    return response.data
  }
)

export const createComment = createAsyncThunk<
  Comment,
  { postId: string; comment: Pick<Comment, 'content'> }
>('comments/createComment', async ({ postId, comment }) => {
  const response = await api.post<Comment>(`/posts/${postId}/comments`, comment)
  return response.data
})

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchComments.pending, (state, action) => {
        const postId = action.meta.arg
        state.loading[postId] = true
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const postId = action.meta.arg
        const comments = action.payload
        state.commentsByPostId[postId] = comments
        state.loading[postId] = false
      })
      .addCase(fetchComments.rejected, (state, action) => {
        const postId = action.meta.arg
        state.loading[postId] = false
        state.error = action.error.message || 'Failed to fetch comments'
      })
    // .addCase(createComment.fulfilled, (state, action) => {
    //   state.list.push(action.payload)
    // })
  },
})

export default commentSlice.reducer
