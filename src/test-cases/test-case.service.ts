import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestCaseDto, UpdateTestCaseDto } from './test-case.dto';
import {
  ensureBusinessRuleExists,
  ensureProjectExists,
  ensureTestCaseExists,
} from '../common/helpers/ensure-exists';
import { BAD_REQUEST_MESSAGES } from '../common/messages/error-messages';

@Injectable()
export class TestCaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreateTestCaseDto) {
    await ensureProjectExists(this.prisma, projectId);

    return this.prisma.testCase.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        projectId,
        type: dto.type,
      },
    });
  }

  async findById(id: string) {
    const testCase = await this.prisma.testCase.findUnique({
      where: { id },
      include: { project: true, rules: true, steps: true },
    });

    if (!testCase) {
      throw new NotFoundException('Caso de teste não encontrado');
    }

    return testCase;
  }

  async update(id: string, dto: UpdateTestCaseDto) {
    await ensureTestCaseExists(this.prisma, id);

    return this.prisma.testCase.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        status: dto.status,
      },
    });
  }

  async addRule(testCaseId: string, ruleCode: string) {
    await ensureTestCaseExists(this.prisma, testCaseId);

    await ensureBusinessRuleExists(this.prisma, ruleCode);

    const alreadyLinked = await this.prisma.testCase.findFirst({
      where: {
        id: testCaseId,
        rules: { some: { code: ruleCode } },
      },
      select: { id: true },
    });

    if (alreadyLinked) {
      throw new BadRequestException(BAD_REQUEST_MESSAGES.RULE_ALREADY_LINKED);
    }

    return this.prisma.testCase.update({
      where: { id: testCaseId },
      data: {
        rules: {
          connect: { code: ruleCode },
        },
      },
      include: { rules: true },
    });
  }

  async deleteRule(testCaseId: string, ruleCode: string) {
    await ensureTestCaseExists(this.prisma, testCaseId);

    await ensureBusinessRuleExists(this.prisma, ruleCode);

    return this.prisma.testCase.update({
      where: { id: testCaseId },
      data: { rules: { disconnect: { code: ruleCode } } },
      include: { rules: true },
    });
  }

  async findBusinessRulesByTestCaseId(id: string) {
    await ensureTestCaseExists(this.prisma, id);

    const testCase = await this.prisma.testCase.findUnique({
      select: { rules: true },
      where: { id },
    });

    return testCase?.rules ?? [];
  }

  async replaceRules(testCaseId: string, ruleCodes: string[]) {
    await ensureTestCaseExists(this.prisma, testCaseId);

    const existingRules = await this.prisma.businessRule.findMany({
      where: { code: { in: ruleCodes } },
      select: { code: true },
    });

    if (existingRules.length !== ruleCodes.length) {
      throw new BadRequestException(BAD_REQUEST_MESSAGES.INVALID_RULE);
    }

    return this.prisma.testCase.update({
      where: { id: testCaseId },
      data: {
        rules: {
          set: ruleCodes.map((code: string) => ({ code })),
        },
      },
      include: { rules: true },
    });
  }
}
