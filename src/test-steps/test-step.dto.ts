import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Length, Min } from 'class-validator';

export class CreateTestStepDto {
  @ApiProperty({
    example: 1,
    minimum: 1,
    description: 'Número da posição do passo de teste',
  })
  @IsInt()
  @Min(1)
  order: number;

  @ApiProperty({
    example: 'Clicar no botão adicionar nova tarefa',
    description: 'Ação a ser executada no passo de teste',
  })
  @IsString()
  @Length(3, 255)
  action: string;

  @ApiProperty({
    example: 'Nova tarefa é exibida na lista de tarefas',
    description: 'Resultado esperado na realização da ação',
  })
  @IsString()
  @Length(3, 255)
  expectedResult: string;
}

export class UpdateTestStepDto {
  @ApiProperty({
    example: 2,
    minimum: 1,
    required: false,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  order?: number;

  @ApiProperty({
    example: 'Clicar no botão adicionar nova tarefa v2',
    required: false,
  })
  @IsString()
  @Length(3, 255)
  @IsOptional()
  action?: string;

  @ApiProperty({
    example: 'Nova tarefa é exibida na lista de tarefas v2',
    required: false,
  })
  @IsString()
  @Length(3, 255)
  @IsOptional()
  expectedResult?: string;
}
