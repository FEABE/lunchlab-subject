import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../../common/decorators/get-user.decorator';
import { CreateOrderDto } from '../dto/create-order.dto';
import { OrderQueryDto } from '../dto/order-query.dto';
import { OrderResponseDto, OrdersResponseDto } from '../dto/order-response.dto';
import { OrderService } from '../services/order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ summary: '주문 조회' })
  @ApiResponse({
    status: 200,
    description: '주문 조회 성공',
    type: OrdersResponseDto,
  })
  async findByDeliveryDate(
    @Query() query: OrderQueryDto,
    @GetUser('id') userId: number,
  ) {
    return this.orderService.findByDeliveryDate(userId, query.deliveryDate);
  }

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ summary: '주문 등록' })
  @ApiResponse({
    status: 201,
    description: '주문 등록 성공',
    type: OrderResponseDto,
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @GetUser('id') userId: number,
  ) {
    return this.orderService.create(userId, createOrderDto);
  }
}
