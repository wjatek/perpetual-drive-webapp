export interface User {
  id: string;
  name: string;
  password?: string;
  posts?: Post[];
  comments?: Comment[];
  likedPosts?: Post[];
  directories?: Directory[];
  files?: File[];
}

export interface Post {
  id: string;
  content: string;
  comments?: Comment[];
  likedBy?: User[];
  authorId: string;
  author?: User;
  createdAt: string;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  author?: User;
  postId: string;
  post?: Post;
  createdAt: string;
}

export interface Directory {
  id: string;
  name: string;
  authorId: string;
  author?: User;
  createdAt: string;
  parentId?: string;
  parent?: Directory;
  subdirectories?: Directory[];
  files?: File[];
}

export interface File {
  id: string;
  name: string;
  authorId: string;
  author?: User;
  createdAt: string;
  directoryId?: string;
  directory?: Directory;
}