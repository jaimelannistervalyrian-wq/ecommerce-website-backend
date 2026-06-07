import { WishlistService } from './wishlist.service';
import type { AuthUser } from '../../common/types';
export declare class WishlistController {
    private readonly wishlistService;
    constructor(wishlistService: WishlistService);
    getWishlist(user: AuthUser): import("@prisma/client").Prisma.PrismaPromise<({
        product: {
            category: {
                id: string;
                name: string;
                slug: string;
                description: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            name: string;
            slug: string;
            description: string;
            createdAt: Date;
            updatedAt: Date;
            salePrice: import("@prisma/client/runtime/library").Decimal | null;
            isFeatured: boolean;
            isBestSeller: boolean;
            rating: number;
            reviewCount: number;
            price: import("@prisma/client/runtime/library").Decimal;
            stock: number;
            images: string[];
            categoryId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        userId: string;
        productId: string;
    })[]>;
    toggle(user: AuthUser, body: {
        productId: string;
    }): Promise<{
        wishlisted: boolean;
    }>;
}
