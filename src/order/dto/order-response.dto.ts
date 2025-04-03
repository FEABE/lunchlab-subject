import { ApiProperty } from '@nestjs/swagger';

export class OrderItemResponseDto {
  @ApiProperty({ example: 23 })
  id: number;

  @ApiProperty({ example: 12 })
  productId: number;

  @ApiProperty({ example: '가정식 도시락' })
  productName: string;

  @ApiProperty({ example: 10 })
  quantity: number;

  @ApiProperty({ example: 100000 })
  amount: number;
}

export class OrderResponseDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: '2025-02-20' })
  deliveryDate: string;

  @ApiProperty({ example: 140000 })
  totalAmount: number;

  @ApiProperty({ example: '배송 시 문 앞에 두어주세요' })
  comment?: string;

  @ApiProperty({ type: [OrderItemResponseDto] })
  items: OrderItemResponseDto[];

  @ApiProperty({ example: '2025-02-20T10:30:00.000Z' })
  createdAt: Date;
}

export class OrdersResponseDto {
  @ApiProperty({ type: [OrderResponseDto] })
  orders: OrderResponseDto[];

  @ApiProperty({ example: 2 })
  totalCount: number;
}
