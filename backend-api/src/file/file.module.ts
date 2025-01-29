import { Module } from '@nestjs/common';
import { File } from './file.model';
import { SequelizeModule } from '@nestjs/sequelize';
import { FILE_REPOSITORY } from './file.constants';
import { SequelizeFileRepository } from './file.repository';
import { FileService } from './file.service';
import { FileResolver } from './graphql/file.resolver';
import { ObjectStorageModule } from '../object-storage/object-storage.module';
import { FileController } from './rest/file.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    SequelizeModule.forFeature([File]),
    ObjectStorageModule,
    ConfigModule,
  ],
  providers: [
    { provide: FILE_REPOSITORY, useClass: SequelizeFileRepository },
    FileService,
    FileResolver,
  ],
  exports: [FileService, FileResolver],
  controllers: [FileController],
})
export class FileModule {}
