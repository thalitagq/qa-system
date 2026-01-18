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

@Controller('test-cases')
export class TestCasesController {
  constructor(private readonly service: TestCaseService) {}

  @Post(':projectId')
  create(
    @Param('projectId') projectId: string,
    @Body() dto: CreateTestCaseDto,
  ) {
    return this.service.create(projectId, dto);
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @Get(':id/rules')
  findBusinessRulesByTestCaseId(@Param('id') id: string) {
    return this.service.findBusinessRulesByTestCaseId(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestCaseDto) {
    return this.service.update(id, dto);
  }

  @Patch(':id/rules/:ruleId')
  addRule(@Param('id') id: string, @Param('ruleId') ruleId: string) {
    return this.service.addRule(id, ruleId);
  }

  @Patch(':id/rules')
  replaceRules(@Param('id') id: string, @Body() dto: ReplaceTestCaseRulesDto) {
    return this.service.replaceRules(id, dto.ruleCodes);
  }

  @Delete(':id/rules/:ruleId')
  deleteRule(@Param('id') id: string, @Param('ruleId') ruleId: string) {
    return this.service.deleteRule(id, ruleId);
  }
}
