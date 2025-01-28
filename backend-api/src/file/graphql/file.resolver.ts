import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { FileService } from '../file.service';
import { FileDICOMOutput } from './types/file.output';
import { DICOMFileInput } from './types/file.input';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Mutation(() => FileDICOMOutput)
  async uploadDICOM(@Args('dicomImage') dicomFileInput: DICOMFileInput) {
    await this.fileService.save(dicomFileInput);
    return {};
  }
}
