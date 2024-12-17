import { createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { createSlice } from './createAppSlice'
import { Post } from './models'

export const fetchPosts = createAsyncThunk<Post[]>(
  'posts/fetchPosts',
  async () => {
    const response = await api.get<Post[]>('/posts')
    return response.data
  }
)

export const createPost = createAsyncThunk<
  Post,
  Omit<Post, 'id' | 'createdAt'>
>('posts/createPost', async (post) => {
  const response = await api.post<Post>('/posts', post)
  return response.data
})

export const likePost = createAsyncThunk<Post, { postId: string }>(
  'posts/likePost',
  async ({ postId }) => {
    const response = await api.post<Post>(`/posts/${postId}/like`)
    return response.data
  }
)

const postSlice = createSlice({
  name: 'posts',
  initialState: {
    list: [] as Post[],
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.list = action.payload
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message || 'Failed to fetch posts'
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const post = state.list.find((p) => p.id === action.payload.id)
        if (post) post.likedBy = action.payload.likedBy
      })
  },
})

export default postSlice.reducer
