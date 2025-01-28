import { Controller, Get, Param, StreamableFile } from '@nestjs/common';
import { FileService } from '../file.service';

@Controller('/api/v1/files')
export class FileController {
  constructor(private fileService: FileService) {}

  @Get(':id')
  async getDICOMFile(@Param('id') id: string) {
    const dicomFile = await this.fileService.get(id);

    return new StreamableFile(dicomFile, {
      type: 'application/octet-stream',
      disposition: `attachment; filename="${id}"`,
    });
  }
}
