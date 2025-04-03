import { ApiProperty } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: '가정식 도시락' })
  name: string;

  @ApiProperty({ example: 9000 })
  price: number;

  @ApiProperty({ example: '2024-03-29T10:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-03-29T10:30:00.000Z' })
  updatedAt: Date;
}
export class PaginatedProductResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data: ProductResponseDto[];

  @ApiProperty({
    example: 23,
    description: '다음 페이지의 커서 값',
    required: false,
  })
  nextCursor?: number;

  @ApiProperty({ example: 2 })
  count: number;
}
