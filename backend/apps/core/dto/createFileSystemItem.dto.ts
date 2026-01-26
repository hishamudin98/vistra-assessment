import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFileSystemItemDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  type: string;

  @IsOptional()
  path?: string;

  @IsOptional()
  size?: number;

  @IsOptional()
  mimeType?: string;

  @IsOptional()
  parentId?: number;

  @IsNotEmpty()
  userId: number;
}
