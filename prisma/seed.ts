import { PrismaClient, Role } from '@prisma/client';
import * as bcryptjs from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // 환경 변수에서 관리자 정보 가져오기
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123!@#';
  const adminName = process.env.ADMIN_NAME || '관리자';
  const adminPhone = process.env.ADMIN_PHONE || '+821012341234';
  const adminCompany = process.env.ADMIN_COMPANY || '런치랩';

  // 관리자 계정 생성
  const hashedPassword = await bcryptjs.hash(adminPassword, 10);
  await prisma.user.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      password: hashedPassword,
      name: adminName,
      phone: adminPhone,
      company: adminCompany,
      role: Role.ADMIN,
    },
  });

  // 기본 상품 데이터도 환경 변수로 관리할 수 있습니다
  const products = [
    {
      id: 12,
      name: '가정식 도시락',
      basePrice: 9000, // schema 변경에 따라 price -> basePrice
    },
    {
      id: 23,
      name: '브런치 샐러드',
      basePrice: 9500, // schema 변경에 따라 price -> basePrice
    },
  ];

  // 상품 데이터 생성
  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.id },
      update: {},
      create: product,
    });
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    void prisma.$disconnect();
  });
