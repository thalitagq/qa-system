import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginDto, RegisterDto } from './auth.dto';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';

@ApiTags('Autenticação')
@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Public()
  @ApiOperation({ summary: 'Registrar usuário' })
  @ApiResponse({ status: 201, description: 'Usuário criado com sucesso' })
  @Post('register')
  register(@Body() dto: RegisterDto) {
    return this.service.register(dto);
  }

  @Public()
  @ApiOperation({ summary: 'Login' })
  @ApiResponse({ status: 200, description: 'Token JWT retornado' })
  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.service.login(dto);
  }
}
