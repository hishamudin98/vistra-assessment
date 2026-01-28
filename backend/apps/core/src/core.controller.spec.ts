import { Test, TestingModule } from '@nestjs/testing';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { CreateFileSystemItemDto } from '../dto/createFileSystemItem.dto';
import { DeleteFileSystemItemDto } from '../dto/deleteFileSystemItem.dto';
import { PaginationQueryDto } from '../dto/paginationQuery.dto';

describe('CoreController', () => {
  let controller: CoreController;
  let service: CoreService;

  const mockCoreService = {
    getHealth: jest.fn(),
    getDocuments: jest.fn(),
    getDocumentDetails: jest.fn(),
    createFolder: jest.fn(),
    uploadFile: jest.fn(),
    deleteFileSystemItems: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoreController],
      providers: [
        {
          provide: CoreService,
          useValue: mockCoreService,
        },
      ],
    }).compile();

    controller = module.get<CoreController>(CoreController);
    service = module.get<CoreService>(CoreService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getHealth', () => {
    it('should return health status', async () => {
      const result = 'Ok';
      mockCoreService.getHealth.mockResolvedValue(result);

      expect(await controller.getHealth()).toBe(result);
      expect(service.getHealth).toHaveBeenCalled();
    });
  });

  describe('getDocuments', () => {
    it('should return paginated documents', async () => {
      const query: PaginationQueryDto = {
        page: 1,
        limit: 10,
        sortBy: 'name',
        sortOrder: 'asc',
      };

      const result = {
        data: [
          {
            id: 1,
            name: 'Test Document',
            type: 'file' as const,
            mimeType: 'application/pdf',
            size: '1024',
            path: '/upload/test.pdf',
            userId: 1,
            parentId: null,
            createdAt: new Date(),
            updatedAt: new Date(),
            user: { id: 1, fullName: 'Test User' },
            parent: null,
          },
        ],
        total: 1,
        page: 1,
        limit: 10,
        totalPages: 1,
      };

      mockCoreService.getDocuments.mockResolvedValue(result);

      expect(await controller.getDocuments(query)).toEqual(result);
      expect(service.getDocuments).toHaveBeenCalledWith(query);
    });

    it('should handle search query', async () => {
      const query: PaginationQueryDto = {
        page: 1,
        limit: 10,
        search: 'test',
      };

      const result = {
        data: [],
        total: 0,
        page: 1,
        limit: 10,
        totalPages: 0,
      };

      mockCoreService.getDocuments.mockResolvedValue(result);

      expect(await controller.getDocuments(query)).toEqual(result);
      expect(service.getDocuments).toHaveBeenCalledWith(query);
    });
  });

  describe('documentDetails', () => {
    it('should return document details by id', async () => {
      const id = '1';
      const result = {
        id: 1,
        name: 'Test Document',
        type: 'file',
        mimeType: 'application/pdf',
        size: '1024',
        path: '/upload/test.pdf',
        userId: 1,
        parentId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      mockCoreService.getDocumentDetails.mockResolvedValue(result);

      expect(await controller.documentDetails(id)).toEqual(result);
      expect(service.getDocumentDetails).toHaveBeenCalledWith(id);
    });
  });

  describe('createFolder', () => {
    it('should create a new folder', async () => {
      const createFolderDto: CreateFileSystemItemDto = {
        name: 'New Folder',
        type: 'folder',
        userId: 1,
      };

      const result = {
        id: 1,
        name: 'New Folder',
        type: 'folder' as const,
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

      mockCoreService.createFolder.mockResolvedValue(result);

      expect(await controller.createFolder(createFolderDto)).toEqual(result);
      expect(service.createFolder).toHaveBeenCalledWith(createFolderDto);
    });

    it('should create a folder with parent', async () => {
      const createFolderDto: CreateFileSystemItemDto = {
        name: 'Subfolder',
        type: 'folder',
        userId: 1,
        parentId: 1,
      };

      const result = {
        id: 2,
        name: 'Subfolder',
        type: 'folder' as const,
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
          type: 'folder' as const,
          mimeType: null,
          size: null,
          path: null,
          userId: 1,
          parentId: null,
          createdAt: new Date(),
          updatedAt: new Date(),
          user: { id: 0, fullName: '' },
          parent: null,
        },
      };

      mockCoreService.createFolder.mockResolvedValue(result);

      expect(await controller.createFolder(createFolderDto)).toEqual(result);
      expect(service.createFolder).toHaveBeenCalledWith(createFolderDto);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document by id', async () => {
      const id = '1';
      const result = {
        message: 'File system item deleted successfully',
      };

      mockCoreService.deleteFileSystemItems.mockResolvedValue(result);

      expect(await controller.deleteDocument(id)).toEqual(result);
      expect(service.deleteFileSystemItems).toHaveBeenCalledWith({ id: 1 });
    });
  });
});
