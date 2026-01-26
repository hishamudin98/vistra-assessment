import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '@libs/shared/src/prisma/prisma.service';
import { CreateFileSystemItemDto } from '../dto/createFileSystemItem.dto';
import { CreateFileSystemItemResponseDto } from '../dto/createFileSystemItemResponse.dto';
import { DeleteFileSystemItemDto } from '../dto/deleteFileSystemItem.dto';
import { DeleteFileSystemItemResponseDto } from '../dto/deleteFileSystemItemResponse.dto';
import { UploadFileDto } from '../dto/uploadFile.dto';

@Injectable()
export class CoreService {
  constructor(private readonly prisma: PrismaService) {}

  async getHealth(): Promise<string> {
    return 'Ok';
  }

  async getDocuments(): Promise<any> {
    try {
      const documents = await this.prisma.fileSystemItem.findMany({
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          parent: true,
        },
      });

      return documents.map((doc) => ({
        ...doc,
        size: doc.size ? doc.size.toString() : null,
      }));
    } catch (error) {
      throw error;
    }
  }

  async getDocumentDetails(id: string): Promise<any> {
    try {
      const document = await this.prisma.fileSystemItem.findUnique({
        where: {
          id: Number(id),
        },
        include: {
          user: true,
          parent: true,
          children: true,
        },
      });

      if (!document) {
        return null;
      }

      return {
        ...document,
        size: document.size ? document.size.toString() : null,
        children: document.children?.map((child) => ({
          ...child,
          size: child.size ? child.size.toString() : null,
        })),
      };
    } catch (error) {
      throw error;
    }
  }

  async createFolder(
    data: CreateFileSystemItemDto,
  ): Promise<CreateFileSystemItemResponseDto> {
    try {
      // check name folder must unique
      data.name = data.name.trim();
      const folderName = await this.prisma.fileSystemItem.findUnique({
        where: {
          name: data.name,
        },
      });

      if (folderName) {
        throw new BadRequestException('Folder name already exists');
      }

      const folder = await this.prisma.fileSystemItem.create({
        data: {
          name: data.name,
          type: 'folder',
          path: data.path || `/${data.name}`,
          userId: data.userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          parent: true,
        },
      });

      return {
        ...folder,
        size: folder.size ? folder.size.toString() : null,
        parent: folder.parent
          ? {
              ...folder.parent,
              size: folder.parent.size ? folder.parent.size.toString() : null,
            }
          : null,
      };
    } catch (error) {
      throw error;
    }
  }

  async uploadFile(
    data: UploadFileDto,
    file?: Express.Multer.File,
  ): Promise<CreateFileSystemItemResponseDto> {
    try {
      // TODO: Store file to disk or cloud storage using file.buffer or file.path

      if (!file) {
        throw new BadRequestException('File is required');
      }
      
      // Check if file name already exists
      data.name = data.name.trim();
      const existingFile = await this.prisma.fileSystemItem.findUnique({
        where: {
          name: data.name,
        },
      });

      if (existingFile) {
        throw new BadRequestException('File name already exists');
      }

      const fileNew = await this.prisma.fileSystemItem.create({
        data: {
          name: data.name,
          type: 'file',
          path: data.path,
          size: BigInt(data.size),
          mimeType: data.mimeType,
          parentId: data.parentId || null,
          userId: data.userId,
        },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          parent: true,
        },
      });

      return {
        ...fileNew,
        size: fileNew.size ? fileNew.size.toString() : null,
        parent: fileNew.parent
          ? {
              ...fileNew.parent,
              size: fileNew.parent.size ? fileNew.parent.size.toString() : null,
            }
          : null,
      };
    } catch (error) {
      throw error;
    }
  }

  async deleteFileSystemItems(
    data: DeleteFileSystemItemDto,
  ): Promise<DeleteFileSystemItemResponseDto> {
    try {
      await this.prisma.fileSystemItem.delete({
        where: {
          id: data.id,
        },
      });

      return {
        message: 'File system item deleted successfully',
        id: data.id,
      };
    } catch (error) {
      throw error;
    }
  }
}
