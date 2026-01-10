export class CreateProjectDto {
  name: string;
  description: string;
}

export class UpdateProjectDto {
  name?: string;
  description?: string;
  active?: boolean;
}
