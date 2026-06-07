import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class CartService {
    constructor(private readonly prisma: PrismaService) { }

    getCart(userId: string) {
        return this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: { include: { category: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }

    async addItem(userId: string, input: { productId: string; quantity: number }) {
        const product = await this.prisma.product.findUnique({ where: { id: input.productId } });
        if (!product) throw new NotFoundException('Product not found');

        return this.prisma.cartItem.upsert({
            where: { userId_productId: { userId, productId: input.productId } },
            update: { quantity: { increment: input.quantity || 1 } },
            create: { userId, productId: input.productId, quantity: input.quantity || 1 },
            include: { product: true },
        });
    }

    async updateItem(userId: string, productId: string, quantity: number) {
        if (quantity <= 0) {
            await this.prisma.cartItem.deleteMany({ where: { userId, productId } });
            return { removed: true };
        }
        return this.prisma.cartItem.update({
            where: { userId_productId: { userId, productId } },
            data: { quantity },
            include: { product: true },
        });
    }

    async removeItem(userId: string, productId: string) {
        await this.prisma.cartItem.deleteMany({ where: { userId, productId } });
        return { removed: true };
    }

    async clearCart(userId: string) {
        await this.prisma.cartItem.deleteMany({ where: { userId } });
        return { cleared: true };
    }
}
