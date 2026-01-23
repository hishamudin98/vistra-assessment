import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import * as packageJson from '@package-json';
import { NestExpressApplication } from '@nestjs/platform-express';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AuthModule, {
    logger: ['log', 'error', 'warn', 'debug', 'fatal']
  });

  const configService = app.get<ConfigService>(ConfigService);
  const globalPrefix = configService.get<string>('GLOBAL_PREFIX') || 'api';

  useContainer(app.select(AuthModule));

  const config = new DocumentBuilder()
    .setTitle('Auth API')
    .setDescription('Authentication and Authorization API')
    .setVersion(packageJson.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(globalPrefix, app, document);

  const port = configService.get<number>('PORT') || 3000;
  await app.listen(port, 'localhost');
  const url = await app.getUrl();
  const localUrl = url.replace('[::1]', 'localhost');
  logger.log(`Application is running on: ${localUrl}`);
  logger.log(`Swagger is running on: ${localUrl}/${globalPrefix}/docs`);
}
bootstrap();
