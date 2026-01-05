import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBusinessRuleDto } from './dto/create-business-rule';
import { normalizeText } from './helpers/normalize-text';

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

  private generateCode(): string {
    return `BR-${Date.now()}`;
  }
}
