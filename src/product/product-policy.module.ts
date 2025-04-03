import { Module } from '@nestjs/common';
import { ProductPolicyController } from './controllers/product-policy.controller';
import { ProductPolicyService } from './services/product-policy.service';

@Module({
  controllers: [ProductPolicyController],
  providers: [ProductPolicyService],
})
export class ProductPolicyModule {}
