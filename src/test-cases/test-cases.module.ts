import { Module } from '@nestjs/common';
import { TestCasesController } from './test-cases.controller';
import { TestCaseService } from './test-case.service';

@Module({
  controllers: [TestCasesController],
  providers: [TestCaseService],
})
export class TestCasesModule {}
