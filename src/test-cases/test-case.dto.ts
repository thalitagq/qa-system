import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Length,
  MinLength,
} from 'class-validator';
import { TestStatus, TestType } from '../../generated/prisma/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TEST_STATUS_DESCRIPTION, TEST_TYPE_DESCRIPTION } from '@/common/enums';

export class CreateTestCaseDto {
  @ApiProperty({
    example: 'Adicionar tarefa',
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @ApiProperty({
    example:
      'Teste responsável por validar ação de adicionar nova tarefa na lista',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;

  @ApiProperty({
    enum: TestType,
    example: TestType.NEW_FEATURE,
    description: Object.entries(TEST_TYPE_DESCRIPTION)
      .map(([key, value]) => `${key} - ${value}\n`)
      .join('\n'),
  })
  @IsEnum(TestType)
  type: TestType;

  @ApiProperty({
    enum: TestStatus,
    example: TestStatus.DRAFT,
    description: Object.entries(TEST_STATUS_DESCRIPTION)
      .map(([key, value]) => `${key} - ${value}\n`)
      .join('\n'),
  })
  @IsEnum(TestStatus)
  status: TestStatus;
}

export class UpdateTestCaseDto {
  @ApiProperty({
    example: 'Adicionar tarefa com horário',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;

  @ApiProperty({
    example:
      'Teste responsável por validar ação de adicionar nova tarefa na lista com horário',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;

  @ApiProperty({
    enum: TestType,
    required: false,
  })
  @IsOptional()
  @IsEnum(TestType)
  type?: TestType;

  @ApiProperty({
    enum: TestStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;
}

export class ReplaceTestCaseRulesDto {
  @ApiProperty({
    example: ['BR-1A2B3C4D', 'BR-9Z8Y7X6W'],
    description: 'Lista de códigos de regras de negócio',
  })
  @IsArray()
  ruleCodes: string[];
}

export class TestCaseFilterDto {
  @ApiPropertyOptional({ enum: TestStatus })
  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;

  @ApiPropertyOptional({ enum: TestType })
  @IsOptional()
  @IsEnum(TestType)
  type?: TestType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsUUID()
  projectId?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  search?: string;
}
