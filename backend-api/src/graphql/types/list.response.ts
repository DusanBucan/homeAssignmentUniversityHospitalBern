import { Field, ObjectType } from '@nestjs/graphql';
import { GraphQLInt } from 'graphql';

@ObjectType()
export class ListResponse {
  @Field(() => GraphQLInt)
  page: number;

  @Field(() => GraphQLInt)
  pageSize: number;

  @Field(() => GraphQLInt)
  count: number;
}
