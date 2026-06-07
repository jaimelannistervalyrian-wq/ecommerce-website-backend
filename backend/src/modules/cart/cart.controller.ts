import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import type { AuthUser } from '../../common/types';

@ApiTags('Cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @Get()
    getCart(@CurrentUser() user: AuthUser) {
        return this.cartService.getCart(user.sub);
    }

    @Post('items')
    addItem(
        @CurrentUser() user: AuthUser,
        @Body() body: { productId: string; quantity: number },
    ) {
        return this.cartService.addItem(user.sub, body);
    }

    @Patch('items/:productId')
    updateItem(
        @CurrentUser() user: AuthUser,
        @Param('productId') productId: string,
        @Body() body: { quantity: number },
    ) {
        return this.cartService.updateItem(user.sub, productId, body.quantity);
    }

    @Delete('items/:productId')
    removeItem(
        @CurrentUser() user: AuthUser,
        @Param('productId') productId: string,
    ) {
        return this.cartService.removeItem(user.sub, productId);
    }

    @Delete()
    clearCart(@CurrentUser() user: AuthUser) {
        return this.cartService.clearCart(user.sub);
    }
}
