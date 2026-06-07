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
exports.CartService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let CartService = class CartService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    getCart(userId) {
        return this.prisma.cartItem.findMany({
            where: { userId },
            include: { product: { include: { category: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async addItem(userId, input) {
        const product = await this.prisma.product.findUnique({ where: { id: input.productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.cartItem.upsert({
            where: { userId_productId: { userId, productId: input.productId } },
            update: { quantity: { increment: input.quantity || 1 } },
            create: { userId, productId: input.productId, quantity: input.quantity || 1 },
            include: { product: true },
        });
    }
    async updateItem(userId, productId, quantity) {
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
    async removeItem(userId, productId) {
        await this.prisma.cartItem.deleteMany({ where: { userId, productId } });
        return { removed: true };
    }
    async clearCart(userId) {
        await this.prisma.cartItem.deleteMany({ where: { userId } });
        return { cleared: true };
    }
};
exports.CartService = CartService;
exports.CartService = CartService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CartService);
//# sourceMappingURL=cart.service.js.map