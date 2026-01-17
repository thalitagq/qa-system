import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { TestStepService } from './test-step.service';
import { CreateTestStepDto, UpdateTestStepDto } from './test-step.dto';

@Controller('test-steps')
export class TestStepsController {
  constructor(private readonly service: TestStepService) {}

  @Post(':testCaseId')
  create(
    @Param('testCaseId') testCaseId: string,
    @Body() dto: CreateTestStepDto,
  ) {
    return this.service.create(testCaseId, dto);
  }

  @Get(':testCaseId/:testStepId')
  findById(@Param('testStepId') testStepId: string) {
    return this.service.findById(testStepId);
  }

  @Get(':testCaseId')
  findByTestCaseId(@Param('testCaseId') testCaseId: string) {
    return this.service.findByTestCaseId(testCaseId);
  }

  @Patch(':testCaseId/:testStepId')
  update(
    @Param('testCaseId') testCaseId: string,
    @Param('testStepId') testStepId: string,
    @Body() dto: UpdateTestStepDto,
  ) {
    return this.service.update(testCaseId, testStepId, dto);
  }
}
