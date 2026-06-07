import { PrismaService } from '../../prisma.service';
export declare class OrdersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getMyOrders(userId: string): import("@prisma/client").Prisma.PrismaPromise<({
        items: ({
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
    checkoutCod(userId: string, input: {
        addressId: string;
        couponCode?: string;
    }): Promise<{
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
}
