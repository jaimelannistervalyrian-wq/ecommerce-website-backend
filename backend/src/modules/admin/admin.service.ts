import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class AdminService {
    constructor(private readonly prisma: PrismaService) { }

    async getOverview() {
        const [ordersCount, usersCount, productsCount, revenue, recentOrders] =
            await this.prisma.$transaction([
                this.prisma.order.count(),
                this.prisma.user.count(),
                this.prisma.product.count(),
                this.prisma.order.aggregate({ _sum: { total: true } }),
                this.prisma.order.findMany({
                    take: 5,
                    orderBy: { createdAt: 'desc' },
                    include: {
                        user: { select: { fullName: true, email: true } },
                    },
                }),
            ]);

        return {
            ordersCount,
            usersCount,
            productsCount,
            totalRevenue: revenue._sum.total ?? 0,
            recentOrders,
        };
    }

    async updateOrderStatus(
        id: string,
        status: 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED',
    ) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order) throw new NotFoundException('Order not found');
        return this.prisma.order.update({ where: { id }, data: { status } });
    }

    getAllUsers() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                email: true,
                fullName: true,
                role: true,
                createdAt: true,
                _count: { select: { orders: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }

    async updateUserRole(id: string, role: 'ADMIN' | 'USER') {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, fullName: true, role: true },
        });
    }
}
