export interface User {
  id: number;
  fullName: string;
}

export interface FileSystemItem {
  id: number;
  name: string;
  type: 'file' | 'folder';
  path: string | null;
  size: string | null;
  mimeType: string | null;
  parentId: number | null;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  parent: FileSystemItem | null;
}

export interface PaginationResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export interface CreateFolderRequest {
  name: string;
  type: 'folder';
  userId: number;
  parentId?: number;
}
