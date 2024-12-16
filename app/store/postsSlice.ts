import { PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import api from './api'
import { createSlice } from './createAppSlice'

interface Comment {
  id: string
  postId: string
  content: string
}

interface Post {
  id: string
  title: string
  content: string
  comments: Comment[]
}

interface PostsState {
  posts: Post[]
  loading: boolean
  error: string | null
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
  const response = await api.get<Post[]>('/posts')
  return response.data
})

export const fetchComments = createAsyncThunk(
  'posts/fetchComments',
  async (postId: string) => {
    const response = await api.get<Comment[]>(`/posts/${postId}/comments`)
    return { postId, comments: response.data }
  }
)

export const createPost = createAsyncThunk(
  'posts/createPost',
  async (newPost: { title: string; content: string }) => {
    const response = await api.post<Post>('/posts', newPost)
    return response.data
  }
)

export const addComment = createAsyncThunk(
  'posts/addComment',
  async (newComment: { postId: string; content: string }) => {
    const response = await api.post<Comment>(
      `/posts/${newComment.postId}/comments`,
      newComment
    )
    return response.data
  }
)

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.loading = false
        state.posts = action.payload.map((post) => ({ ...post, comments: [] }))
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch posts'
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const { postId, comments } = action.payload
        const post = state.posts.find((p) => p.id === postId)
        if (post) {
          post.comments = comments
        }
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.posts.push({ ...action.payload, comments: [] })
      })
      .addCase(
        addComment.fulfilled,
        (state, action: PayloadAction<Comment>) => {
          const comment = action.payload
          const post = state.posts.find((p) => p.id === comment.postId)
          if (post) {
            post.comments.push(comment)
          }
        }
      )
  },
})

export default postsSlice.reducer
