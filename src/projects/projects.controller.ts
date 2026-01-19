import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectService) {}

  @ApiOperation({ summary: 'Criar um projeto' })
  @ApiResponse({ status: 201, description: 'Projeto criado com sucesso' })
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Listar todos os projetos' })
  @ApiResponse({ status: 200, description: '' })
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @ApiOperation({ summary: 'Busca projeto por id' })
  @ApiResponse({ status: 200, description: '' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiOperation({ summary: 'Atualiza projeto' })
  @ApiResponse({ status: 200, description: 'Projeto atualizado com sucesso' })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @ApiOperation({ summary: 'Desativar projeto' })
  @ApiResponse({ status: 200, description: 'Projeto desativado com sucesso' })
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}
