import { Module } from '@nestjs/common';
import { File } from './file.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([File])],
})
export class FileModule {}
