import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateTestCaseDto,
  OrderDto,
  TestCaseFilterDto,
  UpdateTestCaseDto,
} from './test-case.dto';
import {
  ensureBusinessRuleExists,
  ensureProjectExists,
  ensureTestCaseExists,
} from '../common/helpers/ensure-exists';
import { BAD_REQUEST_MESSAGES } from '../common/messages/error-messages';
import { PaginationDto } from '@/common/dto/pagination.dto';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '@/common/helpers/pagination';
import { Prisma } from 'generated/prisma/client';
import { RedisService } from '@/redis/redis.service';
import {
  CacheInvalidationPatterns,
  CacheKeys,
} from '@/common/cache/cache-keys';

@Injectable()
export class TestCaseService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(projectId: string, dto: CreateTestCaseDto) {
    await ensureProjectExists(this.prisma, projectId);

    const created = await this.prisma.testCase.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        projectId,
        type: dto.type,
      },
    });

    await this.redis.del(CacheInvalidationPatterns.testCases);
    await this.redis.del(CacheKeys.testCaseById(created.id));

    return created;
  }

  async findById(id: string) {
    const cacheKey = CacheKeys.testCaseById(id);

    const cached = await this.redis.get<string>(cacheKey);
    if (cached) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(cached);
    }

    const testCase = await this.prisma.testCase.findUnique({
      where: { id },
      include: { project: true, rules: true, steps: true },
    });

    if (!testCase) {
      throw new NotFoundException('Caso de teste não encontrado');
    }

    await this.redis.set(
      cacheKey,
      JSON.stringify(testCase),
      60, // TTL
    );

    return testCase;
  }

  async update(id: string, dto: UpdateTestCaseDto) {
    await ensureTestCaseExists(this.prisma, id);

    const updated = await this.prisma.testCase.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
        type: dto.type,
        status: dto.status,
      },
    });

    await this.redis.del(CacheInvalidationPatterns.testCases);
    await this.redis.del(CacheKeys.testCaseById(id));

    return updated;
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

    await this.redis.del(CacheInvalidationPatterns.testCases);

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

    await this.redis.del(CacheInvalidationPatterns.testCases);

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

    await this.redis.del(CacheInvalidationPatterns.testCases);

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

  async findAll(
    { page, limit }: PaginationDto,
    filters: TestCaseFilterDto,
    order: OrderDto,
  ) {
    const { skip, take } = getPaginationParams(page, limit);

    const cacheKey = CacheKeys.testCasesList({
      page,
      limit,
      ...filters,
      ...order,
    });

    const cached = await this.redis.get<string>(cacheKey);
    if (cached) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return JSON.parse(cached);
    }

    const where: Prisma.TestCaseWhereInput = {
      ...(filters.status && { status: filters.status }),
      ...(filters.type && { type: filters.type }),
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          {
            description: {
              contains: filters.search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const orderByClause = {
      [order.orderBy ?? 'createdAt']: order.direction ?? 'desc',
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.testCase.findMany({
        where,
        skip,
        take,
        orderBy: orderByClause,
        include: {
          project: true,
          rules: true,
          steps: true,
        },
      }),
      this.prisma.testCase.count({ where }),
    ]);

    const result = {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };

    await this.redis.set(cacheKey, JSON.stringify(result), 60);

    return result;
  }
}
