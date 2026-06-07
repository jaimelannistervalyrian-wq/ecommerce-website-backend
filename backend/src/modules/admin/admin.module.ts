import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { PrismaService } from '../../prisma.service';
import { ProductsModule } from '../products/products.module';
import { BannersModule } from '../banners/banners.module';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [ProductsModule, BannersModule, OrdersModule],
    controllers: [AdminController],
    providers: [AdminService, PrismaService],
})
export class AdminModule { }
