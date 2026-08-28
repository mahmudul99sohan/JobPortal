

// import { Inject, Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UserModule } from './user/user.module';
// import { User } from './user/entities/user.entity';
// import { AuthModule } from './auth/auth.module'; 
// import { Job } from './job/entities/job.entity';
// import { JobModule } from './job/job.module';
// import { ConfigModule,ConfigService } from '@nestjs/config';
// import { OTP } from './otp/entities/otp.entity';

// @Module({
//   imports: [
//     TypeOrmModule.forRoot({
//       type: 'postgres',
//       host: 'localhost',
//       port: 5432,
//       username: 'postgres',
//       password: '12345',
//       database: 'job_porta_db',
//       entities: [User,Job],
//       autoLoadEntities: true,
//       synchronize: true, 
//     }),
//     // Inject: [ConfigService],
//     TypeOrmModule.forFeature([User, Job, OTP]), 
//     UserModule,
//     AuthModule, 
//     JobModule,
//     ConfigModule.forRoot({
//       isGlobal: true, // Make the configuration globally available
//     }),
//   ],
//   controllers: [AppController],
//   providers: [AppService],
// })
// export class AppModule {}


import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { User } from './user/entities/user.entity';
import { OTP } from './otp/entities/otp.entity';
import { AuthModule } from './auth/auth.module'; 
import { Job } from './job/entities/job.entity';
// import { JobModule } from './job/job.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    EmailModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration globally available
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST', 'localhost'), // Default value if not found
        port: +configService.get('DB_PORT', 5432), // Default to 5432 if not found
        username: configService.get('DB_USERNAME', 'postgres'), // Default value
        password: configService.get('DB_PASSWORD', '12345'), // Default value
        database: configService.get('DB_DATABASE', 'job_portal_db_1'), // Default value
        entities: [User, OTP, Job],
        synchronize: true, // Set to false in production
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([User, OTP]),
    UserModule,
    AuthModule, 
    // JobModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
