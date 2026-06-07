import { ProductsService } from '../products/products.service';
import { BannersService } from '../banners/banners.service';
import { OrdersService } from '../orders/orders.service';
import { AdminService } from './admin.service';
export declare class AdminController {
    private readonly adminService;
    private readonly productsService;
    private readonly bannersService;
    private readonly ordersService;
    constructor(adminService: AdminService, productsService: ProductsService, bannersService: BannersService, ordersService: OrdersService);
    getOverview(): Promise<{
        ordersCount: number;
        usersCount: number;
        productsCount: number;
        totalRevenue: number | import("@prisma/client/runtime/library").Decimal;
        recentOrders: ({
            user: {
                email: string;
                fullName: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            total: import("@prisma/client/runtime/library").Decimal;
            userId: string;
            addressId: string;
            status: import("@prisma/client").$Enums.OrderStatus;
            paymentMethod: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            shippingFee: import("@prisma/client/runtime/library").Decimal;
            discountAmount: import("@prisma/client/runtime/library").Decimal;
        })[];
    }>;
    getAllOrders(): import("@prisma/client").Prisma.PrismaPromise<({
        user: {
            id: string;
            email: string;
            fullName: string;
        };
        items: ({
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
            productId: string;
            quantity: number;
            priceAtTime: import("@prisma/client/runtime/library").Decimal;
            orderId: string;
        })[];
        shippingAddress: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            userId: string;
            line1: string;
            line2: string | null;
            city: string;
            state: string;
            postalCode: string;
            country: string;
            phone: string | null;
            isDefault: boolean;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        userId: string;
        addressId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentMethod: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingFee: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
    })[]>;
    updateOrderStatus(id: string, body: {
        status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        total: import("@prisma/client/runtime/library").Decimal;
        userId: string;
        addressId: string;
        status: import("@prisma/client").$Enums.OrderStatus;
        paymentMethod: string;
        subtotal: import("@prisma/client/runtime/library").Decimal;
        shippingFee: import("@prisma/client/runtime/library").Decimal;
        discountAmount: import("@prisma/client/runtime/library").Decimal;
    }>;
    createProduct(body: {
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
    updateProduct(id: string, body: Partial<{
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
    deleteProduct(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    getAllBanners(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        ctaLabel: string | null;
        ctaLink: string | null;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    createBanner(body: {
        title: string;
        subtitle?: string;
        imageUrl: string;
        ctaLabel?: string;
        ctaLink?: string;
        section: string;
        isActive?: boolean;
        sortOrder?: number;
    }): import("@prisma/client").Prisma.Prisma__BannerClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        ctaLabel: string | null;
        ctaLink: string | null;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    updateBanner(id: string, body: Partial<{
        title: string;
        subtitle: string;
        imageUrl: string;
        ctaLabel: string;
        ctaLink: string;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        ctaLabel: string | null;
        ctaLink: string | null;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }>;
    deleteBanner(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
    getAllUsers(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
        _count: {
            orders: number;
        };
    }[]>;
    updateUserRole(id: string, body: {
        role: 'ADMIN' | 'USER';
    }): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
