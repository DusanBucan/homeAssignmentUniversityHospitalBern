import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as graphqlUploadExpress from 'graphql-upload/graphqlUploadExpress.js';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/graphql',
    graphqlUploadExpress({ maxFileSize: 100000000, maxFiles: 10 }),
  );

  app.enableCors({
    origin: [
      'http://localhost:5173',
      'http://localhost:80',
      'http://frontend:80',
      'http://localhost:80/',
      'http://localhost',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Allow credentials (cookies, authorization headers)
  });
  const appPort = app.get(ConfigService).get('PORT');
  await app.listen(appPort ?? 3000);
}
bootstrap();
