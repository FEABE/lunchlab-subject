import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, ValidateIf } from 'class-validator';

export class CreateProductPolicyDto {
  @ApiProperty({ example: 33 })
  @IsNumber()
  productId: number;

  @ApiProperty({ example: 12 })
  @IsNumber()
  userId: number;

  @ApiProperty({ example: 12800, required: false })
  @IsNumber()
  @ValidateIf((o) => o.hidden === undefined)
  @IsOptional()
  price?: number;

  @ApiProperty({ example: false, required: false })
  @IsBoolean()
  @ValidateIf((o) => o.price === undefined)
  @IsOptional()
  hidden?: boolean;
}
