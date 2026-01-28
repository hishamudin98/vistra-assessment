import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CoreService } from './core.service';
import { PrismaService } from '@libs/shared/src/prisma/prisma.service';
import { CreateFileSystemItemDto } from '../dto/createFileSystemItem.dto';
import { DeleteFileSystemItemDto } from '../dto/deleteFileSystemItem.dto';
import { UploadFileDto } from '../dto/uploadFile.dto';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';

describe('CoreService', () => {
  let service: CoreService;
  let prisma: PrismaService;

  const mockPrismaService = {
    fileSystemItem: {
      findMany: jest.fn(),
      count: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoreService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<CoreService>(CoreService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHealth', () => {
    it('should return "Ok"', async () => {
      const result = await service.getHealth();
      expect(result).toBe('Ok');
    });
  });

  describe('getDocuments', () => {
    it('should return paginated documents with default values', async () => {
      const query: PaginationQueryDto = {};
      const mockDocuments = [
        {
          id: 1,
          name: 'Test File',
          type: 'file',
          mimeType: 'application/pdf',
          size: BigInt(1024),
          path: '/upload/test.pdf',
          userId: 1,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 1, fullName: 'Test User' },
          parent: null,
        },
      ];

      mockPrismaService.fileSystemItem.findMany.mockResolvedValue(mockDocuments);
      mockPrismaService.fileSystemItem.count.mockResolvedValue(1);

      const result = await service.getDocuments(query);

      expect(result.data).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.totalPages).toBe(1);
      expect(prisma.fileSystemItem.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          parent: true,
        },
        orderBy: [
          { type: 'desc' },
          { name: 'asc' },
        ],
      });
    });

    it('should handle pagination parameters', async () => {
      const query: PaginationQueryDto = {
        page: 2,
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };

      mockPrismaService.fileSystemItem.findMany.mockResolvedValue([]);
      mockPrismaService.fileSystemItem.count.mockResolvedValue(0);

      await service.getDocuments(query);

      expect(prisma.fileSystemItem.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
            },
          },
          parent: true,
        },
        orderBy: [
          { type: 'desc' },
          { createdAt: 'desc' },
        ],
      });
    });

    it('should handle search query', async () => {
      const query: PaginationQueryDto = {
        search: 'test',
      };

      mockPrismaService.fileSystemItem.findMany.mockResolvedValue([]);
      mockPrismaService.fileSystemItem.count.mockResolvedValue(0);

      await service.getDocuments(query);

      expect(prisma.fileSystemItem.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            OR: [
              { name: { contains: 'test' } },
              { name: { contains: 'TEST' } },
              { name: { contains: 'Test' } },
            ],
          },
        }),
      );
    });

    it('should map document size from BigInt to string', async () => {
      const query: PaginationQueryDto = {};
      const mockDocuments = [
        {
          id: 1,
          name: 'Test File',
          type: 'file',
          mimeType: 'application/pdf',
          size: BigInt(2048),
          path: '/upload/test.pdf',
          userId: 1,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 1, fullName: 'Test User' },
          parent: null,
        },
      ];

      mockPrismaService.fileSystemItem.findMany.mockResolvedValue(mockDocuments);
      mockPrismaService.fileSystemItem.count.mockResolvedValue(1);

      const result = await service.getDocuments(query);

      expect(result.data[0].size).toBe('2048');
    });
  });

  describe('getDocumentDetails', () => {
    it('should return document details by id', async () => {
      const id = '1';
      const mockDocument = {
        id: 1,
        name: 'Test File',
        type: 'file',
        mimeType: 'application/pdf',
        size: '1024',
        path: '/upload/test.pdf',
        userId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        children: undefined,
      };

      mockPrismaService.fileSystemItem.findUnique.mockResolvedValue(mockDocument);

      const result = await service.getDocumentDetails(id);

      expect(result).toEqual(mockDocument);
      expect(prisma.fileSystemItem.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: {
          user: true,
          parent: true,
          children: true,
        },
      });
    });
  });

  describe('createFolder', () => {
    it('should create a folder without parent', async () => {
      const createFolderDto: CreateFileSystemItemDto = {
        name: 'New Folder',
        type: 'folder',
        userId: 1,
      };

      const mockCreatedFolder = {
        id: 1,
        name: 'New Folder',
        type: 'folder',
        mimeType: null,
        size: null,
        path: null,
        userId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, fullName: 'Test User' },
        parent: null,
      };

      mockPrismaService.fileSystemItem.findUnique.mockResolvedValue(null);
      mockPrismaService.fileSystemItem.create.mockResolvedValue(mockCreatedFolder);

      const result = await service.createFolder(createFolderDto);

      expect(result).toEqual(mockCreatedFolder);
      expect(prisma.fileSystemItem.create).toHaveBeenCalledWith({
        data: {
          name: 'New Folder',
          type: 'folder',
          path: '/New Folder',
          userId: 1,
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
    });

    it('should create a folder with parent', async () => {
      const createFolderDto: CreateFileSystemItemDto = {
        name: 'Subfolder',
        type: 'folder',
        userId: 1,
        parentId: 1,
      };

      const mockCreatedFolder = {
        id: 2,
        name: 'Subfolder',
        type: 'folder',
        mimeType: null,
        size: null,
        path: null,
        userId: 1,
        parentId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, fullName: 'Test User' },
        parent: {
          id: 1,
          name: 'Parent Folder',
          type: 'folder',
          mimeType: null,
          size: null,
          path: null,
          userId: 1,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };

      mockPrismaService.fileSystemItem.findUnique.mockResolvedValue(null);
      mockPrismaService.fileSystemItem.create.mockResolvedValue(mockCreatedFolder);

      const result = await service.createFolder(createFolderDto);

      expect(result.parent).toBeDefined();
      expect(prisma.fileSystemItem.create).toHaveBeenCalledWith({
        data: {
          name: 'Subfolder',
          type: 'folder',
          path: '/Subfolder',
          userId: 1,
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
    });
  });

  describe('uploadFile', () => {
    it('should upload a file without parent', async () => {
      const uploadFileDto: UploadFileDto = {
        name: 'test.pdf',
        mimeType: 'application/pdf',
        size: 1024,
        path: '/upload/test.pdf',
        userId: 1,
      };

      const mockFile = {
        originalname: 'test.pdf',
        mimetype: 'application/pdf',
        size: 1024,
        filename: 'test.pdf',
      } as Express.Multer.File;

      const mockCreatedFile = {
        id: 1,
        name: 'test.pdf',
        type: 'file',
        mimeType: 'application/pdf',
        size: '1024',
        path: '/upload/test.pdf',
        userId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { id: 1, fullName: 'Test User' },
        parent: null,
      };

      mockPrismaService.fileSystemItem.findUnique.mockResolvedValue(null);
      mockPrismaService.fileSystemItem.create.mockResolvedValue(mockCreatedFile);

      const result = await service.uploadFile(uploadFileDto, mockFile);

      expect(result).toEqual(mockCreatedFile);
      expect(prisma.fileSystemItem.create).toHaveBeenCalledWith({
        data: {
          name: 'test.pdf',
          type: 'file',
          mimeType: 'application/pdf',
          size: BigInt(1024),
          path: '/upload/test.pdf',
          userId: 1,
          parentId: null,
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
    });
  });

  describe('deleteFileSystemItems', () => {
    it('should delete a file system item', async () => {
      const deleteDto: DeleteFileSystemItemDto = { id: 1 };

      mockPrismaService.fileSystemItem.delete.mockResolvedValue({
        id: 1,
        name: 'Deleted Item',
      });

      const result = await service.deleteFileSystemItems(deleteDto);

      expect(result.message).toBe('File system item deleted successfully');
      expect(prisma.fileSystemItem.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw BadRequestException when delete fails', async () => {
      const deleteDto: DeleteFileSystemItemDto = { id: 999 };

      mockPrismaService.fileSystemItem.delete.mockRejectedValue(
        new BadRequestException('Record not found'),
      );

      await expect(service.deleteFileSystemItems(deleteDto)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
