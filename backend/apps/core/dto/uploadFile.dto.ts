import { IsNotEmpty, IsOptional, IsNumber, IsString } from 'class-validator';

export class UploadFileDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  mimeType: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;

  @IsOptional()
  @IsString()
  path?: string;

  @IsOptional()
  @IsNumber()
  parentId?: number;

  @IsNotEmpty()
  @IsNumber()
  userId: number;
}
