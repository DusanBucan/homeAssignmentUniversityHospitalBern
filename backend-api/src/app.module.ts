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

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'root',
      database: 'test',
      models: [Patient, File],
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      playground: true,
      include: [FileModule],
    }),
    FileModule,
    PatientModule,
    StudyModule,
    SeriesModule,
    ModalityModule,
  ],
})
export class AppModule {}
