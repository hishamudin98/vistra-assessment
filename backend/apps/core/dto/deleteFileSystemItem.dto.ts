import { IsNotEmpty, IsNumber } from 'class-validator';

export class DeleteFileSystemItemDto {
  @IsNotEmpty()
  @IsNumber()
  id: number;
}
