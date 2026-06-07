import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharedJwtModule } from './common/jwt.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { OrdersModule } from './modules/orders/orders.module';
import { UsersModule } from './modules/users/users.module';
import { BannersModule } from './modules/banners/banners.module';
import { AdminModule } from './modules/admin/admin.module';
import { UploadModule } from './modules/upload/upload.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    SharedJwtModule,   // global: JwtService + JwtAuthGuard + RolesGuard available everywhere
    AuthModule,
    ProductsModule,
    CategoriesModule,
    CartModule,
    WishlistModule,
    OrdersModule,
    UsersModule,
    BannersModule,
    AdminModule,
    UploadModule,
  ],
  // No APP_GUARD here — guards are applied per-controller via @UseGuards()
})
export class AppModule { }
