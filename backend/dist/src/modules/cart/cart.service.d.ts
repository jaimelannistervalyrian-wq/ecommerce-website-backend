import { PrismaService } from '../../prisma.service';
export declare class CartService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getCart(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
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
    addItem(userId: string, input: {
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
    updateItem(userId: string, productId: string, quantity: number): Promise<({
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
    removeItem(userId: string, productId: string): Promise<{
        removed: boolean;
    }>;
    clearCart(userId: string): Promise<{
        cleared: boolean;
    }>;
}
