import { Controller, Get, Param } from '@nestjs/common';
import { CoreService } from './core.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Core')
@Controller()
export class CoreController {
  constructor(private readonly coreService: CoreService) {}

  @Get()
  async getHello(): Promise<string> {
    return this.coreService.getHello();
  }

  @Get('documents')
  async documents(): Promise<any> {
    return this.coreService.getDocuments();
  }

  @Get('documents/:id')
  async documentDetails(@Param('id') id: string): Promise<any> {
    return this.coreService.getDocumentDetails(id);
  }
}
