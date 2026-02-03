import { Module } from '@nestjs/common';
import { PrismaModule } from 'prisma/prisma.module';
import { BusinessRulesModule } from './business-rules/business-rules.module';
import { ProjectsModule } from './projects/projects.module';
import { TestCasesModule } from './test-cases/test-cases.module';
import { TestStepsModule } from './test-steps/test-steps.module';

@Module({
  imports: [
    PrismaModule,
    BusinessRulesModule,
    ProjectsModule,
    TestCasesModule,
    TestStepsModule,
  ],
})
export class AppModule {}
