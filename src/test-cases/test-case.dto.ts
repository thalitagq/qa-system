import { TestStatus, TestType } from '../../generated/prisma/enums';

export class CreateTestCaseDto {
  title: string;
  description?: string;
  type: TestType;
  status: TestStatus;
  projectId: string;
}
