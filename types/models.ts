export type User = {
  id: string
  name: string
}

export type Post = {
  id: string
  content: string
  likedBy?: User[]
  authorId: string
  createdAt: string
}

export type Comment = {
  id: string
  content: string
  authorId: string
  postId: string
  createdAt: string
}

export type Directory = {
  id: string
  name: string
  authorId: string
  createdAt: string
  parentId?: string
}

export type File = {
  id: string
  name: string
  authorId: string
  createdAt: string
  directoryId?: string
}
