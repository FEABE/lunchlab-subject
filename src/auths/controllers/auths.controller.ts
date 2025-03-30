import { Body, Controller, Logger, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { AuthsService } from '../services/auths.service';

@ApiTags('auth')
@Controller('auths')
export class AuthsController {
  private readonly logger = new Logger(AuthsController.name);
  constructor(private readonly authService: AuthsService) {}

  @Post('login')
  @Public()
  @ApiOperation({ summary: '로그인' })
  @ApiResponse({
    status: 200,
    description: '로그인 성공',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: '인증 실패',
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }
}
