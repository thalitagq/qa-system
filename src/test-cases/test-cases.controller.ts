import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateTestCaseDto,
  ReplaceTestCaseRulesDto,
  TestCaseFilterDto,
  UpdateTestCaseDto,
} from './test-case.dto';
import { TestCaseService } from './test-case.service';
import {
  ApiIdParam,
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@/common/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('Casos de teste')
@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly service: TestCaseService) {}

  @ApiOperation({ summary: 'Cria um caso de teste' })
  @ApiSuccessResponse(201, 'Caso de teste criado com sucesso', {
    id: 'uuid',
    title: 'Validar login',
    status: 'DRAFT',
  })
  @ApiErrorResponse(404, 'Projeto não encontrado', 'Projeto não encontrado')
  @Post(':projectId')
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTestCaseDto,
  ) {
    return this.service.create(projectId, dto);
  }

  @ApiIdParam()
  @ApiOperation({ summary: 'Busca caso de teste por id' })
  @ApiSuccessResponse(200, 'Caso de teste encontrado', {
    id: 'uuid',
    title: 'Validar login',
    rules: [],
    steps: [],
  })
  @ApiErrorResponse(
    404,
    'Caso de teste não encontrado',
    'Caso de teste não encontrado',
  )
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiIdParam()
  @ApiOperation({
    summary: 'Lista regras de negócio vinculadas ao caso de teste',
  })
  @ApiSuccessResponse(200, 'Regras de negócio listadas com sucesso', [
    { code: 'BR-LOGIN', title: 'Usuário deve estar autenticado' },
  ])
  @ApiErrorResponse(
    404,
    'Caso de teste não encontrado',
    'Caso de teste não encontrado',
  )
  @Get(':id/rules')
  findBusinessRulesByTestCaseId(@Param('id') id: string) {
    return this.service.findBusinessRulesByTestCaseId(id);
  }

  @ApiOperation({ summary: 'Lista casos de teste com paginação' })
  @ApiSuccessResponse(200, 'Lista de casos de teste')
  @ApiErrorResponse(
    404,
    'Não há casos de teste para essa busca',
    'Não há casos de teste para essa busca',
  )
  @Get()
  findAll(
    @Query() pagination: PaginationDto,
    @Query() filters: TestCaseFilterDto,
  ) {
    return this.service.findAll(pagination, filters);
  }

  @ApiIdParam()
  @ApiOperation({ summary: 'Atualiza um caso de teste' })
  @ApiSuccessResponse(200, 'Caso de teste atualizado com sucesso')
  @ApiErrorResponse(
    404,
    'Caso de teste não encontrado',
    'Caso de teste não encontrado',
  )
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestCaseDto) {
    return this.service.update(id, dto);
  }

  @ApiIdParam()
  @ApiOperation({ summary: 'Vincula regra de negócio ao caso de teste' })
  @ApiSuccessResponse(200, 'Regra de negócio vinculada com sucesso')
  @ApiErrorResponse(
    400,
    'Regra já vinculada',
    'Regra já vinculada ao caso de teste',
  )
  @ApiErrorResponse(
    404,
    'Caso de teste ou regra não encontrados',
    'Caso de teste não encontrado',
  )
  @Patch(':id/rules/:ruleId')
  addRule(@Param('id') id: string, @Param('ruleId') ruleId: string) {
    return this.service.addRule(id, ruleId);
  }

  @ApiIdParam()
  @ApiOperation({
    summary: 'Substitui todas as regras de negócio do caso de teste',
  })
  @ApiSuccessResponse(200, 'Regras de negócio substituídas com sucesso')
  @ApiErrorResponse(400, 'Regra inválida', 'Uma ou mais regras são inválidas')
  @Patch(':id/rules')
  replaceRules(@Param('id') id: string, @Body() dto: ReplaceTestCaseRulesDto) {
    return this.service.replaceRules(id, dto.ruleCodes);
  }

  @ApiIdParam()
  @ApiOperation({
    summary: 'Remove regra de negócio do caso de teste',
  })
  @ApiSuccessResponse(200, 'Regra de negócio removida com sucesso')
  @ApiErrorResponse(
    404,
    'Caso de teste ou regra não encontrados',
    'Caso de teste não encontrado',
  )
  @Delete(':id/rules/:ruleId')
  deleteRule(@Param('id') id: string, @Param('ruleId') ruleId: string) {
    return this.service.deleteRule(id, ruleId);
  }
}
