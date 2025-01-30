import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { FileService } from '../file.service';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import * as Upload from 'graphql-upload/Upload.js';
import { FileList, FileOutput } from './types/file.list.output';
import { InternalServerErrorException } from '@nestjs/common';

@Resolver()
export class FileResolver {
  constructor(private fileService: FileService) {}

  @Query(() => FileList)
  async getAll(
    @Args('page', { nullable: true, type: () => Int }) page: number = 10,
    @Args('pageSize', { nullable: true, type: () => Int }) pageSize: number = 0,
  ) {
    const [files, count] = await this.fileService.getAll(pageSize, page);
    return {
      page,
      pageSize,
      count,
      files,
    };
  }

  @Mutation(() => FileOutput)
  async uploadFile(@Args('file', { type: () => GraphQLUpload }) file: Upload) {
    const savedFile = await this.fileService.save(file);
    if (!savedFile) {
      throw new InternalServerErrorException();
    }
    return savedFile;
  }
}
