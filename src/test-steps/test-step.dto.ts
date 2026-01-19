import { IsInt, IsString, Length, Min } from 'class-validator';

export class CreateTestStepDto {
  @IsInt()
  @Min(1)
  order: number;

  @IsString()
  @Length(3, 255)
  action: string;

  @IsString()
  @Length(3, 255)
  expectedResult: string;
}

export class UpdateTestStepDto {
  order?: number;
  action?: string;
  expectedResult?: string;
}
