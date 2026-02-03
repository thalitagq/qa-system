import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateTestCaseDto,
  ReplaceTestCaseRulesDto,
  UpdateTestCaseDto,
} from './test-case.dto';
import { TestCaseService } from './test-case.service';
import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Delete,
} from '@nestjs/common';
@ApiTags('Casos de teste')
@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly service: TestCaseService) {}

  @ApiParam({ name: 'projectId', description: 'ID do projeto' })
  @ApiOperation({ summary: 'Cria caso de teste' })
  @ApiResponse({ status: 201, description: 'Caso de teste criado com sucesso' })
  @Post(':projectId')
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTestCaseDto,
  ) {
    return this.service.create(projectId, dto);
  }

  @ApiParam({ name: 'id', description: 'ID do caso de teste' })
  @ApiOperation({ summary: 'Busca caso de teste por id' })
  @ApiResponse({ status: 200, description: '' })
  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiParam({ name: 'id', description: 'ID do caso de teste' })
  @ApiOperation({ summary: 'Busca regras de negócio pleo id de caso de teste' })
  @ApiResponse({ status: 200, description: '' })
  @Get(':id/rules')
  findBusinessRulesByTestCaseId(@Param('id') id: string) {
    return this.service.findBusinessRulesByTestCaseId(id);
  }

  @ApiParam({ name: 'id', description: 'ID do caso de teste' })
  @ApiOperation({ summary: 'Atualiza caso de teste' })
  @ApiResponse({
    status: 200,
    description: 'Caso de teste atualizado com sucesso',
  })
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestCaseDto) {
    return this.service.update(id, dto);
  }

  @ApiParam({ name: 'id', description: 'ID do caso de teste' })
  @ApiParam({ name: 'ruleId', description: 'ID da regra de negócio' })
  @ApiOperation({ summary: 'Adiciona regra de negócio ao caso de teste' })
  @ApiResponse({
    status: 200,
    description: 'Regra de negócio adicionada com sucesso',
  })
  @Patch(':id/rules/:ruleId')
  addRule(@Param('id') id: string, @Param('ruleId') ruleId: string) {
    return this.service.addRule(id, ruleId);
  }

  @ApiParam({ name: 'id', description: 'ID do caso de teste' })
  @ApiOperation({
    summary: 'Substitui lista de regras de negócio do caso de teste',
  })
  @ApiResponse({
    status: 200,
    description: 'Regras de negócio atualizadas com sucesso',
  })
  @Patch(':id/rules')
  replaceRules(@Param('id') id: string, @Body() dto: ReplaceTestCaseRulesDto) {
    return this.service.replaceRules(id, dto.ruleCodes);
  }

  @ApiParam({ name: 'id', description: 'ID do caso de teste' })
  @ApiParam({ name: 'ruleId', description: 'ID da regra de negócio' })
  @ApiOperation({ summary: 'Desvincula regra de negócio do caso de teste' })
  @ApiResponse({
    status: 200,
    description: 'Regra de negócio removida com sucesso',
  })
  @Delete(':id/rules/:ruleId')
  deleteRule(@Param('id') id: string, @Param('ruleId') ruleId: string) {
    return this.service.deleteRule(id, ruleId);
  }
}
