import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/common/decorators/public.decorator';
import { CreateProductPolicyDto } from '../dto/create-product-policy.dto';
import { ProductPolicyService } from '../services/product-policy.service';

@ApiTags('product-policies')
@Controller('product-policies')
export class ProductPolicyController {
  constructor(private readonly productPolicyService: ProductPolicyService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: '회원별 상품 판매 정책 설정' })
  @ApiResponse({
    status: 200,
    description: '정책 설정 성공',
  })
  async create(@Body() createProductPolicyDto: CreateProductPolicyDto) {
    return this.productPolicyService.upsert(createProductPolicyDto);
  }
}
