import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma.service';

@Injectable()
export class BannersService {
    constructor(private readonly prisma: PrismaService) { }

    getActive() {
        return this.prisma.banner.findMany({
            where: { isActive: true },
            orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
        });
    }

    getAll() {
        return this.prisma.banner.findMany({
            orderBy: [{ section: 'asc' }, { sortOrder: 'asc' }],
        });
    }

    create(input: {
        title: string;
        subtitle?: string;
        imageUrl: string;
        ctaLabel?: string;
        ctaLink?: string;
        section: string;
        isActive?: boolean;
        sortOrder?: number;
    }) {
        return this.prisma.banner.create({
            data: {
                title: input.title,
                subtitle: input.subtitle,
                imageUrl: input.imageUrl,
                ctaLabel: input.ctaLabel,
                ctaLink: input.ctaLink,
                section: input.section,
                isActive: input.isActive ?? true,
                sortOrder: input.sortOrder ?? 0,
            },
        });
    }

    async update(
        id: string,
        input: Partial<{
            title: string;
            subtitle: string;
            imageUrl: string;
            ctaLabel: string;
            ctaLink: string;
            section: string;
            isActive: boolean;
            sortOrder: number;
        }>,
    ) {
        const banner = await this.prisma.banner.findUnique({ where: { id } });
        if (!banner) throw new NotFoundException('Banner not found');
        return this.prisma.banner.update({ where: { id }, data: input });
    }

    async remove(id: string) {
        const banner = await this.prisma.banner.findUnique({ where: { id } });
        if (!banner) throw new NotFoundException('Banner not found');
        await this.prisma.banner.delete({ where: { id } });
        return { deleted: true, id };
    }
}
