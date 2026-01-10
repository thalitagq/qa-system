import { Body, Controller, Post } from '@nestjs/common';
import { BusinessRuleService } from './business-rule.service';
import { CreateBusinessRuleDto } from './bussines-rule.dto';

@Controller('business-rules')
export class BusinessRuleController {
  constructor(private readonly service: BusinessRuleService) {}

  @Post()
  create(@Body() dto: CreateBusinessRuleDto) {
    return this.service.create(dto);
  }
}
