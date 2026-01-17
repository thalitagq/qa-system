export class CreateTestStepDto {
  order: number;
  action: string;
  expectedResult: string;
}

export class UpdateTestStepDto {
  order?: number;
  action?: string;
  expectedResult?: string;
}
