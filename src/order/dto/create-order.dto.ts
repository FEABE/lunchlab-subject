import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export class OrderItemDto {
  @ApiProperty({ example: 12 })
  @IsNumber()
  @IsNotEmpty()
  productId: number;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @IsNotEmpty()
  @Min(1)
  quantity: number;
}

export class CreateOrderDto {
  @ApiProperty({ example: '2025-02-20' })
  @IsNotEmpty()
  @IsDateString()
  deliveryDate: string;

  @ApiProperty({ example: '배송 시 문 앞에 두어주세요', required: false })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
