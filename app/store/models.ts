export interface User {
  id: string;
  name: string;
}

export interface Post {
  id: string;
  content: string;
  likedBy?: User[];
  authorId: string;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
}

export interface Directory {
  id: string;
  name: string;
  authorId: string;
  createdAt: string;
  parentId?: string;
}

export interface File {
  id: string;
  name: string;
  authorId: string;
  createdAt: string;
  directoryId?: string;
}