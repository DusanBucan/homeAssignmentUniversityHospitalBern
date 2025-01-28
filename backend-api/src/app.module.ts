import { Module } from '@nestjs/common';
import { FileModule } from './file/file.module';
import { PatientModule } from './patient/patient.module';
import { StudyModule } from './study/study.module';
import { SeriesModule } from './series/series.module';
import { ModalityModule } from './modality/modality.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { Patient } from './patient/patient.model';
import { File } from './file/file.model';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { GraphQLModule } from '@nestjs/graphql';
import { ObjectStorageModule } from './object-storage/object-storage.module';

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'backend-api-user',
      password: 'password',
      database: 'backend-api-db',
      models: [Patient, File],
      synchronize: true,
    }),
    FileModule,
    PatientModule,
    StudyModule,
    SeriesModule,
    ModalityModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      autoSchemaFile: true,
      driver: ApolloDriver,
      playground: true,
      include: [FileModule],
    }),
    ObjectStorageModule,
  ],
})
export class AppModule {}
