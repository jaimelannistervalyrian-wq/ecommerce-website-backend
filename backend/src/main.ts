import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security & middleware
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());
  app.enableCors({ origin: true, credentials: true });
  app.setGlobalPrefix('api');

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
    }),
  );

  // Swagger
  const swagger = new DocumentBuilder()
    .setTitle('SS Jeweleries API')
    .setDescription('Production-ready luxury jewelry e-commerce REST API')
    .setVersion('2.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication & authorization')
    .addTag('Products', 'Product catalog')
    .addTag('Categories', 'Product categories')
    .addTag('Cart', 'Shopping cart management')
    .addTag('Wishlist', 'Wishlist management')
    .addTag('Orders', 'Order management')
    .addTag('Users', 'User profile & addresses')
    .addTag('Banners', 'CMS banners')
    .addTag('Admin', 'Admin-only operations')
    .build();

  const document = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup('docs', app, document);

  // Graceful shutdown
  const prisma = app.get(PrismaService);
  await prisma.enableShutdownHooks(app);

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`🚀 SS Jeweleries API running on http://localhost:${port}/api`);
  console.log(`📚 Swagger docs at http://localhost:${port}/docs`);
}

bootstrap();
