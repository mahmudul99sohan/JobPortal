
// main.ts
// import { ValidationPipe } from '@nestjs/common';
// import { NestFactory } from '@nestjs/core';
// import { AppModule } from './app.module';

// async function bootstrap() {
//   const app = await NestFactory.create(AppModule);
//   app.useGlobalPipes(
//     new ValidationPipe({
//       whitelist: true, // strips out properties not in the DTO
//       forbidNonWhitelisted: true, // throws an error if extra fields are present
//       transform: true, // auto-transform payloads to DTO classes
//     }),
//   );

//   await app.listen(3000);
// }
// bootstrap();


import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors(); 

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // strips out properties not in the DTO
      forbidNonWhitelisted: true, // throws an error if extra fields are present
      transform: true, // auto-transform payloads to DTO classes
    }),
  );

  // ADD THIS LINE TO ENABLE CORS:
  app.enableCors({
    origin: 'http://localhost:3001', // frontend URL
  });

  await app.listen(3000);
}
bootstrap();
