import { Body, Controller, Param, Post, Get, Patch, Put } from '@nestjs/common';
import { BusinessRuleService } from './business-rule.service';
import {
  CreateBusinessRuleDto,
  UpdateBusinessRuleDto,
} from './bussines-rule.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Regras de negócio')
@Controller('business-rules')
export class BusinessRuleController {
  constructor(private readonly service: BusinessRuleService) {}

  @ApiOperation({ summary: 'Cria uma regra de negócio' })
  @ApiResponse({
    status: 201,
    description: 'Regra de negócio criada com sucesso',
  })
  @Post()
  create(@Body() dto: CreateBusinessRuleDto) {
    return this.service.create(dto);
  }

  @ApiParam({ name: 'code', description: 'Código da regra de negócio' })
  @ApiOperation({ summary: 'Busca regra de negócio por código' })
  @ApiResponse({ status: 200, description: '' })
  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @ApiParam({ name: 'code', description: 'Código da regra de negócio' })
  @ApiOperation({
    summary:
      'Lista todos os casos de teste relacionados com a regra de negócio',
  })
  @ApiResponse({ status: 200, description: '' })
  @Get(':code/test-cases')
  findTestCasesByBusinessRules(@Param('code') code: string) {
    return this.service.findTestCasesByBusinessRule(code);
  }

  @ApiParam({ name: 'code', description: 'Código da regra de negócio' })
  @ApiOperation({ summary: 'Atualiza regra de negócio' })
  @ApiResponse({
    status: 200,
    description: 'Regra de negócio atualizada com sucesso',
  })
  @Put(':code')
  update(@Param('code') code: string, @Body() dto: UpdateBusinessRuleDto) {
    return this.service.update(code, dto);
  }

  @ApiParam({ name: 'code', description: 'Código da regra de negócio' })
  @ApiOperation({ summary: 'Desativa regra de negócio' })
  @ApiResponse({
    status: 200,
    description: 'Regra de negócio desativada com sucesso',
  })
  @Patch(':code/deactivate')
  deactivate(@Param('code') code: string) {
    return this.service.deactivate(code);
  }
}
