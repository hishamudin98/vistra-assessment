import { Module } from '@nestjs/common';
import { CoreController } from './core.controller';
import { CoreService } from './core.service';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@libs/shared/src/prisma/prisma.module';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [CoreController],
  providers: [CoreService],
})
export class CoreModule {}
