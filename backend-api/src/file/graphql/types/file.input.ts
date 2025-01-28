import { Field, InputType } from '@nestjs/graphql';
import { Scalar } from '@nestjs/graphql';
import GraphQLUpload from 'graphql-upload/GraphQLUpload.mjs';

@Scalar('Upload')
export class Upload {
  description = 'Upload files';

  parseValue(value: any) {
    return GraphQLUpload.parseValue(value);
  }

  serialize(value: any) {
    return GraphQLUpload.serialize(value);
  }

  parseLiteral(ast: any) {
    return GraphQLUpload.parseLiteral(ast, ast.value);
  }
}

@InputType('DICOMFileInput')
export class DICOMFileInput {
  @Field(() => [Upload])
  files: [Upload];
}
