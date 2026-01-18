import { Body, Controller, Param, Post, Get, Patch, Put } from '@nestjs/common';
import { BusinessRuleService } from './business-rule.service';
import {
  CreateBusinessRuleDto,
  UpdateBusinessRuleDto,
} from './bussines-rule.dto';

@Controller('business-rules')
export class BusinessRuleController {
  constructor(private readonly service: BusinessRuleService) {}

  @Post()
  create(@Body() dto: CreateBusinessRuleDto) {
    return this.service.create(dto);
  }

  @Get(':code')
  findByCode(@Param('code') code: string) {
    return this.service.findByCode(code);
  }

  @Get(':code/test-cases')
  findTestCasesByBusinessRules(@Param('code') code: string) {
    return this.service.findTestCasesByBusinessRule(code);
  }

  @Put(':code')
  update(@Param('code') code: string, dto: UpdateBusinessRuleDto) {
    return this.service.update(code, dto);
  }

  @Patch(':code/deactivate')
  deactivate(@Param('code') code: string) {
    return this.service.deactivate(code);
  }
}
