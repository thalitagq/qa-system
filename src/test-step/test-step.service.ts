import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestStepDto, UpdateTestStepDto } from './test-step.dto';

@Injectable()
export class TestStepService {
  constructor(private readonly prisma: PrismaService) {}

  async create(testCaseId: string, dto: CreateTestStepDto) {
    const testCaseExists = await this.prisma.testCase.findUnique({
      where: { id: testCaseId },
      select: { id: true },
    });

    if (!testCaseExists) {
      throw new NotFoundException('Caso de teste não encontrado');
    }

    const orderExists = await this.prisma.testStep.findFirst({
      where: { testCaseId, order: dto.order },
    });

    if (orderExists) {
      throw new BadRequestException('Já existe um passo com essa ordem');
    }

    return this.prisma.testStep.create({
      data: {
        action: dto.action,
        expectedResult: dto.expectedResult,
        order: dto.order,
        testCaseId,
      },
    });
  }

  async findById(id: string) {
    const testStep = await this.prisma.testStep.findUnique({
      where: { id },
      include: { testCase: true },
    });

    if (!testStep) {
      throw new NotFoundException('Passo de teste não encontrado');
    }

    return testStep;
  }

  async update(testCaseId: string, testStepId: string, dto: UpdateTestStepDto) {
    await this.ensureTestCaseExists(testCaseId);

    await this.ensureExists(testStepId, testCaseId);

    const orderExists = await this.prisma.testStep.findFirst({
      where: {
        testCaseId,
        order: dto.order,
        NOT: { id: testStepId },
      },
    });

    if (orderExists) {
      throw new BadRequestException('Já existe um passo com essa ordem');
    }

    return this.prisma.testStep.update({
      data: {
        action: dto.action,
        expectedResult: dto.expectedResult,
        order: dto.order,
      },
      where: { id: testStepId },
    });
  }

  async findByTestCaseId(testCaseId: string) {
    await this.ensureTestCaseExists(testCaseId);

    return this.prisma.testStep.findMany({
      where: { testCaseId },
      orderBy: { order: 'asc' },
    });
  }

  private async ensureExists(id: string, testCaseId: string) {
    const step = await this.prisma.testStep.findUnique({
      where: { id },
      select: { id: true, testCaseId: true },
    });

    if (!step) {
      throw new NotFoundException('Passo de teste não encontrado');
    }

    if (step.testCaseId !== testCaseId) {
      throw new NotFoundException(
        'Passo não pertence ao caso de teste informado',
      );
    }
  }

  private async ensureTestCaseExists(testCaseId: string) {
    const exists = await this.prisma.testCase.findUnique({
      where: { id: testCaseId },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Caso de teste não encontrado');
    }
  }
}
