import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateBusinessRuleDto,
  UpdateBusinessRuleDto,
} from './bussines-rule.dto';
import { normalizeText } from './helpers/normalize-text';
import { randomUUID } from 'crypto';
import { ensureBusinessRuleExists } from '../common/helpers/ensure-exists';
import {
  BAD_REQUEST_MESSAGES,
  NOT_FOUND_MESSAGES,
} from '../common/messages/error-messages';
import {
  buildPaginationMeta,
  getPaginationParams,
} from '@/common/helpers/pagination';
import { PaginationDto } from '@/common/dto/pagination.dto';
import { CacheKeys } from '@/common/cache/cache-keys';
import { RedisService } from '@/redis/redis.service';

@Injectable()
export class BusinessRuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async create(dto: CreateBusinessRuleDto) {
    const normalizedTitle = normalizeText(dto.title);

    const exists = await this.prisma.businessRule.findUnique({
      where: { normalizedTitle },
    });
    if (exists) {
      throw new BadRequestException(
        BAD_REQUEST_MESSAGES.DUPLICATED_BUSINESS_RULE,
      );
    }

    return this.prisma.businessRule.create({
      data: {
        title: dto.title,
        normalizedTitle,
        code: this.generateCode(),
        description: dto.description,
      },
    });
  }

  async findByCode(code: string) {
    const cacheKey = CacheKeys.businessRuleByCode(code);

    const cached = await this.redis.get<string>(cacheKey);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    if (cached) return JSON.parse(cached);

    const rule = await this.prisma.businessRule.findUnique({
      where: { code },
    });

    if (!rule) throw new NotFoundException(NOT_FOUND_MESSAGES.BUSINESS_RULE);

    await this.redis.set(cacheKey, JSON.stringify(rule), 120);

    return rule;
  }

  async update(code: string, dto: UpdateBusinessRuleDto) {
    const existing = await this.prisma.businessRule.findUnique({
      where: { code },
    });

    if (!existing) {
      throw new NotFoundException(NOT_FOUND_MESSAGES.BUSINESS_RULE);
    }

    let normalizedTitle = existing.normalizedTitle;

    if (dto.title && dto.title !== existing.title) {
      normalizedTitle = normalizeText(dto.title);

      const duplicated = await this.prisma.businessRule.findUnique({
        where: { normalizedTitle },
      });

      if (duplicated && duplicated.code !== code) {
        throw new BadRequestException(
          BAD_REQUEST_MESSAGES.DUPLICATED_BUSINESS_RULE,
        );
      }
    }

    return this.prisma.businessRule.update({
      where: { code },
      data: {
        title: dto.title,
        description: dto.description,
        normalizedTitle,
      },
    });
  }

  async deactivate(code: string) {
    await ensureBusinessRuleExists(this.prisma, code);

    return this.prisma.businessRule.update({
      data: { active: false },
      where: { code },
    });
  }

  async findTestCasesByBusinessRule(
    ruleCode: string,
    { page, limit }: PaginationDto,
  ) {
    await ensureBusinessRuleExists(this.prisma, ruleCode);

    const { skip, take } = getPaginationParams(page, limit);

    const [items, total] = await this.prisma.$transaction([
      this.prisma.testCase.findMany({
        where: {
          rules: { some: { code: ruleCode } },
        },
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.testCase.count({
        where: {
          rules: { some: { code: ruleCode } },
        },
      }),
    ]);

    return {
      data: items,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  private generateCode(): string {
    return `BR-${randomUUID().slice(0, 8).toUpperCase()}`;
  }
}
