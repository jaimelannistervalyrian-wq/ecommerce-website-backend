import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
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
}
