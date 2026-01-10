import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestCaseDto } from './test-case.dto';

@Injectable()
export class TestCaseService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateTestCaseDto) {
    return this.prisma.testCase.create({
      data: {
        title: dto.title,
        description: dto.description,
        status: dto.status,
        projectId: dto.projectId,
        type: dto.type,
      },
    });
  }
}
