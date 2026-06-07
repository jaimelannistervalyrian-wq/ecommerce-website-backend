import { PrismaService } from '../../prisma.service';
export declare class ProductsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sort?: 'newest' | 'price_asc' | 'price_desc';
    }): Promise<{
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
    addReview(userId: string, productId: string, input: {
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
    create(input: {
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
    }): Promise<{
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
    }>;
    update(id: string, input: Partial<{
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
    }>): Promise<{
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
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}
