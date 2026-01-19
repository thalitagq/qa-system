import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { TestStatus, TestType } from '../../generated/prisma/enums';

export class CreateTestCaseDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 100)
  title: string;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;

  @IsEnum(TestType)
  type: TestType;

  @IsEnum(TestStatus)
  status: TestStatus;
}

export class UpdateTestCaseDto {
  @IsOptional()
  @IsString()
  @Length(3, 100)
  title?: string;

  @IsOptional()
  @IsString()
  @Length(3, 500)
  description?: string;

  @IsOptional()
  @IsEnum(TestType)
  type?: TestType;

  @IsOptional()
  @IsEnum(TestStatus)
  status?: TestStatus;
}

export class ReplaceTestCaseRulesDto {
  @IsArray()
  ruleCodes: string[];
}
