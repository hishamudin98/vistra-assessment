import { Injectable } from '@nestjs/common';
import { PrismaService } from '@libs/shared/src/prisma/prisma.service';

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
              firstName: true,
              lastName: true,
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


}
