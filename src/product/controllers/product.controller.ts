import { Controller, Get, Query } from '@nestjs/common';
import {
    ApiBearerAuth,
    ApiOperation,
    ApiResponse,
    ApiTags,
} from '@nestjs/swagger';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ProductResponseDto } from '../dto/product-response.dto';
import { ProductService } from '../services/product.service';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: '상품 목록 조회' })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: '상품 목록 조회 성공',
    type: ProductResponseDto,
    isArray: true,
  })
  async findAll(@Query() params: PaginationDto, @GetUser('id') userId: number) {
    return this.productService.findAll(params, userId);
  }
}
