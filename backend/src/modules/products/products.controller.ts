import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators';
import type { AuthUser } from '../../common/types';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'search', required: false })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'sort', required: false, enum: ['newest', 'price_asc', 'price_desc'] })
    findAll(
        @Query('page') page?: string,
        @Query('limit') limit?: string,
        @Query('search') search?: string,
        @Query('category') category?: string,
        @Query('sort') sort?: 'newest' | 'price_asc' | 'price_desc',
    ) {
        return this.productsService.findAll({
            page: page ? Number(page) : 1,
            limit: limit ? Number(limit) : 12,
            search,
            category,
            sort,
        });
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }

    @Get(':id/related')
    findRelated(@Param('id') id: string) {
        return this.productsService.findRelated(id);
    }

    @ApiBearerAuth()
    @UseGuards(JwtAuthGuard)
    @Post(':id/reviews')
    addReview(
        @CurrentUser() user: AuthUser,
        @Param('id') id: string,
        @Body() body: { rating: number; comment: string },
    ) {
        return this.productsService.addReview(user.sub, id, body);
    }
}
