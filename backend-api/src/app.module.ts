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
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        dialect: 'mysql',
        host: configService.get('DB_HOST') || 'localhost',
        port: configService.get('DB_PORT') || 3306,
        username: configService.get('DB_USERNAME') || 'backend-api-user',
        password: configService.get('DB_PASSWORD') || 'password',
        database: configService.get('DB_DATABASE') || 'backend-api-db',
        models: [Patient, File],
        autoLoadModels: true,
        synchronize: true,
        sync: {
          force: true,
        },
      }),
      inject: [ConfigService],
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
