import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestStepDto, UpdateTestStepDto } from './test-step.dto';
import { ensureTestCaseExists } from '@/common/helpers/ensure-exists';
import {
  BAD_REQUEST_MESSAGES,
  NOT_FOUND_MESSAGES,
} from '@/common/messages/error-messages';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '@/common/helpers/pagination';
import { PaginationDto } from '@/common/dto/pagination.dto';

@Injectable()
export class TestStepService {
  constructor(private readonly prisma: PrismaService) {}

  async create(testCaseId: string, dto: CreateTestStepDto) {
    await ensureTestCaseExists(this.prisma, testCaseId);

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
  async findById(testCaseId: string, testStepId: string) {
    await ensureTestCaseExists(this.prisma, testCaseId);

    const step = await this.prisma.testStep.findUnique({
      where: { id: testStepId },
      include: { testCase: true },
    });

    if (!step || step.testCaseId !== testCaseId) {
      throw new NotFoundException(NOT_FOUND_MESSAGES.TEST_STEP);
    }

    return step;
  }

  async update(testCaseId: string, testStepId: string, dto: UpdateTestStepDto) {
    await ensureTestCaseExists(this.prisma, testCaseId);

    await this.ensureExists(testStepId, testCaseId);

    const orderExists = await this.prisma.testStep.findFirst({
      where: {
        testCaseId,
        order: dto.order,
        NOT: { id: testStepId },
      },
    });

    if (orderExists) {
      throw new BadRequestException(BAD_REQUEST_MESSAGES.STEP_ORDER_EXISTS);
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

  async findByTestCaseId(testCaseId: string, { page, limit }: PaginationDto) {
    await ensureTestCaseExists(this.prisma, testCaseId);

    const { skip, take } = getPaginationParams(page, limit);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.testStep.findMany({
        where: { testCaseId },
        skip,
        take,
        orderBy: { order: 'asc' },
      }),
      this.prisma.testStep.count({ where: { testCaseId } }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  private async ensureExists(id: string, testCaseId: string) {
    const step = await this.prisma.testStep.findUnique({
      where: { id },
      select: { id: true, testCaseId: true },
    });

    if (!step) {
      throw new NotFoundException(NOT_FOUND_MESSAGES.TEST_STEP);
    }

    if (step.testCaseId !== testCaseId) {
      throw new BadRequestException(
        'Passo não pertence ao caso de teste informado',
      );
    }
  }
}
