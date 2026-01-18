import { Module } from '@nestjs/common';
import { TestStepsController } from './test-steps.controller';
import { TestStepService } from './test-step.service';

@Module({ controllers: [TestStepsController], providers: [TestStepService] })
export class TestStepsModule {}
