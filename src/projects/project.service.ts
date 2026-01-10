import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';

@Injectable()
export class ProjectService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        name: dto.name,
        description: dto.description,
        createdAt: new Date(),
      },
    });
  }

  findAll() {
    return this.prisma.project.findMany({
      where: { active: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      include: {
        testCases: true,
      },
    });

    if (!project) {
      throw new NotFoundException('Projeto não encontrado');
    }

    return project;
  }

  async update(id: string, dto: UpdateProjectDto) {
    await this.ensureExists(id);

    return this.prisma.project.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deactivate(id: string) {
    await this.ensureExists(id);

    return this.prisma.project.update({
      where: { id },
      data: {
        active: false,
      },
    });
  }

  private async ensureExists(id: string) {
    const exists = await this.prisma.project.findUnique({
      where: { id },
    });

    if (!exists) {
      throw new NotFoundException('Projeto não encontrado');
    }
  }
}
