import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { Role } from 'generated/prisma/client';

export class RegisterDto {
  @ApiProperty({ example: 'Joe' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'joe@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-forte-123', minLength: 8 })
  @IsString()
  @MinLength(8)
  password: string;

  @ApiProperty({ enum: Object.values(Role), required: false, example: Role.QA })
  @IsOptional()
  @IsEnum(Role)
  role?: Role;
}

export class LoginDto {
  @ApiProperty({ example: 'thalita@email.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'senha-forte-123' })
  @IsString()
  password: string;
}
