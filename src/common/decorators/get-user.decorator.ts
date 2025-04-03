import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';
import { Request } from 'express';

interface JwtUser {
  id: number;
  username: string;
  role: Role;
  iat?: number;
  exp?: number;
}

interface RequestWithUser extends Request {
  user: JwtUser;
}

// 허용되는 사용자 속성 키 타입 정의
type UserKey = keyof JwtUser;

export const GetUser = createParamDecorator(
  <T = JwtUser>(data: UserKey | undefined, ctx: ExecutionContext): T => {
    const request = ctx.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;

    return (data ? user?.[data] : user) as T;
  },
);
