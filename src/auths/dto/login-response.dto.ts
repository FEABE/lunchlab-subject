import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class LoginResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'dummy' })
  username: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: '+821012341234' })
  phone: string;

  @ApiProperty({ example: '(주) 더미랩' })
  company: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  role: Role;

  @ApiProperty({ example: new Date() })
  createdAt: Date;

  @ApiProperty({ example: new Date() })
  updatedAt: Date;

  @ApiProperty({ example: 'eyJhbGci...' })
  accessToken: string;

  @ApiProperty({ example: 'eyJhbGci...' })
  refreshToken: string;
}
