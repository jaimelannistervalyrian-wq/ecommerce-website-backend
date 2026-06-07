import { CartService } from './cart.service';
import type { AuthUser } from '../../common/types';
export declare class CartController {
    private readonly cartService;
    constructor(cartService: CartService);
    getCart(user: AuthUser): import("@prisma/client").Prisma.PrismaPromise<({
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
        updatedAt: Date;
        userId: string;
        productId: string;
        quantity: number;
    })[]>;
    addItem(user: AuthUser, body: {
        productId: string;
        quantity: number;
    }): Promise<{
        product: {
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
        updatedAt: Date;
        userId: string;
        productId: string;
        quantity: number;
    }>;
    updateItem(user: AuthUser, productId: string, body: {
        quantity: number;
    }): Promise<({
        product: {
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
        updatedAt: Date;
        userId: string;
        productId: string;
        quantity: number;
    }) | {
        removed: boolean;
    }>;
    removeItem(user: AuthUser, productId: string): Promise<{
        removed: boolean;
    }>;
    clearCart(user: AuthUser): Promise<{
        cleared: boolean;
    }>;
}
