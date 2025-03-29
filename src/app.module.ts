import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthsModule } from './auths/auths.module';

@Module({
  imports: [UsersModule, AuthsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
