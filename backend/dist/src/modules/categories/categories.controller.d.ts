import { CategoriesService } from './categories.service';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
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
