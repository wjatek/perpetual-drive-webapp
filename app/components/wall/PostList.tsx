'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchPosts } from '../../store/postsSlice'
import { Dispatch, RootState } from '../../store/store'
import { Post } from '@/app/store/models'

export default function PostList() {
  const dispatch = useDispatch<Dispatch>()
  const {
    list: posts,
    status,
    error,
  } = useSelector((state: RootState) => state.posts)

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchPosts())
    }
  }, [dispatch, status])

  if (status === 'loading') {
    return <p>Loading posts...</p>
  }

  if (status === 'failed') {
    return <p>Error: {error}</p>
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {posts.map((post: Post) => (
          <li key={post.id}>
            <strong>{post.content}</strong>
            <br />
            Author: {post.author?.name}
            <br />
            Likes: {post.likedBy?.length}
            <br />
            Comments: {post.comments?.length}
          </li>
        ))}
      </ul>
    </div>
  )
}
