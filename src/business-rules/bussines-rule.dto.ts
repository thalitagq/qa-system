import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateBusinessRuleDto {
  @ApiProperty({
    example: 'Uma tarefa somente é adicionada se possuir um título',
    description: 'Título da regra de negócio',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    example:
      'Para adicionar uma nova tarefa na lista é necessário que o item em questão possua um título',
    description: 'Descrição da regra de negócio',
    required: false,
  })
  description?: string;
}

export class UpdateBusinessRuleDto {
  @ApiProperty({
    example: 'Uma tarefa somente é adicionada somente se possuir um título',
    required: false,
  })
  title?: string;

  @ApiProperty({
    example:
      'Para adicionar uma nova tarefa na lista é necessário que o item em questão possua um título, caso contrário um erro será exibido',
    required: false,
  })
  description?: string;
}
