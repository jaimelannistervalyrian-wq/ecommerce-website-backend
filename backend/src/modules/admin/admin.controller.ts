import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators';
import { ProductsService } from '../products/products.service';
import { BannersService } from '../banners/banners.service';
import { OrdersService } from '../orders/orders.service';
import { AdminService } from './admin.service';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin')
export class AdminController {
    constructor(
        private readonly adminService: AdminService,
        private readonly productsService: ProductsService,
        private readonly bannersService: BannersService,
        private readonly ordersService: OrdersService,
    ) { }

    // ── Overview ──────────────────────────────────────────────────────────────
    @Get('overview')
    getOverview() {
        return this.adminService.getOverview();
    }

    // ── Orders ────────────────────────────────────────────────────────────────
    @Get('orders')
    getAllOrders() {
        return this.ordersService.getAllOrders();
    }

    @Patch('orders/:id/status')
    updateOrderStatus(
        @Param('id') id: string,
        @Body() body: { status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' },
    ) {
        return this.adminService.updateOrderStatus(id, body.status);
    }

    // ── Products ──────────────────────────────────────────────────────────────
    @Post('products')
    createProduct(
        @Body()
        body: {
            name: string;
            slug: string;
            description: string;
            price: number;
            salePrice?: number;
            stock: number;
            categorySlug: string;
            images?: string[];
            isFeatured?: boolean;
            isBestSeller?: boolean;
        },
    ) {
        return this.productsService.create(body);
    }

    @Patch('products/:id')
    updateProduct(
        @Param('id') id: string,
        @Body()
        body: Partial<{
            name: string;
            slug: string;
            description: string;
            price: number;
            salePrice: number | null;
            stock: number;
            images: string[];
            categorySlug: string;
            isFeatured: boolean;
            isBestSeller: boolean;
        }>,
    ) {
        return this.productsService.update(id, body);
    }

    @Delete('products/:id')
    deleteProduct(@Param('id') id: string) {
        return this.productsService.remove(id);
    }

    // ── Banners ───────────────────────────────────────────────────────────────
    @Get('banners')
    getAllBanners() {
        return this.bannersService.getAll();
    }

    @Post('banners')
    createBanner(
        @Body()
        body: {
            title: string;
            subtitle?: string;
            imageUrl: string;
            ctaLabel?: string;
            ctaLink?: string;
            section: string;
            isActive?: boolean;
            sortOrder?: number;
        },
    ) {
        return this.bannersService.create(body);
    }

    @Patch('banners/:id')
    updateBanner(
        @Param('id') id: string,
        @Body()
        body: Partial<{
            title: string;
            subtitle: string;
            imageUrl: string;
            ctaLabel: string;
            ctaLink: string;
            section: string;
            isActive: boolean;
            sortOrder: number;
        }>,
    ) {
        return this.bannersService.update(id, body);
    }

    @Delete('banners/:id')
    deleteBanner(@Param('id') id: string) {
        return this.bannersService.remove(id);
    }

    // ── Users ─────────────────────────────────────────────────────────────────
    @Get('users')
    getAllUsers() {
        return this.adminService.getAllUsers();
    }

    @Patch('users/:id/role')
    updateUserRole(
        @Param('id') id: string,
        @Body() body: { role: 'ADMIN' | 'USER' },
    ) {
        return this.adminService.updateUserRole(id, body.role);
    }
}
