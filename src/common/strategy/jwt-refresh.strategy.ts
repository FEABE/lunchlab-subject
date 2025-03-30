import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Role } from '@prisma/client';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
interface JwtPayload {
  sub: number;
  username: string;
  role: Role;
}

interface JwtPayloadWithRefreshToken extends JwtPayload {
  refreshToken: string;
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey:
        configService.get<string>('JWT_REFRESH_SECRET') ||
        'fallback-refresh-secret',
      passReqToCallback: true as const,
    } as const);
  }

  validate(req: Request, payload: JwtPayload): JwtPayloadWithRefreshToken {
    const authHeader = req.get('authorization');
    if (!authHeader) {
      throw new UnauthorizedException('No refresh token provided');
    }

    const refreshToken = authHeader.replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
