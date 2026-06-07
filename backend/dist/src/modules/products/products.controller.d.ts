import { ProductsService } from './products.service';
import type { AuthUser } from '../../common/types';
export declare class ProductsController {
    private readonly productsService;
    constructor(productsService: ProductsService);
    findAll(page?: string, limit?: string, search?: string, category?: string, sort?: 'newest' | 'price_asc' | 'price_desc'): Promise<{
        items: ({
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
        })[];
        page: number;
        limit: number;
        total: number;
        pages: number;
    }>;
    findOne(id: string): Promise<{
        category: {
            id: string;
            name: string;
            slug: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
        reviews: ({
            user: {
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            rating: number;
            comment: string;
            userId: string;
            productId: string;
        })[];
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
    }>;
    findRelated(id: string): Promise<({
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
    })[]>;
    addReview(user: AuthUser, id: string, body: {
        rating: number;
        comment: string;
    }): Promise<{
        user: {
            fullName: string;
        };
    } & {
        id: string;
        createdAt: Date;
        rating: number;
        comment: string;
        userId: string;
        productId: string;
    }>;
}
