import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FileDICOMOutput {
  @Field()
  id: string;

  @Field()
  filePath: string;
}
