export class CreateFileSystemItemResponseDto {
  id: number;
  name: string;
  type: string;
  path: string | null;
  size: string | null;
  mimeType: string | null;
  parentId: number | null;
  userId: number;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: number;
    fullName: string;
  };
  parent: any | null;
}
