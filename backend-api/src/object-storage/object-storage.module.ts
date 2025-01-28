import { Module } from '@nestjs/common';
import { LocalFilesystemObjectStorageService } from './local-filesystem.object-storage';
import { OBJECT_STORAGE_SERVICE } from './object-storage.constants';

@Module({
  providers: [
    {
      provide: OBJECT_STORAGE_SERVICE,
      useClass: LocalFilesystemObjectStorageService,
    },
  ],
  exports: [
    {
      provide: OBJECT_STORAGE_SERVICE,
      useClass: LocalFilesystemObjectStorageService,
    },
  ],
})
export class ObjectStorageModule {}
