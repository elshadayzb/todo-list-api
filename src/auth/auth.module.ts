import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './user.respository';

@Module({
  providers: [AuthService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
