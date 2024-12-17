'use client'

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchComments } from '../../store/commentsSlice'
import { Comment } from '../../store/models'
import { Dispatch, RootState } from '../../store/store'

interface CommentsProps {
  postId: string
}

export default function Comments({ postId }: CommentsProps) {
  const dispatch = useDispatch<Dispatch>()
  const { commentsByPostId, loading, error } = useSelector(
    (state: RootState) => state.comments
  )

  useEffect(() => {
    if (!commentsByPostId[postId] && !loading[postId]) {
      dispatch(fetchComments(postId))
    }
  }, [dispatch])

  if (loading[postId]) {
    return <p>Loading comments...</p>
  }

  if (error) {
    return <p>Error: {error}</p>
  }

  const comments = commentsByPostId[postId] || []

  return (
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment: Comment) => (
          <li key={comment.id}>
            <strong>{comment.author?.name}</strong>: {comment.content}
          </li>
        ))}
      </ul>
    </div>
  )
}
