import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class ProductsService {
    constructor(private readonly prisma: PrismaService) { }

    async findAll(query: {
        page?: number;
        limit?: number;
        search?: string;
        category?: string;
        sort?: 'newest' | 'price_asc' | 'price_desc';
    }) {
        const page = query.page ?? 1;
        const limit = query.limit ?? 12;

        const where = {
            ...(query.search
                ? { name: { contains: query.search, mode: 'insensitive' as const } }
                : {}),
            ...(query.category ? { category: { slug: query.category } } : {}),
        };

        const orderBy =
            query.sort === 'price_asc'
                ? ({ price: 'asc' } as const)
                : query.sort === 'price_desc'
                    ? ({ price: 'desc' } as const)
                    : ({ createdAt: 'desc' } as const);

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

    async findOne(id: string) {
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
        if (!product) throw new NotFoundException('Product not found');
        return product;
    }

    async findRelated(id: string) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');
        return this.prisma.product.findMany({
            where: { categoryId: product.categoryId, NOT: { id } },
            take: 4,
            include: { category: true },
            orderBy: { rating: 'desc' },
        });
    }

    async addReview(userId: string, productId: string, input: { rating: number; comment: string }) {
        // Check product exists
        const product = await this.prisma.product.findUnique({ where: { id: productId } });
        if (!product) throw new NotFoundException('Product not found');

        const review = await this.prisma.review.create({
            data: { userId, productId, rating: input.rating, comment: input.comment },
            include: { user: { select: { fullName: true } } },
        });

        // Recalculate rating
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

    async create(input: {
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
    }) {
        const category = await this.prisma.category.findUnique({
            where: { slug: input.categorySlug },
        });
        if (!category) throw new NotFoundException(`Category '${input.categorySlug}' not found`);

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

    async update(
        id: string,
        input: Partial<{
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
        }>,
    ) {
        let categoryId: string | undefined;
        if (input.categorySlug) {
            const category = await this.prisma.category.findUnique({
                where: { slug: input.categorySlug },
            });
            if (!category) throw new NotFoundException(`Category '${input.categorySlug}' not found`);
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

    async remove(id: string) {
        const product = await this.prisma.product.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Product not found');
        await this.prisma.product.delete({ where: { id } });
        return { deleted: true, id };
    }
}
