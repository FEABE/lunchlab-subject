import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

export class PaginationDto {
  @ApiProperty({
    required: false,
    description: '커서 (마지막으로 받은 데이터의 ID)',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  cursor?: number;

  @ApiProperty({
    required: false,
    description: '한 페이지당 항목 수',
    default: 10,
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  take?: number = 10;
}
