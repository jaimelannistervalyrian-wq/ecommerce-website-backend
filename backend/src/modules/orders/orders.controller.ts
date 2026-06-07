import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import type { AuthUser } from '../../common/types';

@ApiTags('Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Get('me')
    myOrders(@CurrentUser() user: AuthUser) {
        return this.ordersService.getMyOrders(user.sub);
    }

    @Post('checkout-cod')
    checkoutCod(
        @CurrentUser() user: AuthUser,
        @Body() body: { addressId: string; couponCode?: string },
    ) {
        return this.ordersService.checkoutCod(user.sub, body);
    }
}
