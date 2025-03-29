import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    example: 'lunchlab',
    description: '사용자 아이디 (영문, 숫자만 허용, 4자 이상)',
  })
  @IsString()
  @MinLength(4)
  @Matches(/^[A-Za-z0-9]+$/, {
    message: '아이디는 영문자와 숫자만 사용 가능합니다.',
  })
  username: string;

  @ApiProperty({
    example: 'Lunchlab@1137',
    description: '비밀번호 (최소 8자, 영문 대/소문자, 숫자, 특수문자 포함)',
  })
  @IsString()
  @MinLength(8)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    {
      message:
        '비밀번호는 최소 8자 이상이며, 영문 대/소문자, 숫자, 특수문자를 포함해야 합니다.',
    },
  )
  password: string;

  @ApiProperty({
    example: '홍길동',
    description: '이름 (한글, 영문 허용)',
  })
  @IsString()
  @Matches(/^[가-힣A-Za-z\s]{2,30}$/, {
    message: '이름은 2-30자의 한글 또는 영문만 사용 가능합니다.',
  })
  name: string;

  @ApiProperty({
    example: '+821012341234',
    description: '전화번호 (E.164 형식)',
  })
  @IsPhoneNumber()
  phone: string;

  @ApiProperty({
    example: '(주) 런치랩',
    description: '회사명 (특수문자 (), 한글, 영문, 숫자 허용)',
  })
  @IsString()
  @Matches(/^[가-힣A-Za-z0-9\s()]{2,50}$/, {
    message: '회사명은 2-50자의 한글, 영문, 숫자, 괄호만 사용 가능합니다.',
  })
  company: string;
}
