import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({
    example: 'Lista de tarefas',
    description: 'Nome do projeto',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  name: string;

  @ApiProperty({
    example: 'Projeto de lista de tarefas',
    description: 'Descrição do projeto',
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  description: string;
}

export class UpdateProjectDto {
  @ApiProperty({
    example: 'Lista de tarefas v2',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiProperty({
    example: 'Versão atualizada do projeto',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 255)
  description?: string;

  @ApiProperty({
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
