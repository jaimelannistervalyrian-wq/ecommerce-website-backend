import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { WishlistService } from './wishlist.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import type { AuthUser } from '../../common/types';

@ApiTags('Wishlist')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('wishlist')
export class WishlistController {
    constructor(private readonly wishlistService: WishlistService) { }

    @Get()
    getWishlist(@CurrentUser() user: AuthUser) {
        return this.wishlistService.getWishlist(user.sub);
    }

    @Post('toggle')
    toggle(@CurrentUser() user: AuthUser, @Body() body: { productId: string }) {
        return this.wishlistService.toggle(user.sub, body.productId);
    }
}
