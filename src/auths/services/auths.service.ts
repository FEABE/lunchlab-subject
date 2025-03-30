import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Tokens } from 'src/common/types/tokens.type';
import { UsersService } from 'src/users/services/users.service';
import { LoginDto } from '../dto/login.dto';

@Injectable()
export class AuthsService {
  private readonly logger = new Logger(AuthsService.name);
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async getTokens(
    userId: number,
    username: string,
    role: string,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get('JWT_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          username,
          role,
        },
        {
          secret: this.configService.get('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async login(loginDto: LoginDto) {
    // 비밀번호 검증을 위해 password 포함하여 조회
    const userWithPassword = await this.usersService.findByUsername(
      loginDto.username,
      true,
    );
    if (!userWithPassword)
      throw new UnauthorizedException('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      userWithPassword.password,
    );
    if (!isPasswordValid)
      throw new UnauthorizedException('Invalid credentials');

    const tokens = await this.getTokens(
      userWithPassword.id,
      userWithPassword.username,
      userWithPassword.role,
    );
    await this.updateRefreshToken(userWithPassword.id, tokens.refreshToken);

    // password를 제외한 사용자 정보만 가져오기
    const { password, ...userInfo } = userWithPassword;

    return {
      ...userInfo,
      ...tokens,
    };
  }

  async refreshTokens(userId: number, refreshToken: string): Promise<Tokens> {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('Access Denied');
    }

    // Refresh Token 검증
    const refreshTokenMatches = await bcrypt.compare(
      refreshToken,
      user.refreshToken,
    );

    if (!refreshTokenMatches) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const tokens = await this.getTokens(user.id, user.username, user.role);
    await this.updateRefreshToken(user.id, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: number) {
    // 로그아웃 시 refreshToken 제거
    await this.usersService.update(userId, {
      refreshToken: null,
    });
  }

  async updateRefreshToken(userId: number, refreshToken: string | null) {
    if (refreshToken) {
      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      await this.usersService.update(userId, {
        refreshToken: hashedRefreshToken,
      });
    } else {
      await this.usersService.update(userId, {
        refreshToken: null,
      });
    }
  }
}
