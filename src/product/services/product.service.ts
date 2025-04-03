import { Injectable } from '@nestjs/common';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationService } from '../../common/services/pagination.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(
    private prisma: PrismaService,
    private paginationService: PaginationService,
  ) {}

  async findAll(params: PaginationDto, userId: number) {
    // 1. 먼저 상품 정책 정보를 따로 조회
    const productPolicies = await this.prisma.productPolicy.findMany({
      where: { userId },
      select: {
        productId: true,
        price: true,
        hidden: true,
      },
    });

    // 2. 정책 정보를 Map으로 변환하여 빠른 조회가 가능하게 함
    const policyMap = new Map(
      productPolicies.map((policy) => [policy.productId, policy]),
    );

    // 3. 기본 상품 정보 조회
    const select = {
      id: true,
      name: true,
      basePrice: true,
      createdAt: true,
      updatedAt: true,
    };

    // 4. hidden이 true인 상품 ID 목록
    const hiddenProductIds = productPolicies
      .filter((policy) => policy.hidden)
      .map((policy) => policy.productId);

    // 5. hidden이 아닌 상품만 조회
    const products = await this.paginationService.getPaginatedData({
      model: this.prisma.product,
      params,
      select,
      where: {
        id: {
          notIn: hiddenProductIds,
        },
      },
    });

    // 6. 각 상품에 대해 정책 가격 적용
    return {
      ...products,
      data: products.data.map((product) => {
        const policy = policyMap.get(product.id);
        return {
          ...product,
          price: policy?.price ?? product.basePrice,
        };
      }),
    };
  }
}
