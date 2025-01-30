import { Field, ObjectType } from '@nestjs/graphql';
import { PatientOutput } from '../../../patient/graphql/types/patient.output';
import { SeriesOutput } from '../../../series/graphql/types/series.output';
import { ListResponse } from '../../../graphql/types/list.response';

@ObjectType('file')
export class FileOutput {
  @Field(() => String)
  id: string;

  @Field(() => String)
  filePath: string;

  @Field(() => PatientOutput)
  patient: PatientOutput;

  @Field(() => SeriesOutput)
  series: SeriesOutput;

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
