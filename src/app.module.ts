import { Module } from '@nestjs/common';
import { AuthsModule } from './auths/auths.module';
import { PrismaModule } from './prisma/prisma.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthsModule],
})
export class AppModule {}
