import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateOrderDto } from '../dto/create-order.dto';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, createOrderDto: CreateOrderDto) {
    const { deliveryDate, comment, items } = createOrderDto;

    // 트랜잭션 시작
    return this.prisma.$transaction(async (tx) => {
      // 1. 주문할 상품들의 가격 정보 조회
      const products = await Promise.all(
        items.map(async (item) => {
          const product = await tx.product.findUnique({
            where: { id: item.productId },
            include: {
              productPolicy: {
                where: { userId },
                select: {
                  price: true,
                  hidden: true,
                },
              },
            },
          });

          if (!product) {
            throw new NotFoundException(
              `Product with ID ${item.productId} not found`,
            );
          }

          // 구매 불가능한 상품 체크
          const policy = product.productPolicy[0];
          if (policy?.hidden) {
            throw new BadRequestException(
              `Product with ID ${item.productId} is not available for purchase`,
            );
          }

          return {
            ...product,
            quantity: item.quantity,
            price: policy?.price ?? product.basePrice,
          };
        }),
      );

      // 2. 총 주문 금액 계산
      const totalAmount = products.reduce(
        (sum, product) => sum + product.price * product.quantity,
        0,
      );

      // 3. 주문 생성
      const order = await tx.order.create({
        data: {
          userId,
          deliveryDate: new Date(deliveryDate),
          totalAmount,
          comment,
          orderItems: {
            create: products.map((product) => ({
              productId: product.id,
              quantity: product.quantity,
              price: product.price,
              amount: product.price * product.quantity,
            })),
          },
        },
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });

      // 4. 응답 데이터 형식 변환
      return {
        id: order.id,
        deliveryDate: order.deliveryDate.toISOString().split('T')[0],
        totalAmount: order.totalAmount,
        comment: order.comment,
        items: order.orderItems.map((item) => ({
          id: item.id,
          productId: item.productId,
          productName: item.product.name,
          quantity: item.quantity,
          amount: item.amount,
        })),
      };
    });
  }

  async findByDeliveryDate(userId: number, deliveryDate: string) {
    // 시작 시간과 종료 시간 설정
    const startDate = new Date(deliveryDate);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(deliveryDate);
    endDate.setHours(23, 59, 59, 999);

    // 해당 날짜의 모든 주문 조회
    const orders = await this.prisma.order.findMany({
      where: {
        userId,
        deliveryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: {
        createdAt: 'desc', // 최신 주문부터 정렬
      },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    // 전체 주문 수 조회
    const totalCount = await this.prisma.order.count({
      where: {
        userId,
        deliveryDate: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // 응답 형식에 맞게 데이터 변환
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      deliveryDate: order.deliveryDate.toISOString().split('T')[0],
      totalAmount: order.totalAmount,
      comment: order.comment,
      createdAt: order.createdAt,
      items: order.orderItems.map((item) => ({
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        quantity: item.quantity,
        amount: item.amount,
      })),
    }));

    return {
      orders: formattedOrders,
      totalCount,
    };
  }
}
