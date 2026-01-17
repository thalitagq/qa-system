import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTestCaseDto, UpdateTestCaseDto } from './test-case.dto';

@Injectable()
export class TestCaseService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreateTestCaseDto) {
    const projetcExists = await this.prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });

    if (!projetcExists) {
      throw new NotFoundException('Projeto não encontrado');
    }

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
    await this.ensureExists(id);

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

  private async ensureExists(id: string) {
    const exists = await this.prisma.testCase.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new NotFoundException('Caso de teste não encontrado');
    }
  }
}
