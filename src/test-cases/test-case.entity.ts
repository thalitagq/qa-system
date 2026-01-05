export enum TestType {
  ANALYSIS = 'ANALYSIS',
  NEW_FEATURE = 'NEW_FEATURE',
  BUG_FIX = 'BUG_FIX',
  IMPROVEMENT = 'IMPROVEMENT',
  REGRESSION = 'REGRESSION',
}

export enum TestStatus {
  DRAFT = 'DRAFT',
  READY = 'READY',
  EXECUTED = 'EXECUTED',
}

export class TestCase {
  id: string;
  projectId: string;
  title: string;
  description?: string;
  type: TestType;
  status: TestStatus;
  createdAt: Date;
}
