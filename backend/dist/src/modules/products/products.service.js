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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma.service");
let ProductsService = class ProductsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 12;
        const where = {
            ...(query.search
                ? { name: { contains: query.search, mode: 'insensitive' } }
                : {}),
            ...(query.category ? { category: { slug: query.category } } : {}),
        };
        const orderBy = query.sort === 'price_asc'
            ? { price: 'asc' }
            : query.sort === 'price_desc'
                ? { price: 'desc' }
                : { createdAt: 'desc' };
        const [items, total] = await this.prisma.$transaction([
            this.prisma.product.findMany({
                where,
                orderBy,
                skip: (page - 1) * limit,
                take: limit,
                include: { category: true },
            }),
            this.prisma.product.count({ where }),
        ]);
        return { items, page, limit, total, pages: Math.ceil(total / limit) };
    }
    async findOne(id) {
        const product = await this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                reviews: {
                    include: { user: { select: { fullName: true } } },
                    orderBy: { createdAt: 'desc' },
                },
            },
        });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return product;
    }
    async findRelated(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        return this.prisma.product.findMany({
            where: { categoryId: product.categoryId, NOT: { id } },
            take: 4,
            include: { category: true },
            orderBy: { rating: 'desc' },
        });
    }
    async addReview(userId, productId, input) {
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        const review = await this.prisma.review.create({
            data: { userId, productId, rating: input.rating, comment: input.comment },
            include: { user: { select: { fullName: true } } },
        });
        const stats = await this.prisma.review.aggregate({
            where: { productId },
            _avg: { rating: true },
            _count: { rating: true },
        });
        await this.prisma.product.update({
            where: { id: productId },
            data: {
                rating: Math.round((stats._avg.rating ?? 0) * 10) / 10,
                reviewCount: stats._count.rating,
            },
        });
        return review;
    }
    async create(input) {
        const category = await this.prisma.category.findUnique({
            where: { slug: input.categorySlug },
        });
        if (!category)
            throw new common_1.NotFoundException(`Category '${input.categorySlug}' not found`);
        return this.prisma.product.create({
            data: {
                name: input.name,
                slug: input.slug,
                description: input.description,
                price: input.price.toFixed(2),
                salePrice: input.salePrice != null ? input.salePrice.toFixed(2) : undefined,
                stock: input.stock,
                images: input.images ?? [],
                categoryId: category.id,
                isFeatured: input.isFeatured ?? false,
                isBestSeller: input.isBestSeller ?? false,
            },
            include: { category: true },
        });
    }
    async update(id, input) {
        let categoryId;
        if (input.categorySlug) {
            const category = await this.prisma.category.findUnique({
                where: { slug: input.categorySlug },
            });
            if (!category)
                throw new common_1.NotFoundException(`Category '${input.categorySlug}' not found`);
            categoryId = category.id;
        }
        return this.prisma.product.update({
            where: { id },
            data: {
                ...(input.name !== undefined && { name: input.name }),
                ...(input.slug !== undefined && { slug: input.slug }),
                ...(input.description !== undefined && { description: input.description }),
                ...(input.price !== undefined && { price: input.price.toFixed(2) }),
                ...(input.salePrice !== undefined && {
                    salePrice: input.salePrice === null ? null : input.salePrice.toFixed(2),
                }),
                ...(input.stock !== undefined && { stock: input.stock }),
                ...(input.images !== undefined && { images: input.images }),
                ...(categoryId !== undefined && { categoryId }),
                ...(input.isFeatured !== undefined && { isFeatured: input.isFeatured }),
                ...(input.isBestSeller !== undefined && { isBestSeller: input.isBestSeller }),
            },
            include: { category: true },
        });
    }
    async remove(id) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product)
            throw new common_1.NotFoundException('Product not found');
        await this.prisma.product.delete({ where: { id } });
        return { deleted: true, id };
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProductsService);
//# sourceMappingURL=products.service.js.map