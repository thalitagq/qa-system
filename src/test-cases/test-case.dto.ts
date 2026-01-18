import { TestStatus, TestType } from '../../generated/prisma/enums';

export class CreateTestCaseDto {
  title: string;
  description?: string;
  type: TestType;
  status: TestStatus;
}

export class UpdateTestCaseDto {
  title?: string;
  description?: string;
  type?: TestType;
  status?: TestStatus;
}

export class ReplaceTestCaseRulesDto {
  ruleCodes: string[];
}
