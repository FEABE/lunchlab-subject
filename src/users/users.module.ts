import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { UsersController } from './controllers/users.controller';
import { RolesGuard } from './guards/roles.guard';
import { UsersService } from './services/users.service';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  exports: [UsersService],
})
export class UsersModule {}
