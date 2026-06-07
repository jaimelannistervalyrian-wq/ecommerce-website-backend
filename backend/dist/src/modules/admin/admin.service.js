"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let AdminService = class AdminService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getOverview() {
        const [ordersCount, usersCount, productsCount, revenue, recentOrders] = await this.prisma.$transaction([
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
    async updateOrderStatus(id, status) {
        const order = await this.prisma.order.findUnique({ where: { id } });
        if (!order)
            throw new common_1.NotFoundException('Order not found');
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
    async updateUserRole(id, role) {
        const user = await this.prisma.user.findUnique({ where: { id } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.user.update({
            where: { id },
            data: { role },
            select: { id: true, email: true, fullName: true, role: true },
        });
    }
};
exports.AdminService = AdminService;
exports.AdminService = AdminService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AdminService);
//# sourceMappingURL=admin.service.js.map