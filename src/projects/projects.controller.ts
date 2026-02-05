import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ProjectService } from './project.service';
import { CreateProjectDto, UpdateProjectDto } from './project.dto';
import {
  ApiIdParam,
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@/common/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('Projetos')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly service: ProjectService) {}

  @ApiOperation({ summary: 'Cria um projeto' })
  @ApiSuccessResponse(201, 'Projeto criado com sucesso', {
    id: 'uuid',
    name: 'Projeto QA',
    active: true,
  })
  @Post()
  create(@Body() dto: CreateProjectDto) {
    return this.service.create(dto);
  }

  @ApiOperation({ summary: 'Lista todos os projetos ativos' })
  @ApiSuccessResponse(200, 'Projetos listados com sucesso', [
    { id: 'uuid', name: 'Projeto QA', active: true },
  ])
  @Get()
  findAll(@Query() pagination: PaginationDto) {
    return this.service.findAll(pagination);
  }

  @ApiIdParam()
  @ApiOperation({ summary: 'Busca projeto por id' })
  @ApiSuccessResponse(200, 'Projeto encontrado', {
    id: 'uuid',
    name: 'Projeto QA',
    active: true,
  })
  @ApiErrorResponse(404, 'Projeto não encontrado', 'Projeto não encontrado')
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiIdParam()
  @ApiOperation({ summary: 'Atualiza projeto' })
  @ApiSuccessResponse(200, 'Projeto atualizado com sucesso')
  @ApiErrorResponse(404, 'Projeto não encontrado', 'Projeto não encontrado')
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return this.service.update(id, dto);
  }

  @ApiIdParam()
  @ApiOperation({ summary: 'Desativa projeto' })
  @ApiSuccessResponse(200, 'Projeto desativado com sucesso')
  @ApiErrorResponse(404, 'Projeto não encontrado', 'Projeto não encontrado')
  @Patch(':id/deactivate')
  deactivate(@Param('id') id: string) {
    return this.service.deactivate(id);
  }
}
