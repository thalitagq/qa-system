import {
  Body,
  Controller,
  Param,
  Post,
  Get,
  Patch,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BusinessRuleService } from './business-rule.service';
import {
  CreateBusinessRuleDto,
  UpdateBusinessRuleDto,
} from './bussines-rule.dto';
import {
  ApiCodeParam,
  ApiErrorResponse,
  ApiSuccessResponse,
} from '@/common/swagger';
import { PaginationDto } from '@/common/dto/pagination.dto';

@ApiTags('Regras de negócio')
@Controller('business-rules')
export class BusinessRuleController {
  constructor(private readonly service: BusinessRuleService) {}

  @ApiOperation({ summary: 'Cria uma regra de negócio' })
  @ApiSuccessResponse(201, 'Regra criada com sucesso', {
    code: 'BR-ABC123',
    title: 'Pagamento válido',
  })
  @ApiErrorResponse(
    400,
    'Regra duplicada',
    'Já existe uma regra com o mesmo significado',
  )
  @Post()
  create(@Body() dto: CreateBusinessRuleDto) {
    return this.service.create(dto);
  }

  @ApiCodeParam()
  @ApiOperation({ summary: 'Busca regra de negócio por código' })
  @ApiSuccessResponse(200, 'Regra encontrada', {
    code: 'BR-ABC123',
    title: 'Pagamento válido',
  })
  @ApiErrorResponse(
    404,
    'Regra não encontrada',
    'Regra de negócio não encontrada',
  )
  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @ApiCodeParam()
  @ApiOperation({
    summary: 'Lista casos de teste relacionados à regra de negócio',
  })
  @ApiSuccessResponse(200, 'Casos de teste listados', [
    { id: 'uuid', title: 'CT-Login válido' },
  ])
  @Get(':code/test-cases')
  findTestCasesByBusinessRule(
    @Param('code') code: string,
    @Query() pagination: PaginationDto,
  ) {
    return this.service.findTestCasesByBusinessRule(code, pagination);
  }

  @ApiCodeParam()
  @ApiOperation({ summary: 'Atualiza regra de negócio' })
  @ApiSuccessResponse(200, 'Regra atualizada com sucesso')
  @ApiErrorResponse(
    404,
    'Regra não encontrada',
    'Regra de negócio não encontrada',
  )
  @Put(':code')
  update(@Param('code') code: string, @Body() dto: UpdateBusinessRuleDto) {
    return this.service.update(code, dto);
  }

  @ApiCodeParam()
  @ApiOperation({ summary: 'Desativa regra de negócio' })
  @ApiSuccessResponse(200, 'Regra desativada com sucesso')
  @Patch(':code/deactivate')
  deactivate(@Param('code') code: string) {
    return this.service.deactivate(code);
  }
}
