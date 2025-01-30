import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SeriesOutput {
  @Field(() => String)
  description: string;
}
