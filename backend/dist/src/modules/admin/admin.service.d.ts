import { PrismaService } from '../../prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
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
    updateOrderStatus(id: string, status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'): Promise<{
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
    updateUserRole(id: string, role: 'ADMIN' | 'USER'): Promise<{
        id: string;
        email: string;
        fullName: string;
        role: import("@prisma/client").$Enums.Role;
    }>;
}
