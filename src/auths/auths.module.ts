import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtRefreshStrategy } from 'src/common/strategy/jwt-refresh.strategy';
import { JwtStrategy } from 'src/common/strategy/jwt.strategy';
import { UsersModule } from 'src/users/users.module';
import { AuthsController } from './controllers/auths.controller';
import { AuthsService } from './services/auths.service';

@Module({
  imports: [
    ConfigModule,
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthsController],
  providers: [AuthsService, JwtStrategy, JwtRefreshStrategy],
})
export class AuthsModule {}
