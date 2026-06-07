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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let OrdersService = class OrdersService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getMyOrders(userId) {
        return this.prisma.order.findMany({
            where: { userId },
            include: {
                items: {
                    include: { product: { include: { category: true } } },
                },
                shippingAddress: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async checkoutCod(userId, input) {
        const cart = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (!cart.length)
            throw new common_1.BadRequestException('Cart is empty');
        const address = await this.prisma.address.findUnique({ where: { id: input.addressId } });
        if (!address)
            throw new common_1.NotFoundException('Address not found');
        const subtotal = cart.reduce((sum, c) => sum + Number(c.product.salePrice ?? c.product.price) * c.quantity, 0);
        let discount = 0;
        if (input.couponCode) {
            const coupon = await this.prisma.coupon.findUnique({
                where: { code: input.couponCode.toUpperCase() },
            });
            if (coupon?.active) {
                const now = new Date();
                if (!coupon.expiresAt || coupon.expiresAt > now) {
                    discount = (subtotal * coupon.percentage) / 100;
                }
            }
        }
        const shippingFee = subtotal >= 500 ? 0 : 25;
        const total = subtotal - discount + shippingFee;
        const order = await this.prisma.order.create({
            data: {
                userId,
                addressId: input.addressId,
                paymentMethod: 'COD',
                subtotal: subtotal.toFixed(2),
                discountAmount: discount.toFixed(2),
                shippingFee: shippingFee.toFixed(2),
                total: total.toFixed(2),
                items: {
                    create: cart.map((c) => ({
                        productId: c.productId,
                        quantity: c.quantity,
                        priceAtTime: Number(c.product.salePrice ?? c.product.price).toFixed(2),
                    })),
                },
            },
            include: {
                items: { include: { product: true } },
                shippingAddress: true,
            },
        });
        await this.prisma.cartItem.deleteMany({ where: { userId } });
        return order;
    }
    getAllOrders() {
        return this.prisma.order.findMany({
            include: {
                user: { select: { id: true, email: true, fullName: true } },
                items: { include: { product: true } },
                shippingAddress: true,
            },
            orderBy: { createdAt: 'desc' },
            take: 50,
        });
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map