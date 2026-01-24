import { Injectable } from '@nestjs/common';

@Injectable()
export class CoreService {
  async getHello(): Promise<string> {
    return 'Hello World!';
  }
}
