import { CreateTestCaseDto, UpdateTestCaseDto } from './test-case.dto';
import { TestCaseService } from './test-case.service';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

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

  @Post(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTestCaseDto) {
    return this.service.update(id, dto);
  }
}
