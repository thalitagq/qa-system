import { Module } from '@nestjs/common';
import { BusinessRuleController } from './business-rules.controller';
import { BusinessRuleService } from './business-rule.service';

@Module({
  controllers: [BusinessRuleController],
  providers: [BusinessRuleService],
})
export class BusinessRulesModule {}
