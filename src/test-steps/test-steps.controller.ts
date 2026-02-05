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
import { TestStepService } from './test-step.service';
import { CreateTestStepDto, UpdateTestStepDto } from './test-step.dto';
import {
  ApiIdParam,
  ApiSuccessResponse,
  ApiErrorResponse,
} from '@/common/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('Passos de teste')
@Controller('test-steps')
export class TestStepsController {
  constructor(private readonly service: TestStepService) {}

  @ApiIdParam('testCaseId', 'ID do caso de teste')
  @ApiOperation({ summary: 'Cria um passo de teste' })
  @ApiSuccessResponse(201, 'Passo de teste criado com sucesso', {
    id: 'uuid',
    order: 1,
    action: 'Preencher formulário',
    expectedResult: 'Formulário validado',
  })
  @ApiErrorResponse(
    404,
    'Caso de teste não encontrado',
    'Caso de teste não encontrado',
  )
  @ApiErrorResponse(400, 'Ordem duplicada', 'Já existe um passo com essa ordem')
  @Post(':testCaseId')
  create(
    @Param('testCaseId') testCaseId: string,
    @Body() dto: CreateTestStepDto,
  ) {
    return this.service.create(testCaseId, dto);
  }

  @ApiIdParam('testCaseId', 'ID do caso de teste')
  @ApiIdParam('testStepId', 'ID do passo de teste')
  @ApiOperation({ summary: 'Busca passo de teste por id' })
  @ApiSuccessResponse(200, 'Passo de teste encontrado', {
    id: 'uuid',
    order: 1,
    action: 'Preencher formulário',
    expectedResult: 'Formulário validado',
  })
  @ApiErrorResponse(
    404,
    'Passo de teste não encontrado',
    'Passo de teste não encontrado',
  )
  @Get(':testCaseId/:testStepId')
  findById(
    @Param('testStepId') testStepId: string,
    @Param('testCaseId') testCaseId: string,
  ) {
    return this.service.findById(testCaseId, testStepId);
  }

  @ApiIdParam('testCaseId', 'ID do caso de teste')
  @ApiOperation({
    summary: 'Lista todos os passos de teste de um caso de teste',
  })
  @ApiSuccessResponse(200, 'Passos de teste listados com sucesso', [
    {
      id: 'uuid',
      order: 1,
      action: 'Preencher formulário',
      expectedResult: 'Formulário validado',
    },
  ])
  @ApiErrorResponse(
    404,
    'Caso de teste não encontrado',
    'Caso de teste não encontrado',
  )
  @Get(':testCaseId')
  findByTestCaseId(
    @Param('testCaseId') testCaseId: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findByTestCaseId(testCaseId, pagination);
  }

  @ApiIdParam('testCaseId', 'ID do caso de teste')
  @ApiIdParam('testStepId', 'ID do passo de teste')
  @ApiOperation({ summary: 'Atualiza um passo de teste' })
  @ApiSuccessResponse(200, 'Passo de teste atualizado com sucesso')
  @ApiErrorResponse(
    404,
    'Passo de teste não encontrado',
    'Passo de teste não encontrado',
  )
  @ApiErrorResponse(400, 'Ordem duplicada', 'Já existe um passo com essa ordem')
  @Patch(':testCaseId/:testStepId')
  update(
    @Param('testCaseId') testCaseId: string,
    @Param('testStepId') testStepId: string,
    @Body() dto: UpdateTestStepDto,
  ) {
    return this.service.update(testCaseId, testStepId, dto);
  }
}
