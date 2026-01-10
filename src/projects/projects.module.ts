import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectsController } from './projects.controller';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectService],
})
export class ProjectsModule {}
