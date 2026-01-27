import type { 
  PaginationResponse, 
  FileSystemItem, 
  CreateFolderRequest 
} from "../types/document.types";
import { apiRequest } from "@/lib/api-client";

// Document API functions
export const getDocuments = (
  page: number = 1, 
  limit: number = 10,
  sortBy?: string,
  sortOrder?: 'asc' | 'desc',
  search?: string
) => apiRequest<PaginationResponse<FileSystemItem>>('GET', '/documents', undefined, {
  params: { page, limit, sortBy, sortOrder, search },
});

export const createFolder = (folder: CreateFolderRequest) => 
  apiRequest<FileSystemItem>('POST', '/create-folder', folder);

export const uploadFile = (file: FormData) => 
  apiRequest<FileSystemItem>('POST', '/upload-file', file);

export const deleteDocument = (id: number) => 
  apiRequest<{ message: string }>('DELETE', `/documents/${id}`);
