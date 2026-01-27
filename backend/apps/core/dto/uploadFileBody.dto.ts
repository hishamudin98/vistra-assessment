import { IsString, IsOptional, IsNumberString } from 'class-validator';

export class UploadFileBodyDto {
  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsNumberString()
  size: string;

  @IsNumberString()
  userId: string;

  @IsOptional()
  @IsNumberString()
  parentId?: string;
}
