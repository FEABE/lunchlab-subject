import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    example: 'lunchlab',
    description: '사용자 아이디',
  })
  @IsString()
  @MinLength(4)
  username: string;

  @ApiProperty({
    example: 'Lunchlab@1137',
    description: '비밀번호',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
