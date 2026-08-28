import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { EmailService } from 'src/email/email.service';
import { OTPModule } from 'src/otp/otp.module';
import { ConfigModule } from '@nestjs/config';
import { forwardRef } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';



@Module({
  imports: [TypeOrmModule.forFeature([User]), OTPModule, ConfigModule, forwardRef(() => AuthModule)],
  controllers: [UserController],
  providers: [UserService, EmailService],
  exports: [UserService],
})
export class UserModule {}
