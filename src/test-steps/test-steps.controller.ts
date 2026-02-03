import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TestStepService } from './test-step.service';
import { CreateTestStepDto, UpdateTestStepDto } from './test-step.dto';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
@ApiTags('Passos de teste')
@Controller('test-steps')
export class TestStepsController {
  constructor(private readonly service: TestStepService) {}

  @ApiParam({ name: 'id', description: 'ID do caso de teste' })
  @ApiOperation({ summary: 'Cria passo de teste' })
  @ApiResponse({
    status: 201,
    description: 'Passo de teste criado com sucesso',
  })
  @Post(':testCaseId')
  create(
    @Param('testCaseId') testCaseId: string,
    @Body() dto: CreateTestStepDto,
  ) {
    return this.service.create(testCaseId, dto);
  }

  @ApiParam({ name: 'testCaseId', description: 'ID do caso de teste' })
  @ApiParam({ name: 'testStepId', description: 'ID do passo de teste' })
  @ApiOperation({ summary: 'Busca passo de teste por id' })
  @ApiResponse({ status: 200, description: '' })
  @Get(':testCaseId/:testStepId')
  findById(
    @Param('testCaseId') testCaseId: string,
    @Param('testStepId') testStepId: string,
  ) {
    return this.service.findById(testCaseId, testStepId);
  }

  @ApiParam({ name: 'testCaseId', description: 'ID do caso de teste' })
  @ApiOperation({ summary: 'Busca passos de teste pelo id do caso de teste' })
  @ApiResponse({ status: 200, description: '' })
  @Get(':testCaseId')
  findByTestCaseId(@Param('testCaseId') testCaseId: string) {
    return this.service.findByTestCaseId(testCaseId);
  }

  @ApiParam({ name: 'testCaseId', description: 'ID do caso de teste' })
  @ApiParam({ name: 'testStepId', description: 'ID do passo de teste' })
  @ApiOperation({ summary: 'Atualiza passo de teste' })
  @ApiResponse({
    status: 200,
    description: 'Passo de teste atualizado com sucesso',
  })
  @Patch(':testCaseId/:testStepId')
  update(
    @Param('testCaseId') testCaseId: string,
    @Param('testStepId') testStepId: string,
    @Body() dto: UpdateTestStepDto,
  ) {
    return this.service.update(testCaseId, testStepId, dto);
  }
}
