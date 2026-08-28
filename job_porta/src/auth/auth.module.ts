
// // // src/auth/auth.module.ts
// import { Module } from '@nestjs/common';
// import { JwtModule } from '@nestjs/jwt';
// import { PassportModule } from '@nestjs/passport';
// import { JwtStrategy } from './jwt.strategy';
// import { UserModule } from '../user/user.module';
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { RolesGuard } from './roles.guard';

// @Module({
//   imports: [
//     PassportModule,
//     JwtModule.register({
//       secret: 'your-secret-key',
//       signOptions: { expiresIn: '1d' },
//     }),
//     UserModule,
//   ],
//   providers: [
//     AuthService,
//     JwtStrategy,
//     RolesGuard, // <- Include your RolesGuard here
//   ],
//   controllers: [AuthController],
//   // exports: [
//   //   RolesGuard, // <- Export if needed outside
//   // ],
//   exports: [PassportModule, JwtModule,RolesGuard],
// })
// export class AuthModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { OTPModule } from 'src/otp/otp.module';
import { forwardRef } from '@nestjs/common';
import { UserModule } from 'src/user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtAuthGuard } from './jwt.strategy';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // ✅ Required for Repository<User>
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '1h' },
      }),
    }),
    OTPModule,
    forwardRef(() => UserModule),
    ConfigModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, RolesGuard],
  exports: [PassportModule, JwtModule, RolesGuard],
})
export class AuthModule {}
