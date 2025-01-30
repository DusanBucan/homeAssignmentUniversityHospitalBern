import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PatientOutput {
  @Field(() => String)
  name: string;

  @Field(() => String)
  birthDate: string;
}
