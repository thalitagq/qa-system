import { NotFoundException } from '@nestjs/common';
import { NOT_FOUND_MESSAGES } from '@/common/messages/error-messages';
import { PrismaService } from '@prisma/prisma.service';

async function ensureExists<T>(
  promise: Promise<T | null>,
  errorMessage: string,
): Promise<T> {
  const result = await promise;

  if (!result) {
    throw new NotFoundException(errorMessage);
  }

  return result;
}

export async function ensureTestCaseExists(
  prisma: PrismaService,
  testCaseId: string,
) {
  return ensureExists(
    prisma.testCase.findUnique({
      where: { id: testCaseId },
      select: { id: true },
    }),
    NOT_FOUND_MESSAGES.TEST_CASE,
  );
}

export async function ensureBusinessRuleExists(
  prisma: PrismaService,
  ruleCode: string,
) {
  return ensureExists(
    prisma.businessRule.findUnique({
      where: { code: ruleCode },
      select: { code: true },
    }),
    NOT_FOUND_MESSAGES.BUSINESS_RULE,
  );
}

export async function ensureProjectExists(prisma: PrismaService, id: string) {
  return ensureExists(
    prisma.project.findUnique({
      where: { id: id },
      select: { id: true },
    }),
    NOT_FOUND_MESSAGES.PROJECT,
  );
}
