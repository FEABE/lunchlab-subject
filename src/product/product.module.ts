import { Module } from '@nestjs/common';
import { PaginationService } from '../common/services/pagination.service';
import { ProductController } from './controllers/product.controller';
import { ProductService } from './services/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService, PaginationService],
})
export class ProductModule {}
