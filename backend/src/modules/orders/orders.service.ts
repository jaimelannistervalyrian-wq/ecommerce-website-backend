import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class OrdersService {
    constructor(private readonly prisma: PrismaService) { }

    getMyOrders(userId: string) {
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

    async checkoutCod(userId: string, input: { addressId: string; couponCode?: string }) {
        const cart = await this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: true },
        });
        if (!cart.length) throw new BadRequestException('Cart is empty');

        const address = await this.prisma.address.findUnique({ where: { id: input.addressId } });
        if (!address) throw new NotFoundException('Address not found');

        const subtotal = cart.reduce(
            (sum, c) => sum + Number(c.product.salePrice ?? c.product.price) * c.quantity,
            0,
        );

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

        // Clear cart after successful order
        await this.prisma.cartItem.deleteMany({ where: { userId } });

        return order;
    }

    // Admin: get all orders
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
}
