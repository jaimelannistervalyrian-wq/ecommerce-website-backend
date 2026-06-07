import { PrismaService } from '../../prisma.service';
export declare class BannersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getActive(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        ctaLabel: string | null;
        ctaLink: string | null;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    getAll(): import("@prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        ctaLabel: string | null;
        ctaLink: string | null;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }[]>;
    create(input: {
        title: string;
        subtitle?: string;
        imageUrl: string;
        ctaLabel?: string;
        ctaLink?: string;
        section: string;
        isActive?: boolean;
        sortOrder?: number;
    }): import("@prisma/client").Prisma.Prisma__BannerClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        ctaLabel: string | null;
        ctaLink: string | null;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
    update(id: string, input: Partial<{
        title: string;
        subtitle: string;
        imageUrl: string;
        ctaLabel: string;
        ctaLink: string;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        title: string;
        subtitle: string | null;
        imageUrl: string;
        ctaLabel: string | null;
        ctaLink: string | null;
        section: string;
        isActive: boolean;
        sortOrder: number;
    }>;
    remove(id: string): Promise<{
        deleted: boolean;
        id: string;
    }>;
}
