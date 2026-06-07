import { PrismaService } from '../../prisma.service';
export declare class CategoriesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(): import("@prisma/client").Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
}
