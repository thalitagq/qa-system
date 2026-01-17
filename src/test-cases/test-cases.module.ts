import { Module } from '@nestjs/common';
import { TestCasesController } from './test-cases.controller';

@Module({
  controllers: [TestCasesController],
  providers: [TestCasesModule],
})
export class TestCasesModule {}
