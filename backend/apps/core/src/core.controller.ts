import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CoreService } from './core.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateFileSystemItemDto } from '../dto/createFileSystemItem.dto';
import { CreateFileSystemItemResponseDto } from '../dto/createFileSystemItemResponse.dto';
import { DeleteFileSystemItemDto } from '../dto/deleteFileSystemItem.dto';
import { DeleteFileSystemItemResponseDto } from '../dto/deleteFileSystemItemResponse.dto';
import { UploadFileDto } from '../dto/uploadFile.dto';
import { UploadFileBodyDto } from '../dto/uploadFileBody.dto';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';
import { PaginationResponseDto } from '../dto/paginationResponse.dto';

@ApiTags('Core')
@Controller()
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get('health')
  async getHealth(): Promise<string> {
    return this.coreService.getHealth();
  }

  @Get('documents')
  async getDocuments(
    @Query() query: PaginationQueryDto,
  ): Promise<PaginationResponseDto<any>> {
    return this.coreService.getDocuments(query);
  }

  @Get('documents/:id')
  async documentDetails(@Param('id') id: string): Promise<any> {
    return this.coreService.getDocumentDetails(id);
  }

  @Post('create-folder')
  async createFolder(
    @Body() data: CreateFileSystemItemDto,
  ): Promise<CreateFileSystemItemResponseDto> {
    return this.coreService.createFolder(data);
  }

  @Post('upload-file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './public/upload',
        filename: (req, file, callback) => {
          const now = new Date();
          const day = String(now.getDate()).padStart(2, '0');
          const month = String(now.getMonth() + 1).padStart(2, '0');
          const year = now.getFullYear();
          const hours = String(now.getHours()).padStart(2, '0');
          const minutes = String(now.getMinutes()).padStart(2, '0');
          const seconds = String(now.getSeconds()).padStart(2, '0');

          const formattedDate = `${day}${month}${year}${hours}${minutes}${seconds}`;
          const ext = extname(file.originalname);
          const filename = `${formattedDate}${ext}`;
          callback(null, filename);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: UploadFileBodyDto,
  ): Promise<CreateFileSystemItemResponseDto> {
    const uploadData: UploadFileDto = {
      name: body.name || file.originalname,
      mimeType: body.type || file.mimetype,
      size: parseInt(body.size) || file.size,
      path: `/upload/${file.filename}`,
      parentId: body.parentId ? parseInt(body.parentId) : undefined,
      userId: parseInt(body.userId) || 1,
    };
    return this.coreService.uploadFile(uploadData, file);
  }

  @Delete('documents/:id')
  async deleteDocument(
    @Param('id') id: string,
  ): Promise<DeleteFileSystemItemResponseDto> {
    return this.coreService.deleteFileSystemItems({ id: parseInt(id) });
  }
}
