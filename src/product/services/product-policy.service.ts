import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductPolicyDto } from '../dto/create-product-policy.dto';

@Injectable()
export class ProductPolicyService {
  constructor(private prisma: PrismaService) {}

  async upsert(createProductPolicyDto: CreateProductPolicyDto) {
    const { productId, userId, price, hidden } = createProductPolicyDto;

    if (price === undefined && hidden === undefined) {
      throw new BadRequestException('Either price or hidden must be provided');
    }

    // 상품 존재 여부 확인
    const product = await this.prisma.product.findUnique({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // 사용자 존재 여부 확인
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    return this.prisma.productPolicy.upsert({
      where: {
        productId_userId: {
          productId,
          userId,
        },
      },
      create: createProductPolicyDto,
      update: {
        ...(price !== undefined && { price }),
        ...(hidden !== undefined && { hidden }),
      },
    });
  }
}
