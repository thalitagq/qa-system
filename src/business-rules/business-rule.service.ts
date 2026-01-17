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

@Injectable()
export class BusinessRuleService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateBusinessRuleDto) {
    const normalizedTitle = normalizeText(dto.title);

    const exists = await this.prisma.businessRule.findUnique({
      where: { normalizedTitle },
    });
    if (exists) {
      throw new BadRequestException(
        'Já existe uma regra com o mesmo significado',
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
    const businessRule = await this.prisma.businessRule.findUnique({
      where: { code },
      include: { testCases: true },
    });

    if (!businessRule) {
      throw new NotFoundException('Regra de negócio não encontrada');
    }

    return businessRule;
  }

  async update(code: string, dto: UpdateBusinessRuleDto) {
    const existing = await this.prisma.businessRule.findUnique({
      where: { code },
    });

    if (!existing) {
      throw new NotFoundException('Regra de negócio não encontrada');
    }

    let normalizedTitle = existing.normalizedTitle;

    if (dto.title && dto.title !== existing.title) {
      normalizedTitle = normalizeText(dto.title);

      const duplicated = await this.prisma.businessRule.findUnique({
        where: { normalizedTitle },
      });

      if (duplicated && duplicated.code !== code) {
        throw new BadRequestException(
          'Já existe uma regra com o mesmo significado',
        );
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
  }

  async deactivate(code: string) {
    await this.ensureExists(code);

    return this.prisma.businessRule.update({
      data: { active: false },
      where: { code },
    });
  }

  private async ensureExists(code: string) {
    const exists = await this.prisma.businessRule.findUnique({
      where: { code },
    });

    if (!exists) {
      throw new NotFoundException('Regra de negócio não encontrada');
    }
  }

  private generateCode(): string {
    return `BR-${randomUUID().slice(0, 8).toUpperCase()}`;
  }
}
