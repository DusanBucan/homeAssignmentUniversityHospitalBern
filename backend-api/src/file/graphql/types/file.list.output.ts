import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLInt } from 'graphql';

@ObjectType()
export class ListResponse {
  @Field(() => GraphQLInt)
  offset: number;

  @Field(() => GraphQLInt)
  limit: number;

  @Field(() => GraphQLInt)
  size: number;
}

@ObjectType('file')
export class FileOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  filePath: string;

  @Field({ nullable: true })
  fileCreatedDate: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}

@ObjectType('files')
export class FileList extends ListResponse {
  @Field(() => [FileOutput])
  files: FileOutput[];
}
