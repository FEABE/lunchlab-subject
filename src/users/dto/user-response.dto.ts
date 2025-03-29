import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { PaginatedResponse } from 'src/common/interfaces/pagination.interface';

export class UserResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'lunchlab' })
  username: string;

  @ApiProperty({ example: '홍길동' })
  name: string;

  @ApiProperty({ example: '+821012341234' })
  phone: string;

  @ApiProperty({ example: '(주) 런치랩' })
  company: string;

  @ApiProperty({ enum: Role, example: Role.USER })
  role: Role;

  @ApiProperty({ example: '2024-03-29T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-29T10:30:00.000Z' })
  updatedAt: Date;
}

// 페이지네이션된 유저 응답을 위한 DTO
export class PaginatedUserResponseDto
  implements PaginatedResponse<UserResponseDto>
{
  @ApiProperty({ type: [UserResponseDto] })
  data: UserResponseDto[];

  @ApiProperty({
    description: '다음 페이지 커서',
    example: 11,
    required: false,
  })
  nextCursor?: number;

  @ApiProperty({
    description: '현재 페이지 데이터 수',
    example: 10,
  })
  count: number;
}
