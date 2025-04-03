import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty } from 'class-validator';

export class OrderQueryDto {
  @ApiProperty({ example: '2025-02-20', description: '배송 요청일' })
  @IsNotEmpty()
  @IsDateString()
  deliveryDate: string;
}
